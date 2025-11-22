from database import db

def get_transaction_history(user_id: int, count: int = None):
    """Get transaction history for a user with optional count limit"""
    if user_id not in db:
        return None
    
    transactions = db[user_id]["transactions"]
    
    if count and count > 0:
        # Return last 'count' transactions
        return transactions[-count:]
    
    # Return all transactions
    return transactions


def format_transactions(transactions, count: int = None):
    """Format transactions for voice output"""
    if not transactions:
        return "No transactions found."
    
    if count and count > 0:
        transactions = transactions[-count:]
    
    formatted = []
    for i, txn in enumerate(transactions, 1):
        formatted.append(txn["description"])
    
    if len(formatted) == 1:
        return formatted[0]
    elif len(formatted) <= 5:
        return "Your recent transactions: " + ". ".join(formatted)
    else:
        return "Your recent transactions: " + ". ".join(formatted[:5]) + f" (and {len(formatted) - 5} more)"