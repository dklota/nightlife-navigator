from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from ..database import get_supabase_client

try:
    import zoneinfo
    _LA_TZ = zoneinfo.ZoneInfo("America/Los_Angeles")
except Exception:
    _LA_TZ = None

router = APIRouter(prefix="/api/bars", tags=["bars"])


def get_time_of_day_baseline() -> int:
    """
    Return a baseline wait-time estimate (minutes) based on Pacific time.
    Used when no real check-in data is available for a bar.
    """
    try:
        now = datetime.now(_LA_TZ) if _LA_TZ else datetime.now(timezone.utc)
    except Exception:
        now = datetime.now(timezone.utc)

    hour = now.hour
    weekday = now.weekday()       # 0=Mon … 6=Sun
    is_weekend = weekday >= 4     # Fri / Sat / Sun

    if 2 <= hour < 17:            # 2 am – 5 pm: essentially dead
        return 0
    elif 17 <= hour < 20:         # 5 pm – 8 pm: happy hour
        return 10 if is_weekend else 5
    elif 20 <= hour < 22:         # 8 pm – 10 pm: picking up
        return 25 if is_weekend else 10
    else:                         # 10 pm – 2 am: peak
        return 45 if is_weekend else 20


@router.get("")
async def get_bars(city: Optional[str] = Query(default=None)):
    """List bars enriched with real-time or baseline traffic data."""
    supabase = get_supabase_client()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    query = supabase.from_("bars").select("*")
    if city:
        query = query.eq("city", city)

    result = query.execute()
    bars = result.data or []

    if not bars:
        return []

    # Fetch recent check-ins (last 2 hours) for all bars in one query
    bar_ids = [b["id"] for b in bars]
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()

    try:
        checkins_result = (
            supabase.from_("checkins")
            .select("bar_id, wait_time_min, wait_time_max, energy_level")
            .in_("bar_id", bar_ids)
            .gte("created_at", cutoff)
            .execute()
        )
        checkins = checkins_result.data or []
    except Exception:
        checkins = []

    # Group check-ins by bar_id
    checkins_by_bar: dict = defaultdict(list)
    for c in checkins:
        checkins_by_bar[c["bar_id"]].append(c)

    baseline = get_time_of_day_baseline()

    # Enrich each bar: real data if available, otherwise time-of-day baseline
    for bar in bars:
        bar_checkins = checkins_by_bar.get(bar["id"], [])
        if bar_checkins:
            avg_wait = int(
                sum((c["wait_time_min"] + c["wait_time_max"]) / 2 for c in bar_checkins)
                / len(bar_checkins)
            )
            bar["current_wait_time"] = avg_wait
        else:
            bar["current_wait_time"] = baseline

    return bars


@router.get("/{bar_id}")
async def get_bar(bar_id: str):
    """Get a single bar by ID."""
    supabase = get_supabase_client()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    result = supabase.from_("bars").select("*").eq("id", bar_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Bar not found")
    return result.data[0]


@router.get("/{bar_id}/traffic")
async def get_bar_traffic(bar_id: str):
    """
    Get real-time traffic data for a bar.
    Uses recent check-ins if available, falls back to time-of-day baseline.
    """
    supabase = get_supabase_client()
    if not supabase:
        raise HTTPException(status_code=503, detail="Database unavailable")

    bar_result = supabase.from_("bars").select("id").eq("id", bar_id).execute()
    if not bar_result.data:
        raise HTTPException(status_code=404, detail="Bar not found")

    cutoff = (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()

    try:
        checkins_result = (
            supabase.from_("checkins")
            .select("wait_time_min, wait_time_max, energy_level")
            .eq("bar_id", bar_id)
            .gte("created_at", cutoff)
            .execute()
        )
        checkins = checkins_result.data or []

        if checkins:
            avg_wait_min = int(sum(c.get("wait_time_min", 0) for c in checkins) / len(checkins))
            avg_wait_max = int(sum(c.get("wait_time_max", 15) for c in checkins) / len(checkins))
            avg_energy = int(sum(c.get("energy_level", 50) for c in checkins) / len(checkins))
        else:
            baseline = get_time_of_day_baseline()
            avg_wait_min = baseline
            avg_wait_max = baseline + 15
            avg_energy = min(30 + baseline, 95)

        if avg_energy >= 80:
            energy_label = "insane"
        elif avg_energy >= 60:
            energy_label = "high"
        elif avg_energy >= 40:
            energy_label = "active"
        else:
            energy_label = "chill"

        return {
            "bar_id": bar_id,
            "wait_time_min": avg_wait_min,
            "wait_time_max": avg_wait_max,
            "lit_score": avg_energy,
            "checkin_count": len(checkins),
            "energy": energy_label,
        }

    except Exception:
        return {
            "bar_id": bar_id,
            "wait_time_min": 0,
            "wait_time_max": 5,
            "lit_score": 30,
            "checkin_count": 0,
            "energy": "chill",
        }
