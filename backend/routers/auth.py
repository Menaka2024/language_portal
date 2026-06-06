# backend/routers/auth.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from db.database import db
from services.email import send_verification_email
from dotenv import load_dotenv
import os, uuid

load_dotenv()

router     = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_ctx    = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM  = "HS256"

users_collection = db["users"]

class RegisterRequest(BaseModel):
    email:    EmailStr
    password: str

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


def create_token(data: dict, expires_minutes: int = 1440):
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    return jwt.encode(
        {**data, "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM
    )


@router.post("/register")
async def register(req: RegisterRequest):
    # check if user exists
    existing = await users_collection.find_one({"email": req.email})
    if existing:
        raise HTTPException(400, "Email already registered")

    # hash password
    hashed = pwd_ctx.hash(req.password)

    # create verification token
    token = create_token({"email": req.email}, expires_minutes=1440)

    # save user
    await users_collection.insert_one({
        "id":           str(uuid.uuid4()),
        "email":        req.email,
        "password":     hashed,
        "is_verified":  False,
        "created_at":   datetime.utcnow().isoformat(),
        "verify_token": token,
    })

    # send verification email
    await send_verification_email(req.email, token)

    return {"message": "Registration successful! Please check your email to verify your account."}


@router.get("/verify")
async def verify_email(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email   = payload.get("email")
    except:
        raise HTTPException(400, "Invalid or expired token")

    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(404, "User not found")

    if user.get("is_verified"):
        return {"message": "Email already verified!"}

    await users_collection.update_one(
        {"email": email},
        {"$set": {"is_verified": True, "verify_token": None}}
    )

    return {"message": "Email verified successfully! You can now login."}


@router.post("/login")
async def login(req: LoginRequest):
    user = await users_collection.find_one({"email": req.email})
    if not user:
        raise HTTPException(401, "Invalid email or password")

    if not pwd_ctx.verify(req.password, user["password"]):
        raise HTTPException(401, "Invalid email or password")

    if not user.get("is_verified"):
        raise HTTPException(403, "Please verify your email first")

    token = create_token({"email": user["email"], "id": user["id"]})
    return {
        "token": token,
        "email": user["email"],
    }