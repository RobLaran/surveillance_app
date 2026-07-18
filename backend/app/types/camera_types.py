from typing import TypedDict

class Camera(TypedDict):
    camera_id: str
    user_id: str
    camera_name: str
    camera_stream_url: str
    camera_type: str
    location: str
    status: str
    ai_enabled: bool
    recording_enabled: bool
    motion_detection_enabled: bool
    created_at: str


    