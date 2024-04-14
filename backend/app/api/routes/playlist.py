from fastapi import APIRouter

router = APIRouter()

@router.post("/create")
def create_playlist(body: dict):
    return {"message": "Playlist created successfully"}
