# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from nlu.deepseek_service import deepseek_nlu
from services.balance_services import get_account_balance
from services.transfer_service import send_money, verify_receiver_exists
from services.history_service import get_transaction_history, format_transactions
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("banking-assistant")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    user_id: int
    message: str
    password: Optional[str] = None


class TestQuery(BaseModel):
    message: str


CONFIDENCE_THRESHOLD = 0.6


@app.post("/assistant")
def process_text(data: Query):
    logger.info("User %d: %s", data.user_id, data.message)

    # Validate user exists
    from database import db

    if data.user_id not in db:
        return {
            "reply": "User not found. Please log in again.",
            "confidence": 0,
            "source": "system",
            "page": None,
        }

    # Process with DeepSeek
    nlu_result = deepseek_nlu.classify_intent(data.message)

    intent_name = nlu_result.get("intent")
    confidence = nlu_result.get("confidence", 0)
    amount = nlu_result.get("amount")
    receiver = nlu_result.get("receiver")
    transaction_count = nlu_result.get("transaction_count")

    logger.info("DeepSeek result: %s (conf: %s)", intent_name, confidence)

    # Low confidence handling
    if intent_name == "unknown" or confidence < CONFIDENCE_THRESHOLD:
        return {
            "reply": "I'm not sure what you want to do. I can help you: check balance, send money, or show transactions.",
            "confidence": confidence,
            "source": "deepseek",
            "page": None,
            "data": {"require_password": False},
        }

    # Handle intents
    if intent_name == "check_balance":
        balance_data = get_account_balance(data.user_id)
        if not balance_data:
            return {
                "reply": "Unable to retrieve balance.",
                "confidence": 0,
                "source": "system",
                "page": None,
                "data": {"require_password": False},
            }

        return {
            "reply": balance_data["message"],
            "confidence": confidence,
            "source": "deepseek",
            "page": "home",
            "data": {"require_password": False, "balance": balance_data["balance"]},
        }

    elif intent_name == "send_money":
        # Validate amount and receiver
        if not amount or not receiver:
            missing = []
            if not amount:
                missing.append("amount")
            if not receiver:
                missing.append("recipient")
            return {
                "reply": f"I need the {' and '.join(missing)} to send money. Example: 'Send 500 to Ravi'",
                "confidence": confidence,
                "source": "deepseek",
                "page": None,
                "data": {"require_password": False},
            }

        try:
            amount_val = int(amount)
            if amount_val <= 0:
                return {
                    "reply": "Amount must be positive.",
                    "confidence": confidence,
                    "source": "deepseek",
                    "page": None,
                    "data": {"require_password": False},
                }

            # Check if receiver exists first
            if not verify_receiver_exists(receiver):
                return {
                    "reply": f"I can't find '{receiver}' in the system. Available contacts: Ravi, Jane, John, Mom, Mike.",
                    "confidence": confidence,
                    "source": "deepseek",
                    "page": None,
                    "data": {"require_password": False},
                }

            # Process transaction
            transfer_result = send_money(
                data.user_id, amount_val, receiver, data.password
            )

            return {
                "reply": transfer_result["message"],
                "confidence": confidence,
                "source": "deepseek",
                "page": transfer_result["page"],
                "data": {
                    "require_password": transfer_result["require_password"],
                    "success": transfer_result["success"],
                    "balance": transfer_result.get("balance"),
                },
            }

        except ValueError:
            return {
                "reply": f"Invalid amount: {amount}. Please use numbers only.",
                "confidence": confidence,
                "source": "deepseek",
                "page": None,
                "data": {"require_password": False},
            }

    elif intent_name == "transaction_history":
        transactions = get_transaction_history(data.user_id, transaction_count)

        if not transactions:
            return {
                "reply": "No transactions found.",
                "confidence": confidence,
                "source": "deepseek",
                "page": None,
                "data": {"require_password": False},
            }

        # Format for voice output
        formatted_reply = format_transactions(transactions, transaction_count)

        return {
            "reply": formatted_reply,
            "confidence": confidence,
            "source": "deepseek",
            "page": "statements",
            "data": {
                "require_password": False,
                "transaction_count": len(transactions),
                "transactions": transactions,
            },
        }

    else:
        return {
            "reply": "I can help you check balance, send money, or show transactions.",
            "confidence": confidence,
            "source": "deepseek",
            "page": None,
            "data": {"require_password": False},
        }


@app.post("/test-nlu")
def test_nlu(data: TestQuery):
    """Test DeepSeek NLU processing"""
    result = deepseek_nlu.classify_intent(data.message)
    return {"input": data.message, "result": result}


@app.get("/test-nlu-get")
def test_nlu_get(message: str = "check my balance"):
    """GET endpoint for quick testing"""
    result = deepseek_nlu.classify_intent(message)
    return {"input": message, "result": result}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "deepseek-banking-assistant"}


@app.get("/")
def root():
    return {"message": "Banking Assistant API with DeepSeek"}
