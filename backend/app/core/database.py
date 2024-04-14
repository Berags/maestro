import meilisearch
import redis
from sqlmodel import create_engine, Session

from app.config import settings
from app.core.initial_data import composers, opuses
from app.core.models import Composer
from app.core.search_data import opuses as opuses_search, composers as composers_search

engine = create_engine(str(settings.DATABASE_URI), echo=True)
redis_cache = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, password=settings.REDIS_PASSWORD,
                          decode_responses=True)
search = meilisearch.Client(settings.MEILI_HOST, settings.MEILI_MASTER_KEY)


def populate_db():
    with Session(engine) as session:
        data: list = []
        for composer in composers:
            c = Composer(**composer)
            for op in opuses:
                if op.composer_id == c.id:
                    c.opuses.append(op)
            data.append(c)

        session.add_all(data)
        session.commit()
        session.close()


def add_data_to_search():
    search.create_index("composers")
    search.create_index("opuses")
    search.wait_for_task(search.index("composers").add_documents(composers_search).task_uid)
    search.index("opuses").add_documents(opuses_search)


providers_string = {
    "github": "gh",
    "discord": "ds"
}
