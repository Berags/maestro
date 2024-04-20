import threading

import jwt
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import ORJSONResponse
from fastapi.routing import APIRoute
from sqlmodel import SQLModel
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.config import settings
from app.core import database
from app.core.database import engine


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    default_response_class=ORJSONResponse,
)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

routes_without_middleware = [settings.API_V1_STR + "/auth/login",
                             settings.API_V1_STR + "/auth/logout",
                             settings.API_V1_STR + "/auth/unauthorized",
                             "/docs", settings.API_V1_STR + "/openapi.json"]


@app.middleware("http")
async def check_auth(request: Request, call_next):
    response = {}
    if request.method not in ["GET", "POST"]:
        return await call_next(request)
    if request.url.path in routes_without_middleware:
        return await call_next(request)

    try:
        jwt.decode(request.headers["authorization"], settings.SECRET_KEY, algorithms=["HS256"])
        response = await call_next(request)
        return response
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.on_event("startup")
def startup():
    lock = threading.Lock()
    with lock:
        #SQLModel.metadata.drop_all(engine)
        print("Starting the database...")
        #SQLModel.metadata.create_all(engine)
        #database.populate_db()
        database.add_data_to_search()
        print("Database started!")
