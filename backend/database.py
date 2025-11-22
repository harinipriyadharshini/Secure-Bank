# backend/database.py
from datetime import datetime

db = {
    1: {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123",  # In production, use hashed passwords
        "balance": 10000,
        "contacts": {
            "ravi": 3,
            "jane": 2,
            "mom": 4
        },
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
    },
    2: {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "password": "jane2024",
        "balance": 7500,
        "contacts": {
            "john": 1,
            "mike": 5,
            "ravi": 3
        },
        "transactions": [
            {
                "type": "credit",
                "amount": 3000,
                "description": "Received ₹3000 from Freelance",
                "timestamp": "2025-11-20 10:00",
                "balance_after": 7500
            },
            {
                "type": "debit",
                "amount": 500,
                "description": "Paid ₹500 for electricity",
                "timestamp": "2025-11-19 12:30",
                "balance_after": 7000
            },
            {
                "type": "debit",
                "amount": 2000,
                "description": "Sent ₹2000 to Mike",
                "timestamp": "2025-11-18 15:45",
                "balance_after": 5000
            },
            {
                "type": "debit",
                "amount": 150,
                "description": "Paid ₹150 for coffee",
                "timestamp": "2025-11-17 09:15",
                "balance_after": 4850
            }
        ]
    },
    3: {
        "name": "Ravi",
        "email": "ravi@example.com",
        "password": "ravi123",
        "balance": 3000,
        "contacts": {
            "john": 1,
            "jane": 2
        },
        "transactions": [
            {
                "type": "credit",
                "amount": 1000,
                "description": "Received ₹1000 from John Doe",
                "timestamp": "2025-11-18 11:45",
                "balance_after": 3000
            },
            {
                "type": "debit",
                "amount": 500,
                "description": "Paid ₹500 for mobile recharge",
                "timestamp": "2025-11-17 10:20",
                "balance_after": 2500
            }
        ]
    },
    4: {
        "name": "Mom",
        "email": "mom@example.com",
        "password": "mom1234",
        "balance": 25000,
        "contacts": {
            "john": 1
        },
        "transactions": [
            {
                "type": "debit",
                "amount": 1500,
                "description": "Sent ₹1500 to John Doe",
                "timestamp": "2025-11-17 16:20",
                "balance_after": 25000
            }
        ]
    },
    5: {
        "name": "Mike",
        "email": "mike@example.com",
        "password": "mike456",
        "balance": 5500,
        "contacts": {
            "jane": 2
        },
        "transactions": [
            {
                "type": "credit",
                "amount": 2000,
                "description": "Received ₹2000 from Jane Smith",
                "timestamp": "2025-11-18 15:45",
                "balance_after": 5500
            }
        ]
    }
}