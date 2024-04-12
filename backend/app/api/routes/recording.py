import pprint
from typing import Sequence

from fastapi import APIRouter, Request, HTTPException
from sqlmodel import Session, select
from starlette import status

from app.core.database import engine, redis_cache
from app.core.models import Recording, User, UserRecordingLike
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
