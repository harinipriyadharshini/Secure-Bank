# backend/nlu/wit_client.py
import requests
import os
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()
WIT_TOKEN = os.getenv("WIT_ACCESS_TOKEN")

def parse_text_with_wit(user_text: str) -> Dict[str, Any]:
    """
    Query Wit.ai message endpoint. Returns JSON dict.
    Uses params so requests handles URL-encoding.
    """
    if not WIT_TOKEN:
        raise RuntimeError("WIT_ACCESS_TOKEN not set in environment")

    url = "https://api.wit.ai/message"
    headers = {"Authorization": f"Bearer {WIT_TOKEN}"}
    params = {"v": "20230215", "q": user_text}

    resp = requests.get(url, headers=headers, params=params, timeout=10)
    try:
        resp.raise_for_status()
    except requests.HTTPError as e:
        # Return error info so callers can log/inspect
        return {"error": True, "status_code": resp.status_code, "text": resp.text}

    return resp.json()
