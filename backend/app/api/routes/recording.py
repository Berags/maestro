import pprint
from typing import List, Sequence

from fastapi import APIRouter
from sqlmodel import Session, select

from app.core.database import engine
from app.core.models import Opus, Recording

router = APIRouter()


@router.get("/by-opus/{opus_id}")
def get_opuses(opus_id: int) -> Sequence[Recording]:
    with Session(engine) as session:
        recs = session.exec(select(Recording).where(Recording.opus_id == opus_id)).all()
        pprint.pprint(recs)
        return recs
