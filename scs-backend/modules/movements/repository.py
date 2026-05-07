from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase


class MovementRepository:
    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self.collection = database["movements"]

    @staticmethod
    def _serialize(document: dict | None) -> dict | None:
        if not document:
            return None
        document["id"] = str(document.pop("_id"))
        return document

    async def create(self, movement: dict) -> str:
        result = await self.collection.insert_one(movement)
        return str(result.inserted_id)

    async def find_by_product_id(self, product_id: str) -> list[dict]:
        query: dict
        try:
            query = {"$or": [{"product_id": product_id}, {"product_id": ObjectId(product_id)}]}
        except InvalidId:
            query = {"product_id": product_id}

        documents = await self.collection.find(query).to_list(length=None)
        return [self._serialize(document) for document in documents if document]
