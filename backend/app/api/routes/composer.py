import math
from datetime import datetime
from typing import List, Sequence

from fastapi import APIRouter
from sqlalchemy import func
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, select

from app.core.database import engine
from app.core.models import Composer

router = APIRouter()


@router.get("/id/{composer_id}")
def get_composer(composer_id: int) -> Composer:
    with Session(engine) as session:
        return session.exec(select(Composer).where(Composer.id == composer_id)).one_or_none()


@router.get("/")
def get_composers(page: int) -> Sequence[Composer]:
    # 10 composers per page
    limit = 10
    offset = (page) * limit
    with Session(engine) as session:
        return session.exec(select(Composer).order_by(Composer.id).limit(limit).offset(offset)).all()


@router.get("/pages")
def get_n_of_pages():
    limit = 10
    with Session(engine) as session:
        n_of_rows = session.exec(select(func.count()).select_from(Composer)).one()
        return {"n_of_pages": math.ceil(n_of_rows / limit)}
