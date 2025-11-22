from database import db
from datetime import datetime

def send_money(user_id: int, amount: int, receiver_name: str, password: str = None):
    """
    Send money from one user to another with optional password verification
    Returns: dict with message, success status, and page navigation
    """
    sender = db.get(user_id)
    if not sender:
        return {
            "message": "Sender not found.",
            "success": False,
            "require_password": False,
            "page": None
        }

    # Check if password is required (for security)
    if password is None:
        # First call - ask for password
        return {
            "message": f"I'll send ₹{amount} to {receiver_name}. Please confirm with your password.",
            "success": False,
            "require_password": True,
            "page": None
        }

    # Verify password
    if sender.get("password") != password:
        return {
            "message": "Incorrect password. Transaction cancelled.",
            "success": False,
            "require_password": False,
            "page": None
        }

    # Check balance
    if sender["balance"] < amount:
        return {
            "message": f"Insufficient balance. You have ₹{sender['balance']} but trying to send ₹{amount}.",
            "success": False,
            "require_password": False,
            "page": None
        }

    # Find receiver by name (case-insensitive)
    receiver_id = None
    receiver = None
    for r_id, r_data in db.items():
        if r_data["name"].lower() == receiver_name.lower():
            receiver_id = r_id
            receiver = r_data
            break
    
    if not receiver:
        return {
            "message": f"Recipient '{receiver_name}' not found in your contacts.",
            "success": False,
            "require_password": False,
            "page": None
        }

    # Perform transaction
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    sender["balance"] -= amount
    sender["transactions"].append({
        "type": "debit",
        "amount": amount,
        "description": f"Sent ₹{amount} to {receiver['name']}",
        "timestamp": timestamp,
        "balance_after": sender["balance"]
    })
    
    receiver["balance"] += amount
    receiver["transactions"].append({
        "type": "credit",
        "amount": amount,
        "description": f"Received ₹{amount} from {sender['name']}",
        "timestamp": timestamp,
        "balance_after": receiver["balance"]
    })

    return {
        "message": f"Successfully transferred ₹{amount} to {receiver['name']}. Your new balance is ₹{sender['balance']}.",
        "success": True,
        "require_password": False,
        "page": "transfer",
        "balance": sender["balance"]
    }

def verify_receiver_exists(receiver_name: str):
    """Check if a receiver exists in the database"""
    for user_data in db.values():
        if user_data["name"].lower() == receiver_name.lower():
            return True
    return False

def get_user_contacts(user_id: int):
    """Get all contacts for a user"""
    if user_id not in db:
        return None
    return db[user_id].get("contacts", {})
