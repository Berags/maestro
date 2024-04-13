import json
import pprint

from fastapi import APIRouter
import threading

from redis.commands.search.query import Query
from sqlmodel import Session, select

from app.core import database
from app.core.database import redis_cache, engine
from app.core.models import Opus, Composer


class ThreadWithReturnValue(threading.Thread):
    def __init__(self, group=None, target=None, name=None,
                 args=(), kwargs={}, Verbose=None):
        threading.Thread.__init__(self, group, target, name, args, kwargs)

        self._return = None

    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args,
                                        **self._kwargs)

    def join(self, *args) -> any:
        threading.Thread.join(self, *args)
        return self._return


router = APIRouter()


@router.get("/")
def search(query: str | None):
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
