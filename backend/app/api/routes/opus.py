from typing import List, Sequence

from fastapi import APIRouter
from sqlmodel import Session, select

from app.core.database import engine
from app.core.models import Opus

router = APIRouter()


@router.get("/id/{composer_id}")
def get_opuses(composer_id: int) -> Sequence[Opus]:
    with Session(engine) as session:
        return session.exec(select(Opus).where(Opus.composer_id == composer_id)).all()
