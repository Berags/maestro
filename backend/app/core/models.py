from datetime import datetime

from sqlmodel import Field, SQLModel, create_engine


class User(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str | None = Field(default=None)
    email: str | None = Field(default=None)
    image: str | None = Field(default=None)
    description: str | None = Field(default=None)
    created_at: datetime = Field(default=datetime.now())
    updated_at: datetime = Field(default=datetime.now())


class Composer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    portrait: str | None
    epoch: str | None
    birth_date: datetime | None
    birth_place: str | None
    death_date: datetime | None
    death_place: str | None
    background_image: str | None
    short_description: str | None
    long_description: str | None
