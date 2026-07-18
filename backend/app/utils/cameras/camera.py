import cv2
import time

from app.services.camera_service import get_camera_details
from app.repositories.camera_repository import update_camera_status

MAX_RETRIES = 5
RETRY_DELAY = 3

DB_REFRESH_EVERY = 150

def open_camera(source):
    cap = cv2.VideoCapture(source)

    if not cap.isOpened():
        return None

    success, frame = cap.read()

    if not success or frame is None:
        cap.release()
        return None

    return cap

def refresh_camera(camera_id, frame_count, camera):

    if frame_count % DB_REFRESH_EVERY != 0:
        return camera

    refreshed = get_camera_details(camera_id)

    return refreshed or camera

def reconnect_camera(worker, user_id, camera_id, source):
    while worker.running:
        print(f"Reconnecting camera {camera_id}")
        time.sleep(RETRY_DELAY)

        cap = open_camera(source)

        if cap:
            print(f"Camera {camera_id} reconnected")
            update_camera_status(
                user_id=user_id,
                camera_id=camera_id,
                status="online"
            )
            return cap
        
    print(f"Failed to reconnect camera {camera_id}")
    update_camera_status(
        user_id=user_id,
        camera_id=camera_id,
        status="offline"
    )

    return None

def read_frame(worker, cap, source, user_id, camera_id):
    if not cap or cap is None:
        cap = reconnect_camera(
            worker=worker, 
            user_id=user_id, 
            camera_id=camera_id, 
            source=source
        )

        if cap is None:
            return None, None

    success, frame = cap.read()

    if success and frame is not None and frame.size > 0:
        return cap, frame

    print("[WARN] Camera disconnected.")

    update_camera_status(user_id, camera_id, "offline")

    cap.release()

    cap = reconnect_camera(
        worker=worker, 
        user_id=user_id, 
        camera_id=camera_id, 
        source=source
    )

    if cap is None:
        return None, None

    update_camera_status(user_id, camera_id, "online")

    success, frame = cap.read()

    if not success or frame is None:
        return None, None

    return cap, frame
