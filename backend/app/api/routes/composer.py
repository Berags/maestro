from datetime import datetime

from fastapi import APIRouter
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, select

from app.core.database import engine
from app.core.models import Composer

router = APIRouter()


@router.get("/{composer_id}")
def get_composer(composer_id: int) -> Composer:
    with Session(engine) as session:
        return session.exec(select(Composer).where(Composer.id == composer_id)).one_or_none()
