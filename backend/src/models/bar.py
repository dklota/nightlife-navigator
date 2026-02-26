from pydantic import BaseModel
from typing import Optional


class Bar(BaseModel):
    id: str
    name: str
    address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    place_id: Optional[str] = None
    google_rating: Optional[float] = None
    google_user_ratings_total: Optional[int] = None
    price_level: Optional[int] = None
    vibe: Optional[str] = None
    emoji: Optional[str] = None
    description: Optional[str] = None


class BarTraffic(BaseModel):
    bar_id: str
    wait_time_min: int
    wait_time_max: int
    lit_score: int
    checkin_count: int
    energy: str  # chill | active | high | insane
