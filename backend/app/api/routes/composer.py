import math
from datetime import datetime
from typing import Sequence

import sqlalchemy
from fastapi import APIRouter
from sqlalchemy import func
from sqlmodel import Session, select

from app.core.database import engine
from app.core.models import Composer, Opus

router = APIRouter()


@router.get("/id/{composer_id}")
def get_composer(composer_id: int, page: int | None):
    limit = 6
    offset = page * limit
    with Session(engine) as session:
        composer = session.exec(select(Composer).where(Composer.id == composer_id)).one_or_none()
        if page is not None:
            return {**composer.__dict__,
                    "opuses": sorted(composer.opuses, key=lambda x: x.id)[offset:offset + limit],
                    "n_of_pages": math.ceil(len(composer.opuses) / limit)}
        else:
            return {**composer.__dict__, "opuses": composer.opuses}


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
