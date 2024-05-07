import jwt
from fastapi import APIRouter, Request, Response, UploadFile, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from starlette import status
from cloudinary import uploader
import uuid

from app.config import settings
from app.core.database import engine, providers_string, redis_cache, search
from app.core.models import User, Composer, Opus, Recording
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
async def create_composer(body: CreateComposer, request: Request):
    with Session(engine) as session:
        current_user = session.exec(
            select(User).where(User.id == security.get_id(request.headers["authorization"]))).one_or_none()
        if not current_user.is_admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not an admin")
        
        composer = Composer(**body.dict())
        session.add(composer)
        session.commit()
        session.refresh(composer)
        composer_for_search = {
            "id": composer.id,
            "name": composer.name,
            "epoch": composer.epoch,
            "birth_date": composer.birth_date,
            "birth_place": composer.birth_place,
            "death_date": composer.death_date,
            "death_place": composer.death_place,
            "portrait": composer.portrait,
            "short_description": composer.short_description,
            "long_description": composer.long_description
        }
        search.index("composers").add_documents([composer_for_search])


@router.put("/composer/update/{id}")
async def update_composer(id: int, body: Composer, request: Request):
    with Session(engine) as session:
        current_user = session.exec(
            select(User).where(User.id == security.get_id(request.headers["authorization"]))).one_or_none()
        if not current_user.is_admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not an admin")
        
        composer = session.exec(select(Composer).where(Composer.id == id)).one_or_none()
        portait = composer.portrait
        if composer is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Composer not found")
        
        for key, value in body.dict().items():
            setattr(composer, key, value)
        composer.id = id
        composer.portrait = portait
        session.add(composer)
        session.commit()


@router.post("/opus/upload-image")
async def upload_image(image: UploadFile):
    upload_response = uploader.upload(
        image.file,
        public_id=str(uuid.uuid4()),
        folder="images",
        transformation=
        [{"width": 600, "height": 600, "crop": "auto", "gravity": "auto", "effect": "improve:50"}]
    )
    return {"message": "Image uploaded", "url": upload_response["secure_url"]}


@router.post("/opus/upload-audio")
async def upload_audio(audio: UploadFile):
    upload_response = uploader.upload(
        audio.file,
        public_id=str(uuid.uuid4()),
        folder="audio",
        resource_type="video"
    )
    return {"message": "Audio uploaded", "url": upload_response["secure_url"]}


class CreateOpus(BaseModel):
    title: str
    description: str
    genre: str
    composer_id: int
    cover: str
    recordings: list[dict]

@router.post("/opus/create")
async def create_opus(body: CreateOpus, request: Request):
    with Session(engine) as session:
        current_user = session.exec(
            select(User).where(User.id == security.get_id(request.headers["authorization"]))).one_or_none()
        if not current_user.is_admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not an admin")
        
        recordings = []
        for re in body.recordings:
            rec = Recording()
            print(re)
            rec.title = re['title']
            rec.image_url = body.cover
            rec.file_url = re['file_url']
            recordings.append(rec)
        print(recordings)
        session.add_all(recordings)
        session.commit()
        for rec in recordings:
            session.refresh(rec)

        opus = Opus()
        opus.title = body.title
        opus.description = body.description
        opus.subtitle = ""
        opus.popular = False
        opus.recommended = False
        opus.genre = body.genre
        opus.composer_id = body.composer_id
        opus.recordings = recordings
        session.add(opus)
        session.commit()
        session.refresh(opus)
        search.index("opuses").add_documents([opus.dict()])


class UpdateOpus(BaseModel):
    title: str
    description: str
    genre: str
    composer_id: int

@router.put("/opus/update/{id}")
async def update_opus(id: int, body: UpdateOpus, request: Request):
    with Session(engine) as session:
        current_user = session.exec(
            select(User).where(User.id == security.get_id(request.headers["authorization"]))).one_or_none()
        if not current_user.is_admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not an admin")
        
        opus = session.exec(select(Opus).where(Opus.id == id)).one_or_none()
        if opus is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Opus not found")
        
        opus_id = opus.id
        recordings = opus.recordings
        for key, value in body.dict().items():
            setattr(opus, key, value)
        opus.id = opus_id
        opus.recordings = recordings
        session.add(opus)
        session.commit()
        session.refresh(opus)
        search.index("opuses").update_documents([opus.dict()])

