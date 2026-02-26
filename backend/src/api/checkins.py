from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..database import get_supabase_client

router = APIRouter(prefix="/api/checkins", tags=["checkins"])


class CheckInCreate(BaseModel):
    bar_id: str
    user_id: Optional[str] = None
    wait_time_min: int
    wait_time_max: int
    energy_level: int = 50  # 0-100
    vibe_emoji: Optional[str] = None
    comment: Optional[str] = None
    visibility: str = "public"


@router.post("")
async def create_checkin(checkin: CheckInCreate):
    """Submit a check-in for a bar."""
    supabase = get_supabase_client()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    # Verify bar exists
    bar_result = supabase.from_("bars").select("id").eq("id", checkin.bar_id).execute()
    if not bar_result.data:
        raise HTTPException(status_code=404, detail="Bar not found")

    data = {
        "bar_id": checkin.bar_id,
        "wait_time_min": checkin.wait_time_min,
        "wait_time_max": checkin.wait_time_max,
        "energy_level": checkin.energy_level,
        "vibe_emoji": checkin.vibe_emoji,
        "comment": checkin.comment,
        "visibility": checkin.visibility,
    }
    if checkin.user_id:
        data["user_id"] = checkin.user_id

    result = supabase.from_("checkins").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save check-in")

    return {"success": True, "checkin": result.data[0]}
