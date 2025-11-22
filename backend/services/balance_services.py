from database import db

def get_account_balance(user_id: int):
    # Example static simulation
    balance = db[user_id]["balance"]
    return f"Your current account balance is ₹{balance}"
