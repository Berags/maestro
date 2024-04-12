import datetime

import jwt
from fastapi import APIRouter, Request, Response, HTTPException
from pydantic import BaseModel
from sqlmodel import Session
from starlette import status

from app.config import settings
from app.core.database import engine, providers_string, redis_cache
from app.core.models import User
from sqlmodel import Session, select

from app.utils import security

router = APIRouter()


class Body(BaseModel):
    id: int
    username: str | None
    name: str | None
    email: str | None
    image: str | None
    provider: str
    previous_session: str | None


@router.post("/login")
def login(body: Body):
    request_user = None
    response_body = {}

    session_token = security.make_token()

    with (Session(engine) as session):
        request_user = session.exec(
            select(User)
            .where(User.id == providers_string[body.provider] + str(body.id))
        ).one_or_none()

    if request_user is None:
        request_user = User(
            id=providers_string[body.provider] + str(body.id),
            username=body.username,
            name=body.name,
            email=body.email,
            image=body.image,
            provider=body.provider
        )
        session.add(request_user)
        session.commit()
        session.refresh(request_user)
        response_body["message"] = "User created successfully"

    redis_cache.set(session_token, request_user.id)
    encoded = jwt.encode({
        "id": providers_string[body.provider] + str(body.id),
    }, settings.SECRET_KEY, algorithm="HS256")
    response_body["token"] = encoded
    return response_body


@router.get("/identity")
def get_identity(id: str, request: Request) -> User:
    print(id)
    user = None
    with (Session(engine) as session):
        user = session.exec(select(User).where(User.id == id)).one_or_none()
    return user
    # user_id = request.session.get("user_id")


@router.get("/unauthorized")
async def unauthorized(response: Response):
    response.status_code = status.HTTP_401_UNAUTHORIZED
    return {"message": "Unauthorized"}

# TODO: add logout
