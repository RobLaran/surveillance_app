from .supabase_client import supabase

def get_all_cameras():
    """Fetch all cameras from the database."""
    response = supabase.table("cameras").select("*").execute()
    return response.data

def get_camera(camera_id: int):
    """Fetch a single camera by ID."""
    response = supabase.table("cameras").select("*").eq("id", camera_id).single().execute()
    return response.data

def update_camera_status(camera_id: int, status: str):
    """Update the status column of a camera."""
    supabase.table("cameras").update({"status": status}).eq("id", camera_id).execute()

def update_camera_field(camera_id: int, field: str, value):
    """Update any single field on a camera row."""
    supabase.table("cameras").update({field: value}).eq("id", camera_id).execute()