import redis
from sqlmodel import create_engine, Session, select

from app.config import settings
from app.core.initial_data import composers, opuses
from app.core.models import Composer, Opus

engine = create_engine(str(settings.DATABASE_URI), echo=True)
redis_cache = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, password=settings.REDIS_PASSWORD,
                          decode_responses=True)

google_api_key = ""


def get_info(type, name):
    import google.generativeai as genai

    safety_settings = [
        {
            "category": "HARM_CATEGORY_DANGEROUS",
            "threshold": "BLOCK_NONE",
        },
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_NONE",
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_NONE",
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_NONE",
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE",
        },
    ]

    genai.configure(api_key=google_api_key)

    model = genai.GenerativeModel('gemini-pro')
    phrase = ""
    if type == 1:
        phrase = "a short (around 30 words) description"
    elif type == 2:
        phrase = "a long (around 3 paragraphs) description"
    elif type == 3:
        phrase = "the birth place "
    else:
        phrase = "the death place "
    response = model.generate_content(f'generate {phrase} of {name}', safety_settings=safety_settings)

    return response.text


def populate_db():
    with Session(engine) as session:
        for composer in session.exec(select(Composer)).all():
            session.delete(composer)
        for opus in session.exec(select(Opus)).all():
            session.delete(opus)
        session.commit()

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


providers_string = {
    "github": "gh",
    "discord": "ds"
}
