from typing import Union

from fastapi import FastAPI

app = FastAPI()

from typing import Optional

from sqlmodel import Field, SQLModel, create_engine, Session, select
from app.config import settings


class Hero(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    secret_name: str
    age: Optional[int] = None

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

SQLModel.metadata.create_all(engine)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/hero/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    with Session(engine) as session:
        heroes = session.exec(select(Hero).where(Hero.id == item_id)).all()
        return heroes
