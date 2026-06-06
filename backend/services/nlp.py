import spacy
import json

nlp = spacy.load("en_core_web_sm")

def run_nlp(text: str) -> dict:
    doc    = nlp(text)
    tokens = [token.text for token in doc if not token.is_space]
    pos    = [{"token": token.text, "tag": token.pos_} for token in doc if not token.is_space]
    return {
        "tokens": json.dumps(tokens),
        "pos":    json.dumps(pos),
    }