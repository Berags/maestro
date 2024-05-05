import jwt
from fastapi import APIRouter, Request, Response, UploadFile, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from starlette import status
from cloudinary import uploader
import uuid

from app.config import settings
from app.core.database import engine, providers_string, redis_cache
from app.core.models import User, Composer
from app.utils import security

router = APIRouter()    


@router.post("/composer/upload")
async def upload_image(image: UploadFile):
    upload_response = uploader.upload(
        image.file,
        public_id=image.filename + str(uuid.uuid4()),
        folder="composers",
        transformation=
        [{"width": 600, "height": 600, "crop": "auto", "gravity": "auto", "effect": "improve:50"}]
    )
    return {"message": "Image uploaded", "url": upload_response["secure_url"]}


@router.post("/composer/create")
async def create_composer(body: Composer, request: Request):
    with Session(engine) as session:
        current_user = session.exec(
            select(User).where(User.id == security.get_id(request.headers["authorization"]))).one_or_none()
        if not current_user.is_admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not an admin")
        
        composer = Composer(**body.dict())
        session.add(composer)
        session.commit()
