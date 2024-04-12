import secrets

import jwt

from app.config import settings


def get_id(token: str):
    """
    Extracts the user ID from a token
    """
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])["id"]




def make_token():
    """
    Creates a cryptographically-secure, URL-safe string
    """
    return secrets.token_urlsafe(16)
