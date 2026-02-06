import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in environment variables.")

# Create a Supabase client
# Using the service role key allows the backend to bypass RLS for administrative tasks
supabase: Client = create_client(url, key) if url and key else None

def get_supabase_client():
    return supabase
