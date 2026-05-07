from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase


class ProductRepository:
    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self.collection = database["products"]

    @staticmethod
    def _serialize(document: dict | None) -> dict | None:
        if not document:
            return None
        document["id"] = str(document.pop("_id"))
        return document

    async def create(self, product: dict) -> str:
        result = await self.collection.insert_one(product)
        return str(result.inserted_id)

    async def find_by_id(self, product_id: str) -> dict | None:
        try:
            object_id = ObjectId(product_id)
        except InvalidId:
            return None

        document = await self.collection.find_one({"_id": object_id})
        return self._serialize(document)

    async def find_all(self, filters: dict = {}) -> list[dict]:
        documents = await self.collection.find(filters).to_list(length=None)
        return [self._serialize(document) for document in documents if document]

    async def update(self, product_id: str, data: dict) -> bool:
        try:
            object_id = ObjectId(product_id)
        except InvalidId:
            return False

        result = await self.collection.update_one({"_id": object_id}, {"$set": data})
        return result.modified_count > 0

    async def delete(self, product_id: str) -> bool:
        try:
            object_id = ObjectId(product_id)
        except InvalidId:
            return False

        result = await self.collection.delete_one({"_id": object_id})
        return result.deleted_count > 0
