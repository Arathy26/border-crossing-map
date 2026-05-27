from fastapi import APIRouter
from crossing_service import load_crossings

router = APIRouter(
    prefix="/api",
    tags=["Crossings"]
)

@router.get("/crossings")
def get_crossings():
    data = load_crossings()
    return {
        "success": True,
        "count": len(data),
        "data": data
    }