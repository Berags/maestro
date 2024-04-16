import math
import pprint
import threading
from typing import Sequence

from fastapi import APIRouter, Request, HTTPException
from sqlalchemy import func
from sqlmodel import Session, select
from starlette import status

from app.core.database import engine, redis_cache
from app.core.models import Recording, User, UserRecordingLike, Opus
from app.utils import security

router = APIRouter()


@router.get("/by-opus/{opus_id}")
async def get_opuses(opus_id: int) -> Sequence[Recording]:
    with Session(engine) as session:
        recs = session.exec(select(Recording).where(Recording.opus_id == opus_id).order_by(Recording.title)).all()
        pprint.pprint(recs)
        return recs


@router.post("/like/{recording_id}")
async def like_recording(recording_id: int, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    response = {}

    with Session(engine) as session:
        rec: Recording = session.exec(select(Recording).where(Recording.id == recording_id)).one_or_none()
        user: User = session.exec(
            select(User).where(User.id == user_id)
        ).one_or_none()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

        if rec is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unable to like composer")

        user_recording_like = session.exec(
            select(UserRecordingLike)
            .where(UserRecordingLike.user_id == user.id)
            .where(UserRecordingLike.recording_id == rec.id)
        ).one_or_none()
        if user_recording_like is not None:
            # user already liked this recording -> unlike
            session.delete(user_recording_like)
            session.commit()
            response["message"] = "Recording unliked successfully"
            return response

        session.add(UserRecordingLike(user_id=user.id, recording_id=rec.id))
        session.commit()
        response["message"] = "Recording liked successfully"
        return response


@router.get("/liked")
async def get_liked_recordings(request: Request, page: int = 0):
    user_id = security.get_id(request.headers["authorization"])
    # 10 composers per page
    limit = 6
    offset = page * limit
    with Session(engine) as session:
        current_user = session.exec(
            select(User).where(User.id == user_id)).one_or_none()
        return sorted(current_user.liked_recordings, key=lambda x: x.id)[offset:offset + limit]


@router.get("/liked/pages")
async def get_n_of_pages(request: Request):
    user_id = security.get_id(request.headers["authorization"])

    limit = 6
    with Session(engine) as session:
        n_of_rows = session.exec(
            select(func.count())
            .select_from(UserRecordingLike)
            .where(UserRecordingLike.user_id == user_id)
        ).one()
        return {"n_of_pages": math.ceil(n_of_rows / limit)}


@router.get("/top")
async def get_top_recordings():
    with Session(engine) as session:
        recs = session.exec(
            select(Recording).order_by(Recording.listens).limit(5)
        ).all()
        return recs


@router.get("/random")
async def get_random_recordings():
    with Session(engine) as session:
        rec = session.exec(
            select(Recording).order_by(func.random()).limit(1)
        ).one_or_none()
        opus = session.exec(
            select(Opus).where(Opus.id == rec.opus_id).limit(1)
        ).one_or_none()
        return {"recording": rec, "opus": opus, "composer": opus.composer}


@router.get("/last-listened")
async def get_last_listened(request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        recording = session.exec(
            select(Recording).where(Recording.id == redis_cache.get(f"user:{user_id}:listens")).limit(1)
        ).one_or_none()
        opus = session.exec(
            select(Opus).where(Opus.id == recording.opus_id).limit(1)
        ).one_or_none()
        return {"recording": recording, "opus": opus, "composer": opus.composer}


@router.post("/listen/{recording_id}")
async def listen_recording(recording_id: int, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    threading.Thread(target=increment_listens, args=(recording_id,)).start()
    redis_cache.set(f"user:{user_id}:listens", recording_id)
    redis_cache.expire(f"user:{user_id}:listens", 60 * 60 * 24 * 7)
    return {"message": "Recording listened successfully"}


def increment_listens(recording_id: int):
    with Session(engine) as session:
        rec = session.exec(select(Recording).where(Recording.id == recording_id)).first()
        rec.listens += 1
        session.add(rec)
        session.commit()
