# Testing Guide - Voice Banking Assistant

## Quick Start Testing

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open Browser

Navigate to `http://localhost:5173` and log in with:

- **User ID**: 1 (or 2-5)
- **Name**: John Doe (or other test users)

---

## Test Scenarios

### TEST 1: Balance Check ✓

**Objective**: Verify balance retrieval with voice and navigation

**Steps**:

1. Click the microphone button in Voice Assistant
2. Say: **"Check my balance"**
3. Wait for response

**Expected Output**:

- Voice: "Your current account balance is ₹10000"
- Page navigates to Home automatically
- Modal closes after 2 seconds

**Variations to Test**:

- "What's my balance?"
- "How much money do I have?"
- "Show my account balance"

**Success Criteria**: ✅ Correct balance announced, navigates to home page

---

### TEST 2: Money Transfer - Complete Flow ✓

**Objective**: Verify 2-step money transfer with password confirmation

**Steps**:

1. Click microphone
2. Say: **"Send 500 to Ravi"**
3. Wait for password prompt
4. Enter password: **`password123`**
5. Click "Confirm Transaction"

**Expected Output**:

- Voice: "I'll send ₹500 to Ravi. Please confirm with your password."
- Password modal appears
- Voice: "Successfully transferred ₹500 to Ravi. Your new balance is ₹9500."
- Page navigates to Transfer page
- Modal auto-closes

**Verification**:

- Login as Ravi (user_id: 3)
- Check balance: Should be ₹3500 (was 3000 + 500 from John)
- Check transaction history: Should show "Received ₹500 from John Doe"

**Variations to Test**:

- "Transfer 1000 to Jane"
- "Pay 200 to Mom"
- "Give 300 to Mike"

**Success Criteria**: ✅ Password required, transaction executed, balances updated for both parties

---

### TEST 3: Money Transfer - Incorrect Password ✗

**Objective**: Verify transaction is rejected with wrong password

**Steps**:

1. Click microphone
2. Say: **"Send 100 to Ravi"**
3. Enter password: **`wrongpassword`**
4. Click "Confirm Transaction"

**Expected Output**:

- Voice: "I'll send ₹100 to Ravi. Please confirm with your password."
- Voice: "Incorrect password. Transaction cancelled."
- Modal closes
- No transaction occurs

**Verification**:

- Check John's balance: Still ₹10000 (or current balance)
- Check Ravi's balance: Unchanged

**Success Criteria**: ✅ Wrong password rejected, transaction not executed

---

### TEST 4: Money Transfer - Insufficient Balance ✗

**Objective**: Verify transaction is blocked for insufficient funds

**Steps**:

1. Click microphone
2. Say: **"Send 50000 to Ravi"** (John only has 10000)
3. Wait for response (no password prompt should appear)

**Expected Output**:

- Voice: "Insufficient balance. You have ₹10000 but trying to send ₹50000."
- No password prompt
- Modal stays open

**Success Criteria**: ✅ Balance validated before password request

---

### TEST 5: Money Transfer - Invalid Recipient ✗

**Objective**: Verify transfer fails for non-existent recipient

**Steps**:

1. Click microphone
2. Say: **"Send 500 to Unknown"**
3. Wait for response

**Expected Output**:

- Voice: "I can't find 'Unknown' in the system. Available contacts: Ravi, Jane, John, Mom, Mike."
- No password prompt
- Modal stays open

**Success Criteria**: ✅ Recipient validation before password request

---

### TEST 6: Money Transfer - Missing Information ✗

**Objective**: Verify system asks for missing amount or recipient

**Steps**:

1. Click microphone
2. Say: **"Send to Ravi"** (missing amount)
3. Wait for response

**Expected Output**:

- Voice: "I need the amount and recipient to send money. Example: 'Send 500 to Ravi'"
- No password prompt

**Alternative Test**:

- Say: **"Send 500"** (missing recipient)

**Expected Output**:

- Voice: "I need the amount and recipient to send money. Example: 'Send 500 to Ravi'"

**Success Criteria**: ✅ System prompts for missing information

---

### TEST 7: Transaction History - All Transactions ✓

**Objective**: Verify transaction history retrieval without count

**Steps**:

1. Click microphone
2. Say: **"Show my transactions"**
3. Wait for response

**Expected Output**:

- Voice: "Your recent transactions: Received ₹5000 from Salary. Paid ₹2000 for groceries. Sent ₹1000 to Ravi. (and 1 more)"
- Page navigates to Statements
- Displays transaction details

**Success Criteria**: ✅ Lists all transactions, navigates to statements

---

### TEST 8: Transaction History - Last N Transactions ✓

**Objective**: Verify transaction count extraction and limiting

**Steps**:

1. Click microphone
2. Say: **"Show last 2 transactions"**
3. Wait for response

**Expected Output**:

- Voice: "Your recent transactions: Paid ₹2000 for groceries. Sent ₹1000 to Ravi."
- Page navigates to Statements

**Variations to Test**:

- "Show previous 3 transactions" → Lists 3 most recent
- "List last 1 transaction" → "Received ₹5000 from Salary"
- "Show me 5 transactions" → Lists 5 most recent

**Success Criteria**: ✅ Correctly extracts count and limits results

---

### TEST 9: Password Modal Cancel ✗

**Objective**: Verify user can cancel transaction

**Steps**:

1. Click microphone
2. Say: **"Send 200 to Ravi"**
3. Wait for password prompt
4. Click **"Cancel"** button
5. Wait for response

**Expected Output**:

- Voice: "I'll send ₹200 to Ravi. Please confirm with your password."
- Voice: "Transaction cancelled."
- Modal closes
- No transaction occurs

**Verification**:

- Check John's balance: Unchanged
- Check Ravi's balance: Unchanged

**Success Criteria**: ✅ Cancel button works, transaction aborted

---

### TEST 10: User Isolation ✓

**Objective**: Verify data isolation between users

**Steps**:

1. Login as John (user_id: 1)
2. Check balance: ₹10000
3. Logout
4. Login as Jane (user_id: 2)
5. Check balance: ₹7500

**Expected Output**:

- John sees only John's balance and transactions
- Jane sees only Jane's balance and transactions

**Variations to Test**:

- Check transaction history for different users
- Verify recipients are unique to each user's contacts

**Success Criteria**: ✅ Complete data isolation, no information leakage

---

### TEST 11: Cross-User Transaction ✓

**Objective**: Verify transaction correctly updates both parties

**Preparation**:

- Note John's balance: ₹10000
- Note Ravi's balance: ₹3000

**Steps**:

1. Login as John (user_id: 1)
2. Say: **"Send 500 to Ravi"**
3. Enter password: `password123`
4. Confirm transaction
5. Logout
6. Login as Ravi (user_id: 3)
7. Check balance and transactions

**Expected Results**:

John's state:

- Balance: ₹9500 (10000 - 500)
- Latest transaction: "Sent ₹500 to Ravi"

Ravi's state:

- Balance: ₹3500 (3000 + 500)
- Latest transaction: "Received ₹500 from John Doe"

**Success Criteria**: ✅ Both accounts updated correctly with timestamp

---

### TEST 12: Voice Synthesis ✓

**Objective**: Verify voice output is clear and audible

**Steps**:

1. Ensure browser volume is on
2. Click microphone
3. Say: **"Check my balance"**
4. Listen to voice response

**Expected Output**:

- Clear English (India) accent
- Slower speech rate (0.9) for clarity
- Complete sentence: "Your current account balance is ₹10000"

**Success Criteria**: ✅ Voice output is clear and complete

---

### TEST 13: Error Recovery ✓

**Objective**: Verify system handles errors gracefully

**Steps**:

1. Close backend server
2. Try to send a command
3. Wait for error response

**Expected Output**:

- Voice: "Connection error. Please try again."
- No crash or hang

**Success Criteria**: ✅ Graceful error handling

---

### TEST 14: Quick Actions Buttons ✓

**Objective**: Verify preset command buttons work

**Steps**:

1. In Voice Assistant, click the first quick action button
2. Wait for response

**Expected Output**:

- Should execute: "Check my balance"
- Voice responds with balance

**Variations**:

- Click "Show recent transactions" button
- Click "Send money to someone" button

**Success Criteria**: ✅ Quick action buttons trigger correct commands

---

## Stress Testing

### TEST 15: Multiple Rapid Requests

**Steps**:

1. Send 3 commands in quick succession
2. Wait for all responses

**Expected Output**:

- Each request processed in order
- No race conditions
- Previous speech cancelled before new speech

**Success Criteria**: ✅ Handles rapid requests

---

### TEST 16: Long Transaction History

**Setup**:

- Add more transactions to database
- Create user with 20+ transactions

**Steps**:

1. Say: **"Show all my transactions"**

**Expected Output**:

- Displays all transactions
- Formatted nicely: "Your recent transactions: ... (and X more)"
- Doesn't timeout

**Success Criteria**: ✅ Handles large transaction lists

---

## Regression Testing

### Before Each Deploy:

- [ ] TEST 1: Balance check works
- [ ] TEST 2: Money transfer with password works
- [ ] TEST 3: Wrong password rejected
- [ ] TEST 4: Insufficient balance rejected
- [ ] TEST 5: Invalid recipient rejected
- [ ] TEST 7: Transaction history works
- [ ] TEST 8: Transaction count works
- [ ] TEST 10: User isolation maintained
- [ ] TEST 11: Cross-user transaction updates both parties
- [ ] TEST 12: Voice output clear
- [ ] TEST 13: Error handling works

---

## Performance Benchmarks

| Operation           | Expected Time | Actual Time |
| ------------------- | ------------- | ----------- |
| Balance check       | < 1 sec       | **\_**      |
| Transfer (1st step) | < 2 sec       | **\_**      |
| Transfer (2nd step) | < 2 sec       | **\_**      |
| History retrieval   | < 1 sec       | **\_**      |
| Voice output        | 2-5 sec       | **\_**      |

---

## Known Issues / Edge Cases

### Issue 1: Speech Overlapping

**Description**: If user clicks mic while speech is playing
**Current Fix**: Previous speech cancelled with `speechSynthesis.cancel()`
**Status**: ✅ Resolved

### Issue 2: Browser Compatibility

**Description**: SpeechRecognition API not available in older browsers
**Current Fix**: Uses `window.SpeechRecognition || window.webkitSpeechRecognition`
**Tested Browsers**: Chrome, Edge, Firefox (partial)
**Status**: ✅ Handles gracefully

### Issue 3: Password Input Focus

**Description**: Password modal not auto-focusing on some browsers
**Current Fix**: Added `autoFocus` prop to input
**Status**: ✅ Resolved

---

## Troubleshooting Checklist

| Issue                     | Solution                                         |
| ------------------------- | ------------------------------------------------ |
| No voice output           | Check browser volume and microphone permissions  |
| Backend not responding    | Ensure `uvicorn main:app --reload` is running    |
| Frontend not loading      | Ensure `npm run dev` is running on port 5173     |
| Password won't submit     | Ensure password matches exactly (case-sensitive) |
| Transaction not executing | Check balance is sufficient and recipient exists |
| Wrong user's data         | Verify correct user_id is logged in              |
| DeepSeek API timeout      | Falls back to rule-based classification          |

---

## Test Report Template

```markdown
## Test Report - [Date]

**Tester**: ******\_\_\_******
**Browser**: ******\_\_\_******
**OS**: ******\_\_\_******

### Test Results

| Test                 | Status | Notes |
| -------------------- | ------ | ----- |
| Balance check        | ✅/❌  |       |
| Transfer success     | ✅/❌  |       |
| Wrong password       | ✅/❌  |       |
| Insufficient balance | ✅/❌  |       |
| Invalid recipient    | ✅/❌  |       |
| Transaction history  | ✅/❌  |       |
| Voice output         | ✅/❌  |       |
| Error handling       | ✅/❌  |       |

### Issues Found

- [ ] Issue 1: ...
- [ ] Issue 2: ...

### Summary

[Overall assessment]
```

---

## Sign-Off Checklist

- [ ] All tests passed
- [ ] No regressions from previous version
- [ ] Voice output is clear
- [ ] Password security working
- [ ] User isolation maintained
- [ ] Transaction history accurate
- [ ] Page navigation works
- [ ] Error messages helpful
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Ready for production
