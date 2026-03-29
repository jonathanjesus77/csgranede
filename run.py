"""
Betting Analyzer
================
App para análise de jogos de cassino/slots em tempo real usando Claude Vision API.

Como usar:
1. Instale as dependências:
   pip install -r betting_analyzer/requirements.txt

2. Configure sua API key:
   cp betting_analyzer/.env.example betting_analyzer/.env
   # edite o arquivo .env e insira sua ANTHROPIC_API_KEY

3. Execute:
   python run.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from betting_analyzer.main import main

if __name__ == "__main__":
    main()
