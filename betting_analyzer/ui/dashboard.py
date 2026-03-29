import threading
import tkinter as tk
from tkinter import messagebox, ttk
from typing import Optional

from PIL import Image, ImageTk

from betting_analyzer.analysis.game_analyzer import GameAnalyzer
from betting_analyzer.ui.region_selector import RegionSelector

# Cores
BG = "#1a1a2e"
PANEL = "#16213e"
ACCENT = "#0f3460"
GREEN = "#00b894"
YELLOW = "#fdcb6e"
RED = "#d63031"
TEXT = "#dfe6e9"
SUBTLE = "#636e72"

RISK_COLOR = {"low": GREEN, "medium": YELLOW, "high": RED}


class Dashboard:
    """Janela principal do Betting Analyzer."""

    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Betting Analyzer - Casino/Slots")
        self.root.configure(bg=BG)
        self.root.geometry("1100x700")
        self.root.resizable(True, True)

        self._analyzer: Optional[GameAnalyzer] = None
        self._last_image: Optional[Image.Image] = None
        self._pending_update: Optional[dict] = None
        self._pending_image: Optional[Image.Image] = None

        self._build_ui()
        self._init_analyzer()
        self._poll_updates()

    # ------------------------------------------------------------------ #
    #  UI Construction
    # ------------------------------------------------------------------ #

    def _build_ui(self):
        # Top bar
        topbar = tk.Frame(self.root, bg=ACCENT, height=50)
        topbar.pack(fill=tk.X)
        tk.Label(topbar, text="Betting Analyzer", bg=ACCENT, fg=TEXT,
                 font=("Arial", 16, "bold")).pack(side=tk.LEFT, padx=16, pady=8)

        self._status_label = tk.Label(topbar, text="Parado", bg=ACCENT, fg=SUBTLE,
                                      font=("Arial", 11))
        self._status_label.pack(side=tk.LEFT, padx=8)

        # Buttons
        btn_frame = tk.Frame(topbar, bg=ACCENT)
        btn_frame.pack(side=tk.RIGHT, padx=10)

        self._start_btn = tk.Button(btn_frame, text="▶  Iniciar", bg=GREEN, fg="white",
                                    font=("Arial", 11, "bold"), relief=tk.FLAT,
                                    padx=12, command=self._on_start)
        self._start_btn.pack(side=tk.LEFT, padx=4, pady=8)

        self._stop_btn = tk.Button(btn_frame, text="■  Parar", bg=RED, fg="white",
                                   font=("Arial", 11, "bold"), relief=tk.FLAT,
                                   padx=12, command=self._on_stop, state=tk.DISABLED)
        self._stop_btn.pack(side=tk.LEFT, padx=4, pady=8)

        tk.Button(btn_frame, text="Selecionar Região", bg=PANEL, fg=TEXT,
                  font=("Arial", 10), relief=tk.FLAT, padx=10,
                  command=self._on_select_region).pack(side=tk.LEFT, padx=4, pady=8)

        # Main content
        content = tk.Frame(self.root, bg=BG)
        content.pack(fill=tk.BOTH, expand=True, padx=10, pady=8)

        # Left: preview + analysis
        left = tk.Frame(content, bg=BG)
        left.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        self._build_preview(left)
        self._build_analysis_panel(left)

        # Right: history / stats tabs
        right = tk.Frame(content, bg=PANEL, width=340)
        right.pack(side=tk.RIGHT, fill=tk.BOTH, padx=(8, 0))
        right.pack_propagate(False)
        self._build_side_panel(right)

    def _build_preview(self, parent):
        frame = tk.LabelFrame(parent, text=" Preview ", bg=BG, fg=SUBTLE,
                               font=("Arial", 9), bd=1, relief=tk.SOLID)
        frame.pack(fill=tk.X, pady=(0, 6))

        self._preview_label = tk.Label(frame, bg="#0d0d0d",
                                        text="Nenhum frame capturado", fg=SUBTLE,
                                        font=("Arial", 10))
        self._preview_label.pack(fill=tk.X, ipady=60)

    def _build_analysis_panel(self, parent):
        frame = tk.LabelFrame(parent, text=" Análise Atual ", bg=BG, fg=TEXT,
                               font=("Arial", 10, "bold"), bd=1, relief=tk.SOLID)
        frame.pack(fill=tk.BOTH, expand=True)

        # Row 1: game info
        info_row = tk.Frame(frame, bg=BG)
        info_row.pack(fill=tk.X, padx=8, pady=(8, 0))

        self._game_type_lbl = tk.Label(info_row, text="Jogo: —", bg=BG, fg=TEXT,
                                        font=("Arial", 12, "bold"))
        self._game_type_lbl.pack(side=tk.LEFT)

        self._confidence_lbl = tk.Label(info_row, text="Confiança: —", bg=BG,
                                         fg=SUBTLE, font=("Arial", 10))
        self._confidence_lbl.pack(side=tk.RIGHT)

        self._state_lbl = tk.Label(frame, text="Estado: —", bg=BG, fg=YELLOW,
                                    font=("Arial", 10))
        self._state_lbl.pack(anchor=tk.W, padx=8)

        self._risk_lbl = tk.Label(frame, text="Risco: —", bg=BG, fg=SUBTLE,
                                   font=("Arial", 10))
        self._risk_lbl.pack(anchor=tk.W, padx=8, pady=(0, 6))

        # Explanation
        tk.Label(frame, text="Explicação:", bg=BG, fg=SUBTLE,
                 font=("Arial", 9)).pack(anchor=tk.W, padx=8)
        self._explanation_text = tk.Text(frame, bg=PANEL, fg=TEXT, font=("Arial", 10),
                                          height=4, relief=tk.FLAT, wrap=tk.WORD,
                                          state=tk.DISABLED)
        self._explanation_text.pack(fill=tk.X, padx=8, pady=(2, 6))

        # Suggestions
        tk.Label(frame, text="Sugestões:", bg=BG, fg=SUBTLE,
                 font=("Arial", 9)).pack(anchor=tk.W, padx=8)
        self._suggestions_text = tk.Text(frame, bg=PANEL, fg=GREEN, font=("Arial", 10),
                                          height=4, relief=tk.FLAT, wrap=tk.WORD,
                                          state=tk.DISABLED)
        self._suggestions_text.pack(fill=tk.X, padx=8, pady=(2, 6))

        # Alerts
        tk.Label(frame, text="Alertas:", bg=BG, fg=SUBTLE,
                 font=("Arial", 9)).pack(anchor=tk.W, padx=8)
        self._alerts_text = tk.Text(frame, bg=PANEL, fg=YELLOW, font=("Arial", 10),
                                     height=3, relief=tk.FLAT, wrap=tk.WORD,
                                     state=tk.DISABLED)
        self._alerts_text.pack(fill=tk.X, padx=8, pady=(2, 8))

    def _build_side_panel(self, parent):
        nb = ttk.Notebook(parent)
        nb.pack(fill=tk.BOTH, expand=True, padx=6, pady=6)

        # History tab
        hist_frame = tk.Frame(nb, bg=PANEL)
        nb.add(hist_frame, text="Histórico")

        self._history_list = tk.Listbox(hist_frame, bg=PANEL, fg=TEXT,
                                         font=("Arial", 9), relief=tk.FLAT,
                                         selectbackground=ACCENT,
                                         activestyle="none")
        scroll = tk.Scrollbar(hist_frame, command=self._history_list.yview)
        self._history_list.configure(yscrollcommand=scroll.set)
        scroll.pack(side=tk.RIGHT, fill=tk.Y)
        self._history_list.pack(fill=tk.BOTH, expand=True)

        tk.Button(hist_frame, text="Limpar Histórico", bg=RED, fg="white",
                  font=("Arial", 9), relief=tk.FLAT,
                  command=self._on_clear_history).pack(fill=tk.X, pady=4)

        # Stats tab
        stats_frame = tk.Frame(nb, bg=PANEL)
        nb.add(stats_frame, text="Estatísticas")

        self._stats_text = tk.Text(stats_frame, bg=PANEL, fg=TEXT, font=("Arial", 10),
                                    relief=tk.FLAT, state=tk.DISABLED)
        self._stats_text.pack(fill=tk.BOTH, expand=True)

        tk.Button(stats_frame, text="Atualizar", bg=ACCENT, fg="white",
                  font=("Arial", 9), relief=tk.FLAT,
                  command=self._refresh_stats).pack(fill=tk.X, pady=4)

    # ------------------------------------------------------------------ #
    #  Analyzer Lifecycle
    # ------------------------------------------------------------------ #

    def _init_analyzer(self):
        try:
            self._analyzer = GameAnalyzer(
                on_result=self._on_analysis_result,
                on_error=self._on_analysis_error,
            )
        except ValueError as e:
            messagebox.showerror("Configuração", str(e))

    def _on_start(self):
        if not self._analyzer:
            self._init_analyzer()
            if not self._analyzer:
                return
        self._analyzer.start_analysis()
        self._start_btn.config(state=tk.DISABLED)
        self._stop_btn.config(state=tk.NORMAL)
        self._set_status("Analisando...", GREEN)

    def _on_stop(self):
        if self._analyzer:
            self._analyzer.stop_analysis()
        self._start_btn.config(state=tk.NORMAL)
        self._stop_btn.config(state=tk.DISABLED)
        self._set_status("Parado", SUBTLE)
        self._refresh_stats()
        self._refresh_history()

    def _on_select_region(self):
        was_running = self._analyzer and self._analyzer.is_running
        if was_running:
            self._on_stop()

        # Run selector in a thread to avoid blocking Tk main loop
        def do_select():
            selector = RegionSelector()
            region = selector.select()
            if region and self._analyzer:
                self._analyzer.set_region(region)
                self._set_status(
                    f"Região: {region['width']}x{region['height']} @ ({region['left']},{region['top']})",
                    YELLOW
                )
            if was_running:
                self.root.after(200, self._on_start)

        threading.Thread(target=do_select, daemon=True).start()

    # ------------------------------------------------------------------ #
    #  Analysis Callbacks (called from background thread)
    # ------------------------------------------------------------------ #

    def _on_analysis_result(self, result: dict, image: Image.Image):
        self._pending_update = result
        self._pending_image = image

    def _on_analysis_error(self, error: str):
        self.root.after(0, lambda: self._set_status(f"Erro: {error}", RED))

    # ------------------------------------------------------------------ #
    #  UI Update (main thread via polling)
    # ------------------------------------------------------------------ #

    def _poll_updates(self):
        if self._pending_update:
            result = self._pending_update
            image = self._pending_image
            self._pending_update = None
            self._pending_image = None
            self._update_analysis_panel(result)
            if image:
                self._update_preview(image)
            self._refresh_history()

        self.root.after(500, self._poll_updates)

    def _update_preview(self, image: Image.Image):
        preview_w = self._preview_label.winfo_width() or 400
        img = image.copy()
        img.thumbnail((preview_w, 220), Image.LANCZOS)
        photo = ImageTk.PhotoImage(img)
        self._preview_label.configure(image=photo, text="")
        self._preview_label.image = photo  # keep reference

    def _update_analysis_panel(self, result: dict):
        game = result.get("game_type", "—")
        name = result.get("game_name", "")
        display_game = f"{game} — {name}" if name else game

        self._game_type_lbl.config(text=f"Jogo: {display_game}")
        self._state_lbl.config(text=f"Estado: {result.get('game_state', '—')}")

        conf = result.get("confidence", 0)
        self._confidence_lbl.config(text=f"Confiança: {conf}%")

        risk = result.get("risk_level", "medium")
        self._risk_lbl.config(text=f"Risco: {risk.upper()}",
                               fg=RISK_COLOR.get(risk, TEXT))

        self._set_text(self._explanation_text, result.get("explanation", ""))

        suggestions = result.get("suggestions", [])
        self._set_text(self._suggestions_text,
                        "\n".join(f"• {s}" for s in suggestions) if suggestions else "Nenhuma sugestão")

        alerts = result.get("alerts", [])
        self._set_text(self._alerts_text,
                        "\n".join(f"⚠ {a}" for a in alerts) if alerts else "Sem alertas")

    def _set_text(self, widget: tk.Text, text: str):
        widget.config(state=tk.NORMAL)
        widget.delete("1.0", tk.END)
        widget.insert(tk.END, text)
        widget.config(state=tk.DISABLED)

    def _refresh_history(self):
        if not self._analyzer:
            return
        history = self._analyzer.get_history(limit=100)
        self._history_list.delete(0, tk.END)
        for item in history:
            ts = item["timestamp"][:19].replace("T", " ")
            game = item.get("game_type", "?")
            name = item.get("game_name", "")
            conf = item.get("confidence", 0)
            label = f"{ts}  {game}"
            if name:
                label += f" ({name})"
            label += f"  [{conf}%]"
            self._history_list.insert(tk.END, label)

    def _refresh_stats(self):
        if not self._analyzer:
            return
        stats = self._analyzer.get_stats()
        lines = [
            f"Total de análises: {stats['total_analyses']}",
            f"Sessões: {stats['total_sessions']}",
            f"Confiança média: {stats['avg_confidence']}%",
            "",
            "Jogos detectados:",
        ]
        for game, cnt in stats.get("game_counts", {}).items():
            lines.append(f"  {game}: {cnt}x")
        lines.append("")
        lines.append("Distribuição de risco:")
        for level, cnt in stats.get("risk_counts", {}).items():
            lines.append(f"  {level}: {cnt}x")

        self._set_text(self._stats_text, "\n".join(lines))

    def _on_clear_history(self):
        if self._analyzer and messagebox.askyesno(
            "Confirmar", "Limpar todo o histórico?"
        ):
            self._analyzer.clear_history()
            self._refresh_history()
            self._refresh_stats()

    def _set_status(self, text: str, color: str = TEXT):
        self._status_label.config(text=text, fg=color)
