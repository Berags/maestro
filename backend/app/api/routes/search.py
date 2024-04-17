from fastapi import APIRouter

from app.core import database
from app.utils.thread_with_return_value import ThreadWithReturnValue

router = APIRouter()


@router.get("/")
async def search(query: str | None):
    if query is None:
        return []

    composers_thread = ThreadWithReturnValue(target=search_for_composers, args=(query,))
    opuses_thread = ThreadWithReturnValue(target=search_for_opuses, args=(query,))
    composers_thread.start()
    opuses_thread.start()
    composers_res = composers_thread.join()
    opuses_res = opuses_thread.join()
    if len(composers_res["hits"]) > 5:
        composers_res["hits"] = composers_res["hits"][:5]
    if len(opuses_res["hits"]) > 5:
        opuses_res["hits"] = opuses_res["hits"][:5]
    return {"composers": composers_res, "opuses": opuses_res}


def search_for_composers(query: str):
    return database.search.index("composers").search(query)


def search_for_opuses(query: str):
    return database.search.index("opuses").search(query)
