import tkinter as tk
from typing import Optional


class RegionSelector:
    """
    Overlay transparente para o usuário selecionar a região da tela a monitorar.
    Retorna dict {top, left, width, height} ou None se cancelado.
    """

    def __init__(self):
        self.result: Optional[dict] = None
        self._start_x = 0
        self._start_y = 0
        self._rect = None

    def select(self) -> Optional[dict]:
        """Abre o overlay e aguarda seleção. Bloqueia até o usuário terminar."""
        root = tk.Tk()
        root.attributes("-fullscreen", True)
        root.attributes("-alpha", 0.3)
        root.attributes("-topmost", True)
        root.configure(bg="black")
        root.title("Selecione a região - arraste e solte")

        canvas = tk.Canvas(root, cursor="cross", bg="black", highlightthickness=0)
        canvas.pack(fill=tk.BOTH, expand=True)

        label = tk.Label(
            root,
            text="Arraste para selecionar a região do jogo  |  ESC para cancelar",
            bg="black",
            fg="white",
            font=("Arial", 14),
        )
        label.place(relx=0.5, rely=0.03, anchor="center")

        def on_press(event):
            self._start_x = event.x
            self._start_y = event.y
            if self._rect:
                canvas.delete(self._rect)

        def on_drag(event):
            if self._rect:
                canvas.delete(self._rect)
            self._rect = canvas.create_rectangle(
                self._start_x, self._start_y, event.x, event.y,
                outline="lime", width=2, fill="",
            )

        def on_release(event):
            x1 = min(self._start_x, event.x)
            y1 = min(self._start_y, event.y)
            x2 = max(self._start_x, event.x)
            y2 = max(self._start_y, event.y)
            if (x2 - x1) > 10 and (y2 - y1) > 10:
                self.result = {"left": x1, "top": y1, "width": x2 - x1, "height": y2 - y1}
            root.destroy()

        def on_escape(event):
            root.destroy()

        canvas.bind("<ButtonPress-1>", on_press)
        canvas.bind("<B1-Motion>", on_drag)
        canvas.bind("<ButtonRelease-1>", on_release)
        root.bind("<Escape>", on_escape)

        root.mainloop()
        return self.result
