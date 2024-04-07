from typing import Union
from urllib.request import Request

from fastapi import FastAPI
from fastapi.routing import APIRoute
from sqlmodel import SQLModel, create_engine
from starlette.middleware.base import BaseHTTPMiddleware

from app.core import models
from starlette.middleware.cors import CORSMiddleware
from app.core.database import engine

from app.api.main import api_router
from app.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
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


@app.middleware("http")
async def check_auth(request: Request, call_next):
    print(request.headers)
    response = await call_next(request)
    return response

@app.on_event("startup")
def startup():
    print("Starting the database...")
    # SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    print("Database started!")
