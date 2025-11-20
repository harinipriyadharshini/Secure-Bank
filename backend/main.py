from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# Temporary in-memory storage
users = {
    "123456789": "password123"
}

otp_storage = {}  # {account_number: otp}


# Allow React frontend to call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later to specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------ MODELS ------------------

class LoginRequest(BaseModel):
    account_number: str
    password: str


class OTPVerify(BaseModel):
    account_number: str
    otp: str


# ------------------ ROUTES ------------------

@app.post("/login")
def login(data: LoginRequest):
    if data.account_number not in users:
        raise HTTPException(status_code=401, detail="Account number not found")

    if users[data.account_number] != data.password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Generate OTP when login is correct
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    otp_storage[data.account_number] = otp

    print("Generated OTP:", otp)  # for testing

    return {
        "message": "Login successful. OTP sent.",
        "otp": otp  # remove this in production
    }


@app.post("/send-otp")
def generate_otp(account_number: str):
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    otp_storage[account_number] = otp
    print("Resent OTP:", otp)
    return {"message": "OTP sent successfully", "otp": otp}


@app.post("/verify-otp")
def verify_otp(data: OTPVerify):
    if data.account_number not in otp_storage:
        raise HTTPException(status_code=400, detail="OTP not requested")

    if otp_storage[data.account_number] != data.otp:
        raise HTTPException(status_code=401, detail="Invalid OTP")

    # OTP correct → delete OTP
    del otp_storage[data.account_number]

    return {"message": "OTP verified successfully", "status": "verified"}
