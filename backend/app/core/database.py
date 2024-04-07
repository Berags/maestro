from sqlmodel import SQLModel, create_engine

from app.config import settings
from app.core import models


engine = create_engine(str(settings.DATABASE_URI), echo=True)

providers_string = {
    "github": "gh",
    "discord": "ds"
}
