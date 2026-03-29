import base64
from io import BytesIO
from typing import Optional

import anthropic
from PIL import Image

from betting_analyzer.config import ANTHROPIC_API_KEY, MODEL

ANALYZE_TOOL = {
    "name": "analyze_casino_game",
    "description": "Retorna análise estruturada do jogo de cassino visível na tela.",
    "input_schema": {
        "type": "object",
        "properties": {
            "game_type": {
                "type": "string",
                "description": "Tipo de jogo: slot, roleta, blackjack, poker, baccarat, crash, outro"
            },
            "game_name": {
                "type": "string",
                "description": "Nome do jogo/slot se identificável (ex: 'Gates of Olympus', 'Sweet Bonanza')"
            },
            "game_state": {
                "type": "string",
                "description": "Estado atual: waiting_bet, spinning, result, bonus_round, free_spins, outro"
            },
            "suggestions": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Lista de sugestões de apostas baseadas no estado atual"
            },
            "alerts": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Alertas de oportunidade (value bet, bônus próximo) ou risco (sequência de perdas)"
            },
            "explanation": {
                "type": "string",
                "description": "Explicação clara do que está acontecendo na tela e contexto do jogo"
            },
            "confidence": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100,
                "description": "Confiança da análise de 0 a 100"
            },
            "risk_level": {
                "type": "string",
                "enum": ["low", "medium", "high"],
                "description": "Nível de risco atual da situação"
            }
        },
        "required": ["game_type", "game_state", "explanation", "confidence"]
    }
}

SYSTEM_PROMPT = (
    "Você é um especialista em análise de jogos de cassino online. "
    "Analise o screenshot fornecido e identifique o jogo e o estado atual com precisão. "
    "Use sempre a ferramenta analyze_casino_game para retornar sua análise de forma estruturada. "
    "Seja específico nas sugestões e alertas. Se não houver jogo de cassino visível na tela, "
    "informe no campo game_type como 'none' e explique o que está visível."
)


class ClaudeClient:
    """Integração com Claude Vision API para análise de jogos de cassino."""

    def __init__(self):
        if not ANTHROPIC_API_KEY:
            raise ValueError(
                "ANTHROPIC_API_KEY não configurada. "
                "Crie um arquivo .env com sua chave da Anthropic."
            )
        self.client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    def analyze_frame(self, image: Image.Image) -> Optional[dict]:
        """
        Envia um frame ao Claude Vision e retorna a análise estruturada.
        Retorna None em caso de erro.
        """
        base64_image = self._encode_image(image)

        try:
            response = self.client.messages.create(
                model=MODEL,
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                tools=[ANALYZE_TOOL],
                tool_choice={"type": "tool", "name": "analyze_casino_game"},
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/png",
                                    "data": base64_image,
                                },
                            },
                            {
                                "type": "text",
                                "text": "Analise este screenshot e identifique o jogo de cassino e situação atual."
                            }
                        ],
                    }
                ],
            )

            for block in response.content:
                if block.type == "tool_use" and block.name == "analyze_casino_game":
                    return block.input

        except anthropic.APIError as e:
            print(f"[ClaudeClient] Erro na API: {e}")
        except Exception as e:
            print(f"[ClaudeClient] Erro inesperado: {e}")

        return None

    def _encode_image(self, image: Image.Image) -> str:
        buffer = BytesIO()
        image.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")
