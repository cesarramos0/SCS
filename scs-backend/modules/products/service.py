from motor.motor_asyncio import AsyncIOMotorDatabase
from modules.products.repository import ProductRepository
from modules.products.schemas import ProductCreate, ProductResponse, ProductUpdate


class ProductService:
    def __init__(self, database: AsyncIOMotorDatabase) -> None:
        self.repository = ProductRepository(database)

    async def create_product(self, data: ProductCreate) -> ProductResponse:
        product_id = await self.repository.create(data.model_dump(mode="json"))
        product = await self.repository.find_by_id(product_id)
        if product is None:
            raise ValueError("Product not found")
        return ProductResponse.model_validate(product)

    async def get_product(self, product_id: str) -> ProductResponse:
        product = await self.repository.find_by_id(product_id)
        if product is None:
            raise ValueError("Product not found")
        return ProductResponse.model_validate(product)

    async def get_all_products(
        self,
        category: str | None = None,
        warehouse_id: str | None = None,
    ) -> list[ProductResponse]:
        filters: dict = {}
        if category:
            filters["category"] = category
        if warehouse_id:
            filters["warehouse_id"] = warehouse_id

        products = await self.repository.find_all(filters)
        return [ProductResponse.model_validate(product) for product in products]

    async def update_product(self, product_id: str, data: ProductUpdate) -> ProductResponse:
        existing = await self.repository.find_by_id(product_id)
        if existing is None:
            raise ValueError("Product not found")

        update_data = data.model_dump(exclude_none=True, exclude_unset=True, mode="json")
        if update_data:
            await self.repository.update(product_id, update_data)

        updated = await self.repository.find_by_id(product_id)
        if updated is None:
            raise ValueError("Product not found")
        return ProductResponse.model_validate(updated)

    async def delete_product(self, product_id: str) -> bool:
        return await self.repository.delete(product_id)
