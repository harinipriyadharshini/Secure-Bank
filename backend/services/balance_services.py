from database import db

def get_account_balance(user_id: int, raw: bool = False):
    """Get account balance for a user"""
    if user_id not in db:
        return None
    
    balance = db[user_id]["balance"]
    if raw:
        return balance
    
    user_name = db[user_id]["name"]
    return {
        "message": f"Your current account balance is ₹{balance}",
        "balance": balance,
        "user_id": user_id,
        "page": "home"
    }

def get_user_balance_raw(user_id: int):
    """Get raw balance value"""
    if user_id not in db:
        return None
    return db[user_id]["balance"]
