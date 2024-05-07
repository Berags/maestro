from datetime import datetime

from sqlmodel import Field, SQLModel, Relationship


class UserComposerLike(SQLModel, table=True):
    user_id: str | None = Field(default=None, foreign_key="user.id", primary_key=True)
    composer_id: int | None = Field(default=None, foreign_key="composer.id", primary_key=True)


class UserRecordingLike(SQLModel, table=True):
    user_id: str | None = Field(default=None, foreign_key="user.id", primary_key=True)

    recording_id: int | None = Field(default=None, foreign_key="recording.id", primary_key=True)


class ListeningHistory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: str | None = Field(default=None, foreign_key="user.id")
    recording_id: int | None = Field(default=None, foreign_key="recording.id")
    listened_at: datetime = Field(default=datetime.now(), nullable=False)


class User(SQLModel, table=True):
    id: str = Field(default=None, primary_key=True)
    name: str | None = Field(default=None)
    email: str | None = Field(default=None)
    image: str | None = Field(default=None)
    description: str | None = Field(default=None)
    created_at: datetime = Field(default=datetime.now())
    updated_at: datetime = Field(default=datetime.now())
    is_admin: bool = Field(default=False)

    liked_composers: list["Composer"] = Relationship(back_populates="liked_by", link_model=UserComposerLike)
    liked_recordings: list["Recording"] = Relationship(back_populates="liked_by", link_model=UserRecordingLike)
    playlists: list["Playlist"] = Relationship(back_populates="user")


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
    liked_by: list["User"] = Relationship(back_populates="liked_composers", link_model=UserComposerLike)

    def as_dict(self):
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}


class Opus(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str | None = Field(default=None, index=True)
    description: str | None = Field(default=None)
    subtitle: str | None = Field(default=None)
    popular: bool | None = Field(default=None)
    recommended: bool | None = Field(default=None)
    genre: str | None = Field(default=None)

    composer_id: int | None = Field(default=None, foreign_key="composer.id")
    composer: Composer = Relationship(back_populates="opuses")

    recordings: list["Recording"] = Relationship(back_populates="opus")


class Recording(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str | None = Field(default=None)
    image_url: str | None = Field(default=None)
    file_url: str | None = Field(default=None)
    listens: int = Field(default=0)

    opus_id: int | None = Field(default=None, foreign_key="opus.id")
    opus: Opus = Relationship(back_populates="recordings")

    liked_by: list["User"] = Relationship(back_populates="liked_recordings", link_model=UserRecordingLike)


class PlaylistRecording(SQLModel, table=True):
    playlist_id: int | None = Field(default=None, foreign_key="playlist.id", primary_key=True)
    recording_id: int | None = Field(default=None, foreign_key="recording.id", primary_key=True)


class Playlist(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str | None = Field(default=None)
    description: str | None = Field(default=None)
    image_url: str | None = Field(default=None)
    user_id: str | None = Field(default=None, foreign_key="user.id")
    pinned: bool = Field(default=False)

    user: User = Relationship(back_populates="playlists")
