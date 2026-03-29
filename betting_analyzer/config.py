import os
from dotenv import load_dotenv

load_dotenv()

# Claude API
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
MODEL = "claude-opus-4-6"

# Capture settings
CAPTURE_INTERVAL = 3  # seconds between captures
MAX_IMAGE_SIZE = (1568, 1568)  # max dimensions for Vision API (optimal)

# Database
DB_PATH = os.path.join(os.path.dirname(__file__), "betting_history.db")
