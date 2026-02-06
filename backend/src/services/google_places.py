import googlemaps
import os
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

load_dotenv()

class GooglePlacesService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        if not self.api_key:
            print("Warning: GOOGLE_MAPS_API_KEY not found in environment variables.")
        self.gmaps = googlemaps.Client(key=self.api_key) if self.api_key else None

    def search_bars(self, location: str = "Davis, CA", radius: int = 5000) -> List[Dict[str, Any]]:
        """
        Search for bars in a specific location.
        """
        if not self.gmaps:
            return []
        
        try:
            # Search for places of type 'bar' near the location
            places_result = self.gmaps.places(
                query="bars in " + location,
                type="bar"
            )
            return places_result.get("results", [])
        except Exception as e:
            print(f"Error searching bars: {e}")
            return []

    def get_bar_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch detailed information for a specific place.
        """
        if not self.gmaps:
            return None
        
        try:
            # Fetch details including opening hours and ratings
            # Documentation: https://developers.google.com/maps/documentation/places/web-service/details
            details = self.gmaps.place(
                place_id=place_id,
                fields=[
                    "name", 
                    "place_id", 
                    "rating", 
                    "user_ratings_total", 
                    "opening_hours", 
                    "formatted_address", 
                    "geometry",
                    "price_level"
                ]
            )
            return details.get("result")
        except Exception as e:
            print(f"Error fetching bar details for {place_id}: {e}")
            return None

# Singleton instance
google_places = GooglePlacesService()
