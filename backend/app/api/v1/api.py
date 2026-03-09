from fastapi import APIRouter
from app.api.v1.endpoints import auth, merchants, users, addresses, geographies, emails

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(merchants.router, prefix="/merchants", tags=["merchants"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(addresses.router, prefix="/addresses", tags=["addresses"])
api_router.include_router(geographies.router, prefix="/geographies", tags=["geographies"])
api_router.include_router(emails.router, prefix="/emails", tags=["emails"])
