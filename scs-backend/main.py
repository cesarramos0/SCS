from pathlib import Path
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from modules.products.router import router as products_router
from modules.warehouses.router import router as warehouses_router
from modules.auth.router import router as auth_router
from modules.movements.router import router as movements_router

app = FastAPI(title="scs-backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
app.include_router(warehouses_router)
app.include_router(auth_router)
app.include_router(movements_router)

@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "scs-backend API"}