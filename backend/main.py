# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from nlu.wit_client import parse_text_with_wit
from services.balance_services import get_account_balance
from services.transfer_service import send_money
from services.history_service import get_transaction_history
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("assistant")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Query(BaseModel):
    user_id: int
    message: str

CONFIDENCE_THRESHOLD = 0.55  # tune this

def extract_amount(entities: dict):
    # try the common Wit keys for money/amount
    candidates = [
        ("wit$amount_of_money:amount", "amount"),
        ("wit$amount:amount", "value"),
        ("amount_of_money:amount", "amount"),
        ("number:number", "value"),
    ]
    for key, subkey in candidates:
        if key in entities and isinstance(entities[key], list) and len(entities[key])>0:
            return entities[key][0].get(subkey) or entities[key][0].get("value")
    return None

def extract_receiver(entities: dict):
    # custom entity "receiver" could be named differently; check several keys
    for key in ["receiver:receiver", "contact:contact", "contact:person", "wit$contact:contact"]:
        if key in entities and isinstance(entities[key], list) and len(entities[key])>0:
            return entities[key][0].get("value")
    return None

@app.post("/assistant")
def process_text(data: Query):
    # Log the incoming text (very important for debugging STT problems)
    logger.info("Incoming text from frontend: %s", data.message)

    nlu = parse_text_with_wit(data.message)
    if nlu.get("error"):
        logger.error("Wit API error: %s", nlu)
        raise HTTPException(status_code=502, detail="Wit.ai error")

    logger.info("Wit response: %s", nlu)

    intents = nlu.get("intents", [])
    top_intent = intents[0] if intents else None
    intent_name = top_intent.get("name") if top_intent else None
    intent_conf = top_intent.get("confidence", 0) if top_intent else 0

    logger.info("Top intent: %s (conf=%s)", intent_name, intent_conf)

    # low confidence -> ask for clarification
    if not intent_name or intent_conf < CONFIDENCE_THRESHOLD:
        return {"reply": "I didn't understand. Could you please rephrase or be more specific?"}

    entities = nlu.get("entities", {})

    if intent_name == "check_balance":
        return {"reply": get_account_balance(data.user_id)}

    if intent_name == "send_money":
        amount = extract_amount(entities)
        receiver = extract_receiver(entities)
        if amount is None or receiver is None:
            return {"reply": "I need the amount and the recipient to send money. For example: 'Send 500 rupees to John.'"}
        try:
            amount_val = int(float(amount))
        except Exception:
            return {"reply": f"Couldn't parse the amount: {amount}. Please say a number like '500'."}
        return {"reply": send_money(data.user_id, amount_val, receiver)}

    if intent_name == "transaction_history":
        # optionally check for date ranges in entities...
        history = get_transaction_history(data.user_id)
        return {"reply": "\n".join(history)}

    # default fallback (shouldn't hit because of confidence check above)
    return {"reply": "I didn't understand. Can you please repeat?"}