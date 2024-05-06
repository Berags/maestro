from typing import List, Sequence

from fastapi import APIRouter
from sqlmodel import Session, select

from app.core.database import engine, search
from app.core.models import Opus, Composer
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

