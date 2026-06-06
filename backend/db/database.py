# db/database.py

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME     = os.getenv("DB_NAME", "language_workbench")

client = AsyncIOMotorClient(MONGODB_URL)
db     = client[DB_NAME]

# collections
documents_collection = db["documents"]
jobs_collection      = db["jobs"]
users_collection     = db["users"]

async def get_db():
    return db