from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get credentials from environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
