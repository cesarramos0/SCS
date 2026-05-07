from pydantic import BaseModel


class WarehouseCreate(BaseModel):
    name: str
    location: str


class WarehouseResponse(WarehouseCreate):
    id: str

