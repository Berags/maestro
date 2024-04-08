from datetime import datetime

from sqlmodel import Field, SQLModel, Relationship


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
    portrait: str | None = Field(default=None)
    epoch: str | None = Field(default=None)
    birth_date: datetime | None = Field(default=None)
    birth_place: str | None = Field(default=None)
    death_date: datetime | None = Field(default=None)
    death_place: str | None = Field(default=None)
    background_image: str | None = Field(default=None)
    short_description: str | None = Field(default=None)
    long_description: str | None = Field(default=None)

    opuses: list["Opus"] = Relationship(back_populates="composer")


class Opus(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str | None = Field(default=None)
    subtitle: str | None = Field(default=None)
    popular: bool | None = Field(default=None)
    recommended: bool | None = Field(default=None)
    genre: str | None = Field(default=None)

    composer_id: int | None = Field(default=None, foreign_key="composer.id")
    composer: Composer = Relationship(back_populates="opuses")


class Performer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    portrait: str | None = Field(default=None)
