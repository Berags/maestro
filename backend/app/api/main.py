from fastapi import APIRouter, Depends

from app.api.routes import auth, composer

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(composer.router, prefix="/composer", tags=["composer"])
