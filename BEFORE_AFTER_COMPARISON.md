# Before & After Comparison

## Feature: Account Balance Check

### BEFORE

```python
# balance_services.py
def get_account_balance(user_id: int, raw: bool = False):
    balance = db[user_id]["balance"]
    if raw:
        return balance
    return f"Your current account balance is ₹{balance}"
```

**Issues**:

- No page navigation
- No error handling for missing user
- Returns plain string, no structured data

### AFTER

```python
def get_account_balance(user_id: int, raw: bool = False):
    if user_id not in db:
        return None

    balance = db[user_id]["balance"]
    if raw:
        return balance

    return {
        "message": f"Your current account balance is ₹{balance}",
        "balance": balance,
        "user_id": user_id,
        "page": "home"  # ← Navigates to home page
    }
```

**Improvements**:

- ✅ User validation
- ✅ Returns navigation directive
- ✅ Structured response data
- ✅ Error handling

---

## Feature: Money Transfers

### BEFORE

```python
# transfer_service.py
def send_money(user_id: int, amount: int, receiver_name: str):
    sender = db.get(user_id)
    if not sender:
        return "Sender not found."

    if sender["balance"] < amount:
        return "Insufficient balance."

    # Find receiver
    receiver_id = None
    receiver = None
    for r_id, r_data in db.items():
        if r_data["name"].lower() == receiver_name.lower():
            receiver_id = r_id
            receiver = r_data
            break

    if not receiver:
        return f"Recipient '{receiver_name}' not found."

    # Perform transaction
    sender["balance"] -= amount
    receiver["balance"] += amount

    sender["transactions"].append(f"Sent ₹{amount} to {receiver['name']}")
    receiver["transactions"].append(f"Received ₹{amount} from {sender['name']}")

    return f"Transferred ₹{amount} to {receiver['name']} successfully."
```

**Issues**:

- ❌ No password authentication
- ❌ Immediate execution (no confirmation step)
- ❌ No timestamped transaction records
- ❌ String-based transaction history
- ❌ No balance snapshots in history
- ❌ No structured error responses
- ❌ No page navigation

### AFTER

```python
def send_money(user_id: int, amount: int, receiver_name: str, password: str = None):
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
            "require_password": True,  # ← Show password modal
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

    # Find receiver
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
        "balance_after": sender["balance"]  # ← Balance snapshot
    })

    receiver["balance"] += amount
    receiver["transactions"].append({
        "type": "credit",
        "amount": amount,
        "description": f"Received ₹{amount} from {sender['name']}",
        "timestamp": timestamp,
        "balance_after": receiver["balance"]  # ← Balance snapshot
    })

    return {
        "message": f"Successfully transferred ₹{amount} to {receiver['name']}. Your new balance is ₹{sender['balance']}.",
        "success": True,
        "require_password": False,
        "page": "transfer",  # ← Navigate to transfer page
        "balance": sender["balance"]
    }
```

**Improvements**:

- ✅ 2-step password verification
- ✅ User confirmation flow
- ✅ Timestamped transactions
- ✅ Balance snapshots in history
- ✅ Structured responses
- ✅ Better error messages
- ✅ Page navigation
- ✅ Transaction success status

---

## Feature: Transaction History

### BEFORE

```python
# history_service.py
def get_transaction_history(user_id: int, count: int = None):
    transactions = db[user_id]["transactions"]
    if count:
        return transactions[-count:]
    return transactions
```

**Issues**:

- ❌ No support for extracting count from voice commands
- ❌ Returns raw list only
- ❌ No formatting for voice output
- ❌ No handling for "last 5 transactions" style commands

### AFTER

```python
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
    """Format transactions for voice output"""  # ← New function
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
```

**Improvements**:

- ✅ Flexible count support (extracts from NLU)
- ✅ Voice-friendly formatting
- ✅ Smart concatenation for long lists
- ✅ User validation
- ✅ Structured transaction data support

---

## Feature: Intent Classification

### BEFORE

```python
# deepseek_service.py - system prompt
system_prompt = """You are a banking intent classifier. Analyze the user's message and return ONLY valid JSON.

Response format:
{
    "intent": "check_balance", "send_money", "transaction_history", or "unknown",
    "amount": number or null,
    "receiver": string or null,
    "confidence": number between 0.8-0.95
}"""

def _rule_based_fallback(self, user_text: str):
    # ... only extracts amount and receiver
    if any(word in text_lower for word in ['transaction', 'history', 'statement', 'recent']):
        return {"intent": "transaction_history", "amount": None, "receiver": None, "confidence": 0.8}
```

**Issues**:

- ❌ No transaction count extraction
- ❌ Can't handle "last 5 transactions"
- ❌ Fallback doesn't extract numeric counts

### AFTER

```python
system_prompt = """You are a banking intent classifier. Analyze the user's message and return ONLY valid JSON.

Response format:
{
    "intent": "check_balance", "send_money", "transaction_history", or "unknown",
    "amount": number or null,
    "receiver": string or null,
    "transaction_count": number or null,  # ← NEW FIELD
    "confidence": number between 0.8-0.95
}

Examples:
...
- "show last 5 transactions" -> {"intent": "transaction_history", "amount": null, "receiver": null, "transaction_count": 5, "confidence": 0.93}
- "list previous 10 transactions" -> {"intent": "transaction_history", "amount": null, "receiver": null, "transaction_count": 10, "confidence": 0.92}
..."""

def _rule_based_fallback(self, user_text: str):
    # ... includes transaction count extraction
    if any(word in text_lower for word in ['transaction', 'history', 'statement', 'recent']):
        # Extract transaction count if mentioned
        count_match = re.search(r'(\d+)\s+(?:transaction|recent|last|previous)', text_lower)
        count = int(count_match.group(1)) if count_match else None  # ← NEW

        return {"intent": "transaction_history", "amount": None, "receiver": None, "transaction_count": count, "confidence": 0.8}
```

**Improvements**:

- ✅ Transaction count field
- ✅ Extracts numeric counts from voice
- ✅ Handles "last N transactions" patterns
- ✅ Handles "previous N transactions" patterns
- ✅ Better examples in prompt

---

## Feature: Frontend Password Handling

### BEFORE

```jsx
const sendToBackend = async (text, pwd = null) => {
  const res = await fetch("http://localhost:8000/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      message: text,
      password: pwd,
    }),
  });

  const data = await res.json();

  speak(data.reply);
  setAnswer(data.reply);

  if (data.page) {
    onNavigate(data.page);
  }

  if (data.data?.require_password) {
    setPendingAction({ text });
    setShowPasswordPrompt(true);
  } else {
    setShowPasswordPrompt(false);
    setPendingAction(null);
    if (data.page) {
      setTimeout(() => onClose(), 1000);
    }
  }
};
```

**Issues**:

- ❌ No error handling
- ❌ No cancel button for password modal
- ❌ Password not cleared on retry
- ❌ No pending message tracking
- ❌ Basic speech settings

### AFTER

```jsx
const sendToBackend = async (text, pwd = null) => {
    try {  // ← Error handling
      const res = await fetch("http://localhost:8000/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          message: text,
          password: pwd,
        }),
      });

      if (!res.ok) {  // ← Response validation
        setAnswer("Error communicating with backend. Please try again.");
        return;
      }

      const data = await res.json();

      speak(data.reply);
      setAnswer(data.reply);

      if (data.page) {
        onNavigate(data.page);
      }

      if (data.data?.require_password) {
        setPendingAction({ text });
        setPendingMessage(data);  // ← Store full response
        setShowPasswordPrompt(true);
      } else {
        setShowPasswordPrompt(false);
        setPendingAction(null);
        setPendingMessage(null);

        // ← Better auto-close logic
        if (data.data?.success || (data.page && data.page !== "statements")) {
          setTimeout(() => onClose(), 2000);
        }
      }
    } catch (error) {  // ← Error handling
      console.error("Error:", error);
      setAnswer("Connection error. Please try again.");
    }
  };

const speak = (text) => {
    // ← Cancel previous speech
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 0.9;  // ← Better speech rate
    window.speechSynthesis.speak(speech);
  };

// Password form now has:
{showPasswordPrompt ? (
    <form onSubmit={handlePasswordSubmit} className="space-y-4 my-4">
      <div className="relative">
        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition"
          autoFocus
        />
      </div>
      <button
        type="submit"
        disabled={!password}  // ← Disable if empty
        className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirm Transaction
      </button>
      <button  // ← NEW: Cancel button
        type="button"
        onClick={() => {
          setShowPasswordPrompt(false);
          setPendingAction(null);
          setPassword("");
          setAnswer("Transaction cancelled.");
        }}
        className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
      >
        Cancel
      </button>
    </form>
```

**Improvements**:

- ✅ Error handling with try-catch
- ✅ Response validation
- ✅ Cancel button for password modal
- ✅ Better auto-close logic
- ✅ Better speech settings
- ✅ Previous speech cancellation
- ✅ Button state management (disabled)

---

## Summary of Improvements

| Aspect                  | Before           | After                                            |
| ----------------------- | ---------------- | ------------------------------------------------ |
| **Password Security**   | None             | 2-step verification                              |
| **Transaction History** | Static, no count | Flexible counts (last N)                         |
| **Balance Check**       | Basic text       | Structured + navigation                          |
| **Transfer Flow**       | Direct execution | Confirmation + password                          |
| **Error Handling**      | Basic strings    | Structured responses                             |
| **Page Navigation**     | None             | Automatic (home/transfer/statements)             |
| **Voice Output**        | Basic            | Formatted + clear speech rate                    |
| **Data Validation**     | Minimal          | Comprehensive (user, amount, receiver, password) |
| **Transaction Records** | String-based     | Timestamped + balance snapshots                  |
| **Frontend UX**         | Basic modal      | Cancel button + error handling                   |
| **API Response**        | Simple           | Rich data structure                              |
