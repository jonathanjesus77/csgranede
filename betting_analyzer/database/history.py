import json
import sqlite3
from datetime import datetime
from typing import List, Optional

from betting_analyzer.config import DB_PATH


class HistoryDB:
    """Gerencia o histórico de análises em SQLite."""

    def __init__(self):
        self._conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        self._lock = __import__("threading").Lock()
        self._create_tables()

    def _create_tables(self):
        with self._lock:
            self._conn.executescript("""
                CREATE TABLE IF NOT EXISTS sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    started_at TEXT NOT NULL,
                    ended_at TEXT
                );

                CREATE TABLE IF NOT EXISTS analyses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id INTEGER NOT NULL,
                    timestamp TEXT NOT NULL,
                    game_type TEXT,
                    game_name TEXT,
                    game_state TEXT,
                    suggestions TEXT,
                    alerts TEXT,
                    explanation TEXT,
                    confidence INTEGER,
                    risk_level TEXT,
                    FOREIGN KEY (session_id) REFERENCES sessions(id)
                );
            """)
            self._conn.commit()

    def new_session(self) -> int:
        """Cria uma nova sessão e retorna o ID."""
        with self._lock:
            cur = self._conn.execute(
                "INSERT INTO sessions (started_at) VALUES (?)",
                (datetime.now().isoformat(),)
            )
            self._conn.commit()
            return cur.lastrowid

    def close_session(self, session_id: int):
        """Marca o fim de uma sessão."""
        with self._lock:
            self._conn.execute(
                "UPDATE sessions SET ended_at = ? WHERE id = ?",
                (datetime.now().isoformat(), session_id)
            )
            self._conn.commit()

    def save_analysis(self, session_id: int, result: dict):
        """Salva uma análise no banco."""
        with self._lock:
            self._conn.execute(
                """INSERT INTO analyses
                   (session_id, timestamp, game_type, game_name, game_state,
                    suggestions, alerts, explanation, confidence, risk_level)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    session_id,
                    datetime.now().isoformat(),
                    result.get("game_type", ""),
                    result.get("game_name", ""),
                    result.get("game_state", ""),
                    json.dumps(result.get("suggestions", []), ensure_ascii=False),
                    json.dumps(result.get("alerts", []), ensure_ascii=False),
                    result.get("explanation", ""),
                    result.get("confidence", 0),
                    result.get("risk_level", "medium"),
                )
            )
            self._conn.commit()

    def get_history(self, limit: int = 50) -> List[dict]:
        """Retorna as últimas análises."""
        with self._lock:
            cur = self._conn.execute(
                "SELECT * FROM analyses ORDER BY id DESC LIMIT ?", (limit,)
            )
            cols = [d[0] for d in cur.description]
            rows = []
            for row in cur.fetchall():
                r = dict(zip(cols, row))
                r["suggestions"] = json.loads(r["suggestions"] or "[]")
                r["alerts"] = json.loads(r["alerts"] or "[]")
                rows.append(r)
            return rows

    def get_stats(self) -> dict:
        """Retorna estatísticas agregadas."""
        with self._lock:
            total = self._conn.execute("SELECT COUNT(*) FROM analyses").fetchone()[0]
            sessions = self._conn.execute("SELECT COUNT(*) FROM sessions").fetchone()[0]

            game_counts_cur = self._conn.execute(
                "SELECT game_type, COUNT(*) as cnt FROM analyses "
                "GROUP BY game_type ORDER BY cnt DESC"
            )
            game_counts = {row[0]: row[1] for row in game_counts_cur.fetchall()}

            avg_confidence = self._conn.execute(
                "SELECT AVG(confidence) FROM analyses"
            ).fetchone()[0] or 0

            risk_counts_cur = self._conn.execute(
                "SELECT risk_level, COUNT(*) as cnt FROM analyses "
                "WHERE risk_level IS NOT NULL GROUP BY risk_level"
            )
            risk_counts = {row[0]: row[1] for row in risk_counts_cur.fetchall()}

        return {
            "total_analyses": total,
            "total_sessions": sessions,
            "game_counts": game_counts,
            "avg_confidence": round(avg_confidence, 1),
            "risk_counts": risk_counts,
        }

    def clear_history(self):
        """Remove todos os registros."""
        with self._lock:
            self._conn.executescript("DELETE FROM analyses; DELETE FROM sessions;")
            self._conn.commit()
