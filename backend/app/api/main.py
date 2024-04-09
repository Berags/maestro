from fastapi import APIRouter, Depends

from app.api.routes import auth, composer, opus, recording

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(composer.router, prefix="/composer", tags=["composer"])
api_router.include_router(opus.router, prefix="/opus", tags=["opuses"])
api_router.include_router(recording.router, prefix="/recording", tags=["recording"])
