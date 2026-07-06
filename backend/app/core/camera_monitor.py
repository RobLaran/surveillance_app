import cv2
import socket
import threading
import time
import requests
from urllib.parse import urlparse
from app.services.camera_service import get_all_cameras, update_camera_status

# =========================
# CONFIG
# =========================
CHECK_INTERVAL = 30  # seconds between checks

# =========================
# CHECKS BY SOURCE TYPE
# =========================
def check_http(url: str, timeout: int = 3) -> bool:
    """Fast check for HTTP/MJPEG streams using a HEAD request."""
    try:
        response = requests.head(url, timeout=timeout)
        return response.status_code < 500
    except requests.RequestException:
        return False

def check_rtsp(url: str, timeout: int = 3) -> bool:
    """Fast TCP socket check for RTSP streams."""
    try:
        parsed = urlparse(url)
        host = parsed.hostname
        port = parsed.port or 554
        sock = socket.create_connection((host, port), timeout=timeout)
        sock.close()
        return True
    except (socket.timeout, socket.error, OSError):
        return False

def check_webcam(index: int) -> bool:
    """For local webcams there's no better way than VideoCapture."""
    cap = cv2.VideoCapture(index)
    online = cap.isOpened()
    cap.release()
    return online

# =========================
# MAIN IS_ONLINE HELPER
# =========================
def is_online(camera: dict) -> bool:
    source = camera.get("stream_url")
    if not source:
        return False

    # Webcam index stored as string e.g. "0"
    if isinstance(source, str) and source.isdigit():
        return check_webcam(int(source))

    if isinstance(source, str):
        if source.startswith("http"):
            return check_http(source)
        if source.startswith("rtsp"):
            return check_rtsp(source)

    return False

# =========================
# MONITOR LOOP
# =========================
def check_camera(camera: dict):
    """Check a single camera and update DB if status changed."""
    try:
        online = is_online(camera)
        new_status = "online" if online else "offline"

        if new_status != camera.get("status"):
            update_camera_status(camera["id"], new_status)
            print(f"[MONITOR] Camera '{camera['name']}' → {new_status}")
    except Exception as e:
        print(f"[MONITOR] Error checking camera '{camera.get('name')}': {e}")

def monitor_loop():
    """Runs in background, checks all cameras every CHECK_INTERVAL seconds."""
    while True:
        try:
            cameras = get_all_cameras()
            threads = [
                threading.Thread(target=check_camera, args=(cam,), daemon=True)
                for cam in cameras
            ]
            for t in threads:
                t.start()
            for t in threads:
                t.join()
        except Exception as e:
            print(f"[MONITOR] Monitor loop error: {e}")

        time.sleep(CHECK_INTERVAL)

def start_monitor():
    """Starts the camera monitor as a background daemon thread."""
    thread = threading.Thread(target=monitor_loop, daemon=True)
    thread.start()
    print(f"[MONITOR] Camera monitor started (checking every {CHECK_INTERVAL}s)")