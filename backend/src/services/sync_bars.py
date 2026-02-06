import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from src.database import supabase
from src.services.google_places import google_places

def sync_bars_metadata():
    """
    Syncs bar metadata from Google Places to Supabase.
    """
    print("🚀 Starting sync from Google Places...")
    
    # 1. Fetch bars from our database
    try:
        response = supabase.table("bars").select("id, name, address").execute()
        existing_bars = response.data
    except Exception as e:
        print(f"❌ Error fetching bars from Supabase: {e}")
        return

    for bar in existing_bars:
        print(f"🔍 Searching metadata for: {bar['name']}...")
        
        # 2. Search for the place on Google
        # Assuming address is clear enough, or we search by name + " Davis"
        search_query = f"{bar['name']} Davis, CA"
        try:
            search_results = google_places.gmaps.places(query=search_query).get("results", [])
            if not search_results:
                print(f"⚠️ No Google results for {bar['name']}")
                continue
            
            place_id = search_results[0]["place_id"]
            
            # 3. Get detailed data
            details = google_places.get_bar_details(place_id)
            if not details:
                continue
            
            # 4. Prepare update data
            update_data = {
                "place_id": details.get("place_id"),
                "google_rating": details.get("rating"),
                "google_user_ratings_total": details.get("user_ratings_total"),
                # You might want to update address or price level too
                "price_level": details.get("price_level")
            }
            
            # 5. Update Supabase
            supabase.table("bars").update(update_data).eq("id", bar["id"]).execute()
            print(f"✅ Updated {bar['name']} with Google metadata.")
            
        except Exception as e:
            print(f"❌ Error syncing {bar['name']}: {e}")

if __name__ == "__main__":
    sync_bars_metadata()
