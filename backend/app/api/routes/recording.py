import math
import pprint
from typing import Sequence

from fastapi import APIRouter, Request, HTTPException
from sqlalchemy import func
from sqlmodel import Session, select
from starlette import status

from app.core.database import engine, redis_cache
from app.core.models import Recording, User, UserRecordingLike, ListeningHistory
from app.utils import security

router = APIRouter()


@router.get("/by-opus/{opus_id}")
def get_opuses(opus_id: int) -> Sequence[Recording]:
    with Session(engine) as session:
        recs = session.exec(select(Recording).where(Recording.opus_id == opus_id)).all()
        pprint.pprint(recs)
        return recs


@router.post("/like/{recording_id}")
def like_recording(recording_id: int, request: Request):
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
def get_liked_recordings(request: Request, page: int = 0):
    user_id = security.get_id(request.headers["authorization"])
    # 10 composers per page
    limit = 6
    offset = page * limit
    with Session(engine) as session:
        current_user = session.exec(
            select(User).where(User.id == user_id)).one_or_none()
        return sorted(current_user.liked_recordings, key=lambda x: x.id)[offset:offset + limit]


@router.get("/liked/pages")
def get_n_of_pages(request: Request):
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
def get_top_recordings():
    with Session(engine) as session:
        recs = session.exec(
            select(Recording).order_by(Recording.listens).limit(5)
        ).all()
        return recs


@router.get("/last-listened")
def get_last_listened(request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with (Session(engine) as session):
        listen = session.exec(
            select(ListeningHistory)
            .where(User.id == user_id)
            .order_by(ListeningHistory.listened_at.desc())
        ).first()
        if listen is None:
            return None
        return session.exec(select(Recording).where(Recording.id == listen.recording_id)).one_or_none()


@router.post("/listen/{recording_id}")
def listen_recording(recording_id: int, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        try:
            session.add(UserRecordingLike(user_id=user_id, recording_id=recording_id))
        except Exception as e:
            print(e)
            return {"message": "There was an error listening to the recording"}

        session.commit()
        return {"message": "Recording listened successfully"}
