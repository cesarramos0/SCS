from fastapi import APIRouter, Depends, HTTPException, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from db.mongodb import get_database
from modules.products.schemas import ProductCreate, ProductResponse, ProductUpdate
from modules.products.service import ProductService

router = APIRouter(tags=["products"])


def get_product_service(db: AsyncIOMotorDatabase = Depends(get_database)) -> ProductService:
    return ProductService(db)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    return await service.create_product(data)


@router.get("", response_model=list[ProductResponse])
async def get_all_products(
    category: str | None = None,
    warehouse_id: str | None = None,
    service: ProductService = Depends(get_product_service),
) -> list[ProductResponse]:
    return await service.get_all_products(category=category, warehouse_id=warehouse_id)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    try:
        return await service.get_product(product_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found") from exc


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    data: ProductUpdate,
    service: ProductService = Depends(get_product_service),
) -> ProductResponse:
    try:
        return await service.update_product(product_id, data)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found") from exc


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    service: ProductService = Depends(get_product_service),
) -> Response:
    deleted = await service.delete_product(product_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
