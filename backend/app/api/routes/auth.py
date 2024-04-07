from fastapi import APIRouter, Request
from pydantic import BaseModel
from sqlmodel import Session

from app.core.database import engine, providers_string
from app.core.models import User
from sqlmodel import Session, select

router = APIRouter()


@router.get("/")
def test():
    return {"message": "Hello World"}


class Body(BaseModel):
    id: int
    username: str
    name: str
    email: str
    image: str
    provider: str


@router.post("/login")
def login(body: Body):
    request_user = None
    with (Session(engine) as session):
        request_user = session.exec(
            select(User)
            .where(User.id == providers_string[body.provider] + str(body.id))
        ).one_or_none()

    if request_user is None:
        session.add(
            User(
                id=providers_string[body.provider] + str(body.id),
                username=body.username,
                name=body.name,
                email=body.email,
                image=body.image,
                provider=body.provider
            ))
        session.commit()
        return {"message": "User created successfully"}

    return {"message": "User logged in"}

@router.get("/identity")
def get_identity(request: Request):
    print(request)
    # user_id = request.session.get("user_id")
