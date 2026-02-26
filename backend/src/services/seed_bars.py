"""
Seed bars from Google Places API into Supabase for configured cities.

Run from the backend directory:
    python src/services/seed_bars.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from src.services.google_places import google_places
from src.database import get_supabase_client

CITIES = ["Davis, CA", "San Jose, CA"]


def seed_city(city: str):
    supabase = get_supabase_client()
    if not supabase:
        print("Database unavailable — check your .env")
        return

    print(f"\n📍 Searching Google Places for bars in {city}...")
    results = google_places.search_bars(location=city)
    print(f"   Found {len(results)} bars")

    # Fetch existing place_ids so we know what to update vs insert
    existing = supabase.from_("bars").select("id, place_id, name").eq("city", city).execute()
    existing_by_place_id = {r["place_id"]: r["id"] for r in existing.data if r.get("place_id")}
    existing_by_name = {r["name"]: r["id"] for r in existing.data}

    inserted = 0
    updated = 0

    for place in results:
        try:
            name = place.get("name", "")
            place_id = place.get("place_id")
            location = place.get("geometry", {}).get("location", {})
            lat = location.get("lat")
            lng = location.get("lng")
            address = place.get("vicinity") or place.get("formatted_address", "")
            rating = place.get("rating")
            price_level = place.get("price_level")

            if not place_id or lat is None or lng is None:
                print(f"   ⚠ Skipping '{name}' — missing place_id or coordinates")
                continue

            bar_data = {
                "name": name,
                "place_id": place_id,
                "address": address,
                "latitude": lat,
                "longitude": lng,
                "city": city,
                "google_rating": rating,
                "price_level": price_level,
                "current_vibe": "Chill",
                "current_wait_time": 0,
            }

            if place_id in existing_by_place_id:
                # Update existing bar by place_id
                bar_id = existing_by_place_id[place_id]
                supabase.from_("bars").update(bar_data).eq("id", bar_id).execute()
                updated += 1
                print(f"   ✓ Updated: {name}")
            elif name in existing_by_name:
                # Match by name — update with place_id and coordinates
                bar_id = existing_by_name[name]
                supabase.from_("bars").update(bar_data).eq("id", bar_id).execute()
                updated += 1
                print(f"   ✓ Updated (by name): {name}")
            else:
                # New bar — insert
                supabase.from_("bars").insert(bar_data).execute()
                inserted += 1
                print(f"   + Inserted: {name} ({lat:.4f}, {lng:.4f})")

        except Exception as e:
            print(f"   ✗ Error for '{place.get('name', '?')}': {e}")

    print(f"   Done — {inserted} inserted, {updated} updated")


if __name__ == "__main__":
    for city in CITIES:
        seed_city(city)
    print("\n✅ Seeding complete!")
