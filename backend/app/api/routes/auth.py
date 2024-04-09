from fastapi import APIRouter, Request, Response, HTTPException
from pydantic import BaseModel
from sqlmodel import Session
from starlette import status

from app.core.database import engine, providers_string, redis_cache
from app.core.models import User
from sqlmodel import Session, select

from app.utils import security

router = APIRouter()


class Body(BaseModel):
    id: int
    username: str
    name: str
    email: str
    image: str
    provider: str
    previous_session: str | None


@router.post("/login")
def login(body: Body):
    request_user = None
    response_body = {}

    session_token = security.make_token()
    if body.previous_session is not None:
        # user was already logged in
        # just needs to refresh the session
        if not redis_cache.exists(body.previous_session):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        redis_cache.delete(body.previous_session)
        print("removed " + body.previous_session)
        redis_cache.set(session_token, providers_string[body.provider] + str(body.id))
        print("set " + session_token)
        response_body["message"] = "session updated successfully"
        response_body["token"] = session_token
        return response_body

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
    response_body["token"] = session_token
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
