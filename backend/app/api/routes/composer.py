import math
import pprint
from datetime import datetime
from typing import Sequence

import fastapi.openapi.utils
import sqlalchemy
from fastapi import APIRouter, Request, HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select

from app.core.database import engine, redis_cache
from app.core.models import Composer, Opus, User
from app.utils import security

router = APIRouter()


@router.get("/id/{composer_id}")
async def get_composer(composer_id: int, page: int | None, request: Request):
    limit = 6
    offset = page * limit
    with Session(engine) as session:
        composer = session.exec(select(Composer).where(Composer.id == composer_id)).one_or_none()
        current_user = session.exec(
            select(User).where(User.id == security.get_id(request.headers["authorization"]))).one_or_none()

        if page is not None:
            return {**composer.__dict__,
                    "opuses": sorted(composer.opuses, key=lambda x: x.id)[offset:offset + limit],
                    "is_liked": current_user in composer.liked_by,
                    "n_of_pages": math.ceil(len(composer.opuses) / limit)}
        else:
            if composer is None:
                return None
            return composer.__dict__


@router.get("/by-opus-id/{opus_id}")
async def get_composer_by_opus(opus_id: int):
    with Session(engine) as session:
        opus = session.exec(select(Opus).where(Opus.id == opus_id)).one_or_none()
        return session.exec(select(Composer).where(Composer.id == opus.composer_id)).one_or_none()


@router.get("/")
async def get_composers(page: int) -> Sequence[Composer]:
    # 10 composers per page
    limit = 10
    offset = page * limit
    with Session(engine) as session:
        return session.exec(select(Composer).order_by(Composer.id).limit(limit).offset(offset)).all()


@router.get("/pages")
async def get_n_of_pages():
    limit = 10
    with Session(engine) as session:
        n_of_rows = session.exec(select(func.count()).select_from(Composer)).one()
        return {"n_of_pages": math.ceil(n_of_rows / limit)}


@router.get("/liked")
async def get_liked_composers(request: Request):
    user_id = security.get_id(request.headers["authorization"])
    print(user_id)
    with Session(engine) as session:
        current_user = session.exec(
            select(User).where(User.id == user_id)).one_or_none()
        return current_user.liked_composers


@router.post("/like/{composer_id}")
async def like_composer(composer_id: int, request: Request):
    with Session(engine) as session:
        composer: Composer = session.exec(
            select(Composer).where(Composer.id == composer_id)
        ).one_or_none()
        user: User = session.exec(
            select(User).where(User.id == security.get_id(request.headers["authorization"]))
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


@router.delete("/id/{composer_id}")
async def delete_by_id(composer_id: int, request: Request):
    with Session(engine) as session:
        composer = session.exec(select(Composer).where(Composer.id == composer_id)).one_or_none()
        current_user = session.exec(
            select(User).where(User.id == security.get_id(request.headers["authorization"]))).one_or_none()

        if not current_user.is_admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not an admin")
        
        session.delete(composer)
        session.commit()
