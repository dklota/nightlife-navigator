from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
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
    photo_url: Optional[str] = None
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
        "photo_url": checkin.photo_url,
        "visibility": checkin.visibility,
    }
    if checkin.user_id:
        data["user_id"] = checkin.user_id

    result = supabase.from_("checkins").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save check-in")

    return {"success": True, "checkin": result.data[0]}


@router.get("/feed")
async def get_feed(
    user_id: Optional[str] = Query(default=None),
    friend_ids: Optional[str] = Query(default=None),  # comma-separated
    limit: int = Query(default=50),
):
    """
    Return feed check-ins:
    - Always includes public check-ins
    - If user_id + friend_ids provided, also includes friends-only check-ins
    - Private check-ins are never returned
    """
    supabase = get_supabase_client()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    # Fetch public check-ins
    public_result = (
        supabase.from_("checkins")
        .select("*, bars(name, city)")
        .eq("visibility", "public")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    feed = public_result.data or []

    # Also fetch friends-only check-ins if caller is authenticated
    if user_id and friend_ids:
        ids = [fid.strip() for fid in friend_ids.split(",") if fid.strip()]
        if ids:
            friends_result = (
                supabase.from_("checkins")
                .select("*, bars(name, city)")
                .eq("visibility", "friends")
                .in_("user_id", ids)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            feed = feed + (friends_result.data or [])
            # Re-sort combined list by created_at descending
            feed.sort(key=lambda x: x.get("created_at", ""), reverse=True)
            feed = feed[:limit]

    return feed
