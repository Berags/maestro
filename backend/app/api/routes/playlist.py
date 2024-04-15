import uuid

from cloudinary import uploader
from fastapi import APIRouter, UploadFile, Request
from sqlmodel import Session, select

from app.core.database import engine
from app.core.models import Playlist, Recording, PlaylistRecording
from app.utils import security

router = APIRouter()


@router.post("/upload")
async def upload_image(image: UploadFile):
    print(image.filename)
    upload_response = uploader.upload(
        image.file,
        public_id=image.filename + uuid.uuid4().__str__(),
        folder="playlist",
        transformation=
        [{"width": 600, "height": 600, "crop": "auto", "gravity": "auto", "effect": "improve:50"}]
    )
    return {"message": "Image uploaded", "url": upload_response["secure_url"]}


@router.post("/create")
async def create_playlist(body: dict, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        playlist = Playlist(name=body["title"], image_url=body["image_url"], user_id=user_id)
        session.add(playlist)
        session.commit()
        session.refresh(playlist)
    return {"message": "Playlist created successfully", "id": playlist.id}


@router.get("/my-playlists")
async def get_my_playlists(request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        playlists = session.exec(select(Playlist).where(Playlist.user_id == user_id)).all()
        return playlists


@router.get("/by-id/{playlist_id}")
async def get_playlist_by_id(playlist_id: int):
    with Session(engine) as session:
        playlist = session.exec(select(Playlist).where(Playlist.id == playlist_id)).first()
        recordings = session.exec(
            select(Recording).join(PlaylistRecording).where(PlaylistRecording.playlist_id == playlist.id)).all()
        return {"id": playlist.id, "name": playlist.name, "description": playlist.description,
                "image_url": playlist.image_url,
                "recordings": recordings}


@router.post("/add-recording/{playlist_id}/{recording_id}")
async def add_recording_to_playlist(playlist_id: int, recording_id: int, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        playlist = session.exec(select(Playlist).where(Playlist.id == playlist_id)).first()
        if playlist.user_id != user_id:
            return {"message": "Unauthorized"}

        playlist_recording = session.exec(select(PlaylistRecording).where(PlaylistRecording.playlist_id == playlist_id)
                                          .where(PlaylistRecording.recording_id == recording_id)).one_or_none()
        if playlist_recording is not None:
            session.delete(playlist_recording)
            session.commit()
            return {"message": "Recording already in playlist"}

        playlist_recording = PlaylistRecording(playlist_id=playlist_id, recording_id=recording_id)
        session.add(playlist_recording)
        session.commit()
    return {"message": "Recording added to playlist successfully"}
