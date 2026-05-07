from datetime import datetime, timezone

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from modules.movements.repository import MovementRepository
from modules.movements.schemas import MovementCreate, MovementResponse


class MovementService:
    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self.repository = MovementRepository(database)

    async def create_movement(self, data: MovementCreate, user_id: str) -> MovementResponse:
        payload = data.model_dump(mode="json")
        payload["user_id"] = user_id
        payload["timestamp"] = datetime.now(timezone.utc)

        movement_id = await self.repository.create(payload)
        created = await self.repository.collection.find_one({"_id": ObjectId(movement_id)})
        if created is None:
            raise ValueError("Movement not found")

        created["id"] = str(created.pop("_id"))
        return MovementResponse.model_validate(created)

    async def get_movements_by_product(self, product_id: str) -> list[MovementResponse]:
        movements = await self.repository.find_by_product_id(product_id)
        return [MovementResponse.model_validate(movement) for movement in movements]
