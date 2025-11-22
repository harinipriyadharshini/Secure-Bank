from database import db

def send_money(user_id: int, amount: int, receiver: str):
    user = db[user_id]

    if user["balance"] < amount:
        return "Insufficient balance."

    user["balance"] -= amount
    user["transactions"].append(f"Sent ₹{amount} to {receiver}")

    return f"Transferred ₹{amount} to {receiver} successfully."
