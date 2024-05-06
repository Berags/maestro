from typing import List, Sequence

from fastapi import APIRouter, Request, HTTPException 
from starlette import status
from sqlmodel import Session, select

from app.utils import security
from app.core.database import engine, search
from app.core.models import Opus, Composer, User
from sqlalchemy import func
import math

router = APIRouter()


@router.get("/id/{composer_id}")
async def get_opuses(composer_id: int) -> Sequence[Opus]:
    with Session(engine) as session:
        return session.exec(select(Opus).where(Opus.composer_id == composer_id)).all()


@router.get("/{opus_id}")
async def get_opus(opus_id: int) -> Opus:
    with Session(engine) as session:
        return session.exec((select(Opus).where(Opus.id == opus_id))).first()


@router.get("/info/pages")
async def get_n_of_pages(query: str):
    limit = 10
    n_of_rows = search.index("opuses").search(query)['estimatedTotalHits']
    return {"n_of_pages": math.ceil(n_of_rows / limit)}


@router.get("/")
async def get_all_opuses(page: int, query: str) -> List[Opus]:
    limit = 10
    offset = page * limit
    return search.index("opuses").search(query, {
        'offset': offset,
        'limit': limit,
    })["hits"]


@router.delete("/id/{opus_id}")
async def delete_opus(opus_id: int, request: Request):
    user_id = security.get_id(request.headers["authorization"])
    with Session(engine) as session:
        current_user = session.exec(select(User).where(User.id == user_id)).first()
        if not current_user.is_admin:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not an admin")

        opus = session.exec(select(Opus).where(Opus.id == opus_id)).first()
        search.index("opuses").delete_document(opus_id)
        session.delete(opus)
        session.commit()

