# backend/nlu/deepseek_service.py
import requests
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

class DeepSeekNLU:
    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY")
        self.api_url = "https://api.deepseek.com/v1/chat/completions"
        
    def classify_intent(self, user_text: str):
        """
        Use DeepSeek API for banking intent classification and entity extraction
        """
        if not self.api_key:
            return self._rule_based_fallback(user_text)
        
        system_prompt = """You are a banking intent classifier. Analyze the user's message and return ONLY valid JSON.

Response format:
{
    "intent": "check_balance", "send_money", "transaction_history", or "unknown",
    "amount": number or null,
    "receiver": string or null,
    "transaction_count": number or null,
    "confidence": number between 0.8-0.95
}

Examples:
- "check my balance" -> {"intent": "check_balance", "amount": null, "receiver": null, "transaction_count": null, "confidence": 0.95}
- "send 500 to ravi" -> {"intent": "send_money", "amount": 500, "receiver": "ravi", "transaction_count": null, "confidence": 0.92}
- "show my transactions" -> {"intent": "transaction_history", "amount": null, "receiver": null, "transaction_count": null, "confidence": 0.90}
- "show last 5 transactions" -> {"intent": "transaction_history", "amount": null, "receiver": null, "transaction_count": 5, "confidence": 0.93}
- "list previous 10 transactions" -> {"intent": "transaction_history", "amount": null, "receiver": null, "transaction_count": 10, "confidence": 0.92}
- "what's my balance" -> {"intent": "check_balance", "amount": null, "receiver": null, "transaction_count": null, "confidence": 0.93}
- "transfer 1000 to john" -> {"intent": "send_money", "amount": 1000, "receiver": "john", "transaction_count": null, "confidence": 0.94}
- "transaction history" -> {"intent": "transaction_history", "amount": null, "receiver": null, "transaction_count": null, "confidence": 0.91}

Return ONLY the JSON, no other text."""
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_text}
            ],
            "temperature": 0.1,
            "max_tokens": 200
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(self.api_url, json=payload, headers=headers, timeout=10)
            
            if response.status_code != 200:
                print(f"DeepSeek API error: {response.status_code}")
                return self._rule_based_fallback(user_text)
            
            result = response.json()
            content = result['choices'][0]['message']['content'].strip()
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                content = json_match.group(0)
            
            parsed_result = json.loads(content)
            
            # Validate result
            if parsed_result.get("intent") and parsed_result.get("confidence", 0) > 0.5:
                return parsed_result
            else:
                return self._rule_based_fallback(user_text)
                
        except Exception as e:
            print(f"DeepSeek API exception: {e}")
            return self._rule_based_fallback(user_text)
    
    def _rule_based_fallback(self, user_text: str):
        """
        Rule-based fallback when DeepSeek fails
        """
        text_lower = user_text.lower()
        
        # Balance check
        if any(word in text_lower for word in ['balance', 'how much', 'money left', 'account']):
            return {"intent": "check_balance", "amount": None, "receiver": None, "transaction_count": None, "confidence": 0.8}
        
        # Send money
        send_words = ['send', 'transfer', 'pay', 'give']
        if any(word in text_lower for word in send_words):
            # Extract amount
            amount_match = re.search(r'(\d+)', text_lower)
            amount = int(amount_match.group(1)) if amount_match else None
            
            # Extract receiver
            receiver_match = re.search(r'to\s+(\w+)', text_lower)
            receiver = receiver_match.group(1) if receiver_match else None
            
            return {"intent": "send_money", "amount": amount, "receiver": receiver, "transaction_count": None, "confidence": 0.8}
        
        # Transaction history
        if any(word in text_lower for word in ['transaction', 'history', 'statement', 'recent']):
            # Extract transaction count if mentioned
            count_match = re.search(r'(\d+)\s+(?:transaction|recent|last|previous)', text_lower)
            count = int(count_match.group(1)) if count_match else None
            
            return {"intent": "transaction_history", "amount": None, "receiver": None, "transaction_count": count, "confidence": 0.8}
        
        return {"intent": "unknown", "amount": None, "receiver": None, "transaction_count": None, "confidence": 0.3}

# Global instance
deepseek_nlu = DeepSeekNLU()