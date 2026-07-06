import threading

_cache: dict[int, bytes] = {}
_lock = threading.Lock()

def set_frame(camera_id: int, frame_bytes: bytes):
    with _lock:
        _cache[camera_id] = frame_bytes

def get_frame(camera_id: int) -> bytes | None:
    with _lock:
        return _cache.get(camera_id)

def clear_frame(camera_id: int):
    with _lock:
        _cache.pop(camera_id, None)