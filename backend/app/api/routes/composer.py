import math
from datetime import datetime
from typing import Sequence

import fastapi.openapi.utils
import sqlalchemy
from fastapi import APIRouter, Request, HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select

from app.core.database import engine, redis_cache
from app.core.models import Composer, Opus, User

router = APIRouter()


@router.get("/id/{composer_id}")
def get_composer(composer_id: int, page: int | None, request: Request):
    limit = 6
    offset = page * limit
    with Session(engine) as session:
        composer = session.exec(select(Composer).where(Composer.id == composer_id)).one_or_none()
        current_user = session.exec(
            select(User).where(User.id == redis_cache.get(request.headers["session"]))).one_or_none()

        if page is not None:
            return {**composer.__dict__,
                    "opuses": sorted(composer.opuses, key=lambda x: x.id)[offset:offset + limit],
                    "is_liked": current_user in composer.liked_by,
                    "n_of_pages": math.ceil(len(composer.opuses) / limit)}
        else:
            return composer.__dict__


@router.get("/")
def get_composers(page: int) -> Sequence[Composer]:
    # 10 composers per page
    limit = 10
    offset = page * limit
    with Session(engine) as session:
        return session.exec(select(Composer).order_by(Composer.id).limit(limit).offset(offset)).all()


@router.get("/pages")
def get_n_of_pages():
    limit = 10
    with Session(engine) as session:
        n_of_rows = session.exec(select(func.count()).select_from(Composer)).one()
        return {"n_of_pages": math.ceil(n_of_rows / limit)}


@router.post("/like/{composer_id}")
def like_composer(composer_id: int, request: Request):
    if not redis_cache.exists(request.headers["session"]):
        raise HTTPException(status_code=401, detail="Unauthorized")

    with Session(engine) as session:
        composer: Composer = session.exec(
            select(Composer).where(Composer.id == composer_id)
        ).one_or_none()
        user: User = session.exec(
            select(User).where(User.id == redis_cache.get(request.headers["session"]))
        ).one_or_none()

        if composer is None or user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unable to like composer")

        if composer in user.liked_composers:
            user.liked_composers.remove(composer)
        else:
            user.liked_composers.append(composer)
        session.add(user)
        session.commit()
        session.refresh(user)
