
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None

    @classmethod
    async def connect_db(cls):
        cls.client = AsyncIOMotorClient("mongodb://localhost:27017")
        
    @classmethod
    async def close_db(cls):
        if cls.client:
            await cls.client.close()
            
    @classmethod
    def get_db(cls):
        return cls.client.freightfox if cls.client else None
