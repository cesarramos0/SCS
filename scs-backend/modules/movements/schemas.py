from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class MovementType(str, Enum):
    IN = "in"
    OUT = "out"


class MovementCreate(BaseModel):
    product_id: str
    type: MovementType
    quantity: int = Field(gt=0)
    reason: str
    device_item_ids: list[str] = Field(default_factory=list)


class MovementResponse(MovementCreate):
    id: str
    user_id: str
    timestamp: datetime

