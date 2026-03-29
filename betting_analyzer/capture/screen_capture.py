import threading
import time
from typing import Callable, Optional, Dict

import mss
import mss.tools
from PIL import Image

from betting_analyzer.config import CAPTURE_INTERVAL, MAX_IMAGE_SIZE


class ScreenCapture:
    """Captura frames da tela em tempo real usando mss."""

    def __init__(self, on_frame: Callable[[Image.Image], None]):
        self.on_frame = on_frame
        self.region: Optional[Dict] = None  # {top, left, width, height}
        self._running = False
        self._thread: Optional[threading.Thread] = None

    def grab_region(self, region: Optional[Dict] = None) -> Optional[Image.Image]:
        """Captura um único frame da região selecionada."""
        with mss.mss() as sct:
            if region:
                monitor = region
            elif self.region:
                monitor = self.region
            else:
                monitor = sct.monitors[1]  # tela principal

            screenshot = sct.grab(monitor)
            image = Image.frombytes("RGB", screenshot.size, screenshot.rgb)
            image = self._resize(image)
            return image

    def _resize(self, image: Image.Image) -> Image.Image:
        """Redimensiona para o limite da Vision API."""
        image.thumbnail(MAX_IMAGE_SIZE, Image.LANCZOS)
        return image

    def start(self):
        """Inicia o loop de captura em background."""
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self):
        """Para o loop de captura."""
        self._running = False
        if self._thread:
            self._thread.join(timeout=5)
            self._thread = None

    def _loop(self):
        while self._running:
            try:
                frame = self.grab_region()
                if frame:
                    self.on_frame(frame)
            except Exception as e:
                print(f"[ScreenCapture] Erro ao capturar: {e}")
            time.sleep(CAPTURE_INTERVAL)

    def set_region(self, region: Dict):
        """Define a região de captura: {top, left, width, height}."""
        self.region = region

    @property
    def is_running(self) -> bool:
        return self._running
