from app.core.supabase import supabase
from app.types.camera_types import Camera
from app.core.exceptions import InternalServerError, NotFoundError

def get_cameras() -> list[Camera]:
    """Fetch all cameras from the database."""
    response = (
        supabase
        .table("cameras")
        .select("*")
        .execute()
    )

    return response.data or []

def get_cameras_by_id(user_id: str) -> list[Camera]:
    response = (
        supabase
        .table("cameras")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    return response.data or []

def get_camera(camera_id: int) -> Camera:
    """Fetch a single camera by ID."""
    response = (
        supabase
        .table("cameras")
        .select("*")
        .eq("camera_id", camera_id)
        .limit(1)
        .execute()
    )

    return response.data[0] if response.data else None

def update_camera_status(user_id: str, camera_id: int, status: str):
    """Update the status column of a camera."""
    try:
        response = (
            supabase
            .table("cameras")
            .update({ 'status': status })
            .match({
                "user_id": user_id,
                "camera_id": camera_id,
            })
            .execute()
        )
    except Exception:
        raise InternalServerError(
            "Failed to update camera status."
        )

    if not response.data:
        raise NotFoundError("Camera not found.")

    return response.data[0]

def update_camera_field(camera_id: int, field: str, value):
    """Update any single field on a camera row."""
    (
        supabase
        .table("cameras")
        .update({field: value})
        .eq("camera_id", camera_id)
        .execute()
    )