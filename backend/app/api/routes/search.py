import pprint

from fastapi import APIRouter

from app.core import database

router = APIRouter()


@router.get("/")
def search(query: str | None):
    if query is None:
        return []
    melisearch = database.search.index("composers").search(query)
    pprint.pprint(melisearch)
    return melisearch
