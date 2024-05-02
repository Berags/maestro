import uuid

from cloudinary import uploader
from fastapi import APIRouter, UploadFile, Request
from sqlmodel import Session, select

from app.core.database import engine
from app.core.models import Playlist, Recording, PlaylistRecording, UserRecordingLike
from app.utils import security

router = APIRouter()


@router.post("/upload")
async def upload_image(image: UploadFile):
    upload_response = uploader.upload(
        image.file,
        public_id=image.filename + str(uuid.uuid4()),
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
        playlists = session.exec(
            select(Playlist)
            .where(Playlist.user_id == user_id)
            .order_by(Playlist.pinned)).all()
        return playlists


@router.get("/by-id/{playlist_id}")
async def get_playlist_by_id(playlist_id: int, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        playlist = session.exec(select(Playlist).where(Playlist.id == playlist_id)).first()
        recordings = session.exec(
            select(Recording).join(PlaylistRecording).where(PlaylistRecording.playlist_id == playlist.id)).all()
        liked_recordings = session.exec(
            select(Recording).join(UserRecordingLike).where(UserRecordingLike.user_id == user_id)).all()
        return {"id": playlist.id, "name": playlist.name, "description": playlist.description,
                "image_url": playlist.image_url, "pinned": playlist.pinned,
                "recordings": [{
                    **recording.__dict__,
                    "liked": recording in liked_recordings
                } for recording in recordings]}


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
            return {"message": "Recording already in playlist"}

        playlist_recording = PlaylistRecording(playlist_id=playlist_id, recording_id=recording_id)
        session.add(playlist_recording)
        session.commit()
    return {"message": "Recording added to playlist successfully"}


@router.delete("/remove-recording/{playlist_id}/{recording_id}")
async def remove_recording_from_playlist(playlist_id: int, recording_id: int, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        playlist = session.exec(select(Playlist).where(Playlist.id == playlist_id)).first()
        if playlist.user_id != user_id:
            return {"message": "Unauthorized"}

        playlist_recording = session.exec(select(PlaylistRecording).where(PlaylistRecording.playlist_id == playlist_id)
                                          .where(PlaylistRecording.recording_id == recording_id)).one_or_none()
        if playlist_recording is None:
            return {"message": "Recording not in playlist"}

        session.delete(playlist_recording)
        session.commit()
    return {"message": "Recording removed from playlist successfully"}


@router.post("/pin/{playlist_id}")
async def pin_playlist(playlist_id: int, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        playlist = session.exec(select(Playlist).where(Playlist.id == playlist_id)).first()
        if playlist.user_id != user_id:
            return {"message": "Unauthorized"}

        playlist.pinned = not playlist.pinned
        session.add(playlist)
        session.commit()
        session.refresh(playlist)
    return {"message": "Playlist " + "pinned" if playlist.pinned else "unpinned" + " successfully"}


@router.delete("/delete/{playlist_id}")
async def delete_playlist(playlist_id: int, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        playlist_recordings = session.exec(
            select(PlaylistRecording).where(PlaylistRecording.playlist_id == playlist_id)).all()
        for playlist_recording in playlist_recordings:
            session.delete(playlist_recording)
        session.commit()

        playlist = session.exec(select(Playlist).where(Playlist.id == playlist_id)).first()
        if playlist.user_id != user_id:
            return {"message": "Unauthorized"}

        session.delete(playlist)
        session.commit()
    return {"message": "Playlist deleted successfully"}


@router.put("/update/{playlist_id}")
async def update_playlist(playlist_id: int, body: dict, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        playlist = session.exec(select(Playlist).where(Playlist.id == playlist_id)).first()
        if playlist.user_id != user_id:
            return {"message": "Unauthorized"}

        playlist.name = body["title"]
        playlist.image_url = body["image_url"]
        playlist.description = body["description"]
        session.add(playlist)
        session.commit()
        session.refresh(playlist)
    return {"message": "Playlist updated successfully"}

