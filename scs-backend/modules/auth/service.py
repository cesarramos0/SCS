from core.security import get_password_hash, verify_password
from modules.auth.schemas import UserCreate, UserResponse

async def authenticate_user(email: str, password: str, db) -> dict | None:
    user = await db["users"].find_one({"email": email})
    if user is None:
        return None
    if not verify_password(password, user.get("password", "")):
        return None

    user["id"] = str(user.pop("_id"))
    return user


async def create_user(data: UserCreate, db) -> UserResponse:
    existing_user = await db["users"].find_one({"email": data.email})
    if existing_user is not None:
        raise ValueError("Email already registered")

    payload = data.model_dump(mode="json")
    payload["password"] = get_password_hash(data.password)

    result = await db["users"].insert_one(payload)
    created_user = await db["users"].find_one({"_id": result.inserted_id})
    if created_user is None:
        raise ValueError("Failed to create user")

    created_user["id"] = str(created_user.pop("_id"))
    created_user.pop("password", None)
    return UserResponse.model_validate(created_user)
