from database import db

def get_transaction_history(user_id: int):
    return db[user_id]["transactions"]
