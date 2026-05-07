from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from core.config import settings

client = AsyncIOMotorClient(settings.mongodb_url)
database = client[settings.db_name]


async def get_database() -> AsyncIOMotorDatabase:
    return database
