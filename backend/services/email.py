# backend/services/email.py

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME   = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD   = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM       = os.getenv("MAIL_FROM"),
    MAIL_PORT       = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER     = os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS   = True,
    MAIL_SSL_TLS    = False,
    USE_CREDENTIALS = True,
)

async def send_verification_email(email: str, token: str):
    link = f"http://localhost:8000/api/auth/verify?token={token}"
    message = MessageSchema(
        subject    = "Verify your Language Resource Workbench account",
        recipients = [email],
        body       = f"""
        <h2>Welcome to Language Resource Workbench!</h2>
        <p>Click the link below to verify your email:</p>
        <a href="{link}">{link}</a>
        <p>This link expires in 24 hours.</p>
        """,
        subtype = "html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)