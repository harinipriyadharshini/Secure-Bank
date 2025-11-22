# API Documentation - Voice Banking Assistant

## Base URL

```
http://localhost:8000
```

---

## Endpoints

### 1. POST /assistant

Main endpoint for processing voice commands and banking operations.

**Request**

```json
{
  "user_id": 1,
  "message": "Check my balance",
  "password": null
}
```

**Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | integer | Yes | ID of logged-in user (1-5) |
| `message` | string | Yes | Voice command text |
| `password` | string | No | Password for money transfers (2nd step) |

**Response (Success)**

```json
{
  "reply": "Your current account balance is ₹10000",
  "confidence": 0.95,
  "source": "deepseek",
  "page": "home",
  "data": {
    "require_password": false,
    "balance": 10000
  }
}
```

**Response Fields**
| Field | Type | Description |
|-------|------|-------------|
| `reply` | string | Voice output message |
| `confidence` | float | NLU confidence (0-1) |
| `source` | string | "deepseek" or "system" |
| `page` | string | Navigation target: "home", "transfer", "statements", null |
| `data` | object | Additional operation data |
| `data.require_password` | boolean | True if password needed (transfer 1st step) |
| `data.success` | boolean | Transaction success status |
| `data.balance` | integer | Updated balance after operation |
| `data.transaction_count` | integer | Number of transactions returned |
| `data.transactions` | array | Transaction details |

**Status Codes**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 422 | Invalid parameters |
| 500 | Server error |

**Error Response**

```json
{
  "reply": "User not found. Please log in again.",
  "confidence": 0,
  "source": "system",
  "page": null
}
```

---

## Intent Types

### CHECK_BALANCE

**Trigger Phrases**

- "Check my balance"
- "What's my balance?"
- "How much money do I have?"
- "Show my account balance"

**Request Example**

```json
{
  "user_id": 1,
  "message": "Check my balance",
  "password": null
}
```

**Response Example**

```json
{
  "reply": "Your current account balance is ₹10000",
  "confidence": 0.95,
  "source": "deepseek",
  "page": "home",
  "data": {
    "require_password": false,
    "balance": 10000
  }
}
```

**NLU Output**

```json
{
  "intent": "check_balance",
  "amount": null,
  "receiver": null,
  "transaction_count": null,
  "confidence": 0.95
}
```

---

### SEND_MONEY (2-Step Process)

#### Step 1: Request Transfer (Ask for Password)

**Trigger Phrases**

- "Send 500 to Ravi"
- "Transfer 1000 to John"
- "Pay 200 to Jane"
- "Give 300 to Mike"

**Request Example**

```json
{
  "user_id": 1,
  "message": "Send 500 to Ravi",
  "password": null
}
```

**Response Example (Step 1)**

```json
{
  "reply": "I'll send ₹500 to Ravi. Please confirm with your password.",
  "confidence": 0.92,
  "source": "deepseek",
  "page": null,
  "data": {
    "require_password": true,
    "success": false
  }
}
```

**NLU Output**

```json
{
  "intent": "send_money",
  "amount": 500,
  "receiver": "ravi",
  "transaction_count": null,
  "confidence": 0.92
}
```

#### Step 2: Confirm with Password

**Request Example**

```json
{
  "user_id": 1,
  "message": "Send 500 to Ravi",
  "password": "password123"
}
```

**Response Example (Step 2)**

```json
{
  "reply": "Successfully transferred ₹500 to Ravi. Your new balance is ₹9500.",
  "confidence": 0.92,
  "source": "deepseek",
  "page": "transfer",
  "data": {
    "require_password": false,
    "success": true,
    "balance": 9500
  }
}
```

**Validation Order**

1. ✅ User exists
2. ✅ Recipient exists
3. ✅ Amount > 0
4. ✅ Password matches (Step 2)
5. ✅ Balance >= Amount

**Error Responses**

Insufficient balance:

```json
{
  "reply": "Insufficient balance. You have ₹10000 but trying to send ₹50000.",
  "confidence": 0.92,
  "source": "deepseek",
  "page": null,
  "data": {
    "require_password": false,
    "success": false
  }
}
```

Invalid recipient:

```json
{
  "reply": "I can't find 'Unknown' in the system. Available contacts: Ravi, Jane, John, Mom, Mike.",
  "confidence": 0.92,
  "source": "deepseek",
  "page": null,
  "data": {
    "require_password": false,
    "success": false
  }
}
```

Wrong password:

```json
{
  "reply": "Incorrect password. Transaction cancelled.",
  "confidence": 0.92,
  "source": "deepseek",
  "page": null,
  "data": {
    "require_password": false,
    "success": false
  }
}
```

---

### TRANSACTION_HISTORY

**Trigger Phrases**

- "Show my transactions"
- "Show recent transactions"
- "Show last 5 transactions"
- "List previous 10 transactions"
- "What are my last 3 transactions?"

**Request Example (All)**

```json
{
  "user_id": 1,
  "message": "Show my transactions",
  "password": null
}
```

**Request Example (With Count)**

```json
{
  "user_id": 1,
  "message": "Show last 3 transactions",
  "password": null
}
```

**Response Example (All)**

```json
{
  "reply": "Your recent transactions: Received ₹5000 from Salary. Paid ₹2000 for groceries. Sent ₹1000 to Ravi. (and 1 more)",
  "confidence": 0.9,
  "source": "deepseek",
  "page": "statements",
  "data": {
    "require_password": false,
    "transaction_count": 4,
    "transactions": [
      {
        "type": "credit",
        "amount": 5000,
        "description": "Received ₹5000 from Salary",
        "timestamp": "2025-11-20 09:30",
        "balance_after": 10000
      },
      {
        "type": "debit",
        "amount": 2000,
        "description": "Paid ₹2000 for groceries",
        "timestamp": "2025-11-19 14:15",
        "balance_after": 8000
      },
      {
        "type": "debit",
        "amount": 1000,
        "description": "Sent ₹1000 to Ravi",
        "timestamp": "2025-11-18 11:45",
        "balance_after": 7000
      },
      {
        "type": "credit",
        "amount": 1500,
        "description": "Received ₹1500 from Mom",
        "timestamp": "2025-11-17 16:20",
        "balance_after": 8500
      }
    ]
  }
}
```

**Response Example (Count = 2)**

```json
{
  "reply": "Your recent transactions: Paid ₹2000 for groceries. Sent ₹1000 to Ravi.",
  "confidence": 0.92,
  "source": "deepseek",
  "page": "statements",
  "data": {
    "require_password": false,
    "transaction_count": 2,
    "transactions": [
      {
        "type": "debit",
        "amount": 2000,
        "description": "Paid ₹2000 for groceries",
        "timestamp": "2025-11-19 14:15",
        "balance_after": 8000
      },
      {
        "type": "debit",
        "amount": 1000,
        "description": "Sent ₹1000 to Ravi",
        "timestamp": "2025-11-18 11:45",
        "balance_after": 7000
      }
    ]
  }
}
```

**NLU Output**

```json
{
  "intent": "transaction_history",
  "amount": null,
  "receiver": null,
  "transaction_count": 3,
  "confidence": 0.93
}
```

**Transaction Object Structure**

```json
{
  "type": "debit|credit",
  "amount": 1000,
  "description": "Sent ₹1000 to Ravi",
  "timestamp": "2025-11-18 11:45",
  "balance_after": 7000
}
```

---

## Supporting Endpoints

### GET /health

Health check endpoint

**Request**

```
GET http://localhost:8000/health
```

**Response**

```json
{
  "status": "healthy",
  "service": "deepseek-banking-assistant"
}
```

---

### POST /test-nlu

Test NLU processing without banking operations

**Request**

```json
{
  "message": "Check my balance"
}
```

**Response**

```json
{
  "input": "Check my balance",
  "result": {
    "intent": "check_balance",
    "amount": null,
    "receiver": null,
    "transaction_count": null,
    "confidence": 0.95
  }
}
```

---

### GET /test-nlu-get

Test NLU with GET request

**Request**

```
GET http://localhost:8000/test-nlu-get?message=send%20500%20to%20ravi
```

**Response**

```json
{
  "input": "send 500 to ravi",
  "result": {
    "intent": "send_money",
    "amount": 500,
    "receiver": "ravi",
    "transaction_count": null,
    "confidence": 0.92
  }
}
```

---

## Request/Response Examples

### Example 1: Complete Transfer Flow

**Step 1: User initiates transfer**

```bash
curl -X POST http://localhost:8000/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "message": "Send 500 to Ravi",
    "password": null
  }'
```

**Response 1:**

```json
{
  "reply": "I'll send ₹500 to Ravi. Please confirm with your password.",
  "confidence": 0.92,
  "source": "deepseek",
  "page": null,
  "data": {
    "require_password": true,
    "success": false
  }
}
```

**Step 2: User provides password**

```bash
curl -X POST http://localhost:8000/assistant \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "message": "Send 500 to Ravi",
    "password": "password123"
  }'
```

**Response 2:**

```json
{
  "reply": "Successfully transferred ₹500 to Ravi. Your new balance is ₹9500.",
  "confidence": 0.92,
  "source": "deepseek",
  "page": "transfer",
  "data": {
    "require_password": false,
    "success": true,
    "balance": 9500
  }
}
```

---

## Rate Limiting

**Current Status**: Not implemented (development mode)

**Recommendation for Production**:

- Limit to 10 requests per minute per user
- Limit to 5 password attempts per 15 minutes
- Limit to 10 transactions per hour per user

---

## Error Handling

### Common Errors

**User Not Found (404)**

```json
{
  "reply": "User not found. Please log in again.",
  "confidence": 0,
  "source": "system",
  "page": null
}
```

**Low Confidence (Ambiguous Command)**

```json
{
  "reply": "I'm not sure what you want to do. I can help you: check balance, send money, or show transactions.",
  "confidence": 0.45,
  "source": "deepseek",
  "page": null,
  "data": {
    "require_password": false
  }
}
```

**Network Error**

```json
{
  "error": "Connection error",
  "message": "Failed to connect to backend"
}
```

---

## Authentication

**Current Implementation**: User ID only (demo)

**Frontend Authentication Flow**:

1. User logs in with User ID
2. User ID sent with every API request
3. Backend validates user exists
4. Money transfers require password

**Production Recommendations**:

- Implement JWT tokens
- Add session management
- Hash passwords with bcrypt
- Implement 2FA for transfers
- Add API key authentication

---

## Data Models

### User Object

```python
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",  # Hash in production
    "balance": 10000,
    "contacts": {
        "ravi": 3,
        "jane": 2,
        "mom": 4
    },
    "transactions": [...]
}
```

### Transaction Object

```python
{
    "type": "debit|credit",
    "amount": 500,
    "description": "Sent ₹500 to Ravi",
    "timestamp": "2025-11-23 14:30",
    "balance_after": 9500
}
```

### NLU Result Object

```python
{
    "intent": "check_balance|send_money|transaction_history|unknown",
    "amount": 500 or null,
    "receiver": "ravi" or null,
    "transaction_count": 5 or null,
    "confidence": 0.92
}
```

---

## Webhooks (Future)

**Planned Webhook Events**:

- `transaction.completed` - After successful transfer
- `balance.updated` - After balance change
- `password.failed` - After failed password attempt
- `transfer.initiated` - When transfer requested

---

## Rate Limiting Headers (Production)

**Expected Headers**:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 5
X-RateLimit-Reset: 1234567890
```

---

## Caching Strategy (Recommended)

**Cache Balance**: 30 seconds per user
**Cache Transaction History**: 1 minute per user
**Cache Contact List**: 5 minutes per user
**No Cache**: Transfers (real-time)

---

## Pagination (Future)

**Planned for large transaction lists**:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## API Versioning

**Current Version**: v1.0

**URL Structure** (Recommended for future):

```
/api/v1/assistant
/api/v2/assistant
```

---

## Testing API with cURL

**Check Balance**

```bash
curl -X POST http://localhost:8000/assistant \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "message": "Check my balance", "password": null}'
```

**Test NLU**

```bash
curl -X GET "http://localhost:8000/test-nlu-get?message=send%20500%20to%20ravi"
```

**Health Check**

```bash
curl http://localhost:8000/health
```

---

## Monitoring & Logging

### Logged Information

- User ID and message
- NLU result with confidence
- Transaction execution status
- Password attempt outcomes
- API response times

### Recommended Monitoring

- API response time (target: < 2 sec)
- Error rate (target: < 1%)
- NLU confidence (target: > 0.8)
- Transaction success rate (target: > 99%)

---

## Security Headers (Production)

**Recommended**:

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
X-XSS-Protection: 1; mode=block
```

---

## Changelog

**v1.0.0 - November 23, 2025**

- ✅ Initial release
- ✅ Balance check with navigation
- ✅ Money transfer with 2-step password
- ✅ Transaction history with count
- ✅ User data isolation
- ✅ Error handling and validation
