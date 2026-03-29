import threading
from typing import Callable, Optional

from PIL import Image

from betting_analyzer.analysis.claude_client import ClaudeClient
from betting_analyzer.capture.screen_capture import ScreenCapture
from betting_analyzer.database.history import HistoryDB


class GameAnalyzer:
    """
    Coordena captura de tela, análise com Claude e armazenamento no histórico.
    """

    def __init__(
        self,
        on_result: Callable[[dict, Image.Image], None],
        on_error: Optional[Callable[[str], None]] = None,
    ):
        self.on_result = on_result
        self.on_error = on_error
        self._claude = ClaudeClient()
        self._db = HistoryDB()
        self._capture = ScreenCapture(on_frame=self._handle_frame)
        self._analysis_lock = threading.Lock()
        self._analyzing = False
        self.session_id: Optional[int] = None

    def start_analysis(self):
        """Inicia uma nova sessão de análise."""
        self.session_id = self._db.new_session()
        self._capture.start()

    def stop_analysis(self):
        """Para a análise e fecha a sessão atual."""
        self._capture.stop()
        if self.session_id:
            self._db.close_session(self.session_id)
            self.session_id = None

    def set_region(self, region: dict):
        """Define a região da tela a ser monitorada."""
        self._capture.set_region(region)

    def get_stats(self) -> dict:
        """Retorna estatísticas gerais do histórico."""
        return self._db.get_stats()

    def get_history(self, limit: int = 50) -> list:
        """Retorna os últimos registros do histórico."""
        return self._db.get_history(limit=limit)

    def clear_history(self):
        """Limpa todo o histórico."""
        self._db.clear_history()

    @property
    def is_running(self) -> bool:
        return self._capture.is_running

    def _handle_frame(self, image: Image.Image):
        """Callback chamado pelo ScreenCapture a cada novo frame."""
        # Evita análises sobrepostas
        if not self._analysis_lock.acquire(blocking=False):
            return
        try:
            self._analyzing = True
            result = self._claude.analyze_frame(image)
            if result:
                if self.session_id:
                    self._db.save_analysis(self.session_id, result)
                self.on_result(result, image)
            else:
                if self.on_error:
                    self.on_error("Não foi possível analisar o frame.")
        except Exception as e:
            if self.on_error:
                self.on_error(str(e))
        finally:
            self._analyzing = False
            self._analysis_lock.release()
