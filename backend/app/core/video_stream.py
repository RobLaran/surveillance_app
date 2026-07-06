import cv2
import time

from ultralytics import YOLO
from app.services.face_service import get_face_app, recognize_face
from app.services.camera_service import get_camera, update_camera_status
from app.utils.geometry import face_inside_person
from app.core.frame_cache import set_frame, clear_frame

# =========================
# CONFIG
# =========================
DETECT_EVERY = 5
DB_REFRESH_EVERY = 150  # refresh camera config from DB every ~5 seconds (150 frames at 30fps)
MAX_RETRIES = 5
RETRY_DELAY = 3

# =========================
# MODELS
# =========================
yolo_model = YOLO("yolov8n.pt")
face_app = get_face_app()

# =========================
# STREAM
# =========================
def generate_frames(camera_id: int):
    camera = get_camera(camera_id)

    if not camera:
        print(f"[ERROR] Camera ID {camera_id} not found in database")
        return

    source = camera.get("stream_url")
    if source is None:
        print(f"[ERROR] Camera '{camera['name']}' has no stream_url")
        return

    if isinstance(source, str) and source.isdigit():
        source = int(source)

    def open_capture():
        cap = cv2.VideoCapture(source)
        return cap if cap.isOpened() else None

    cap = open_capture()
    if cap is None:
        print(f"[ERROR] Camera '{camera['name']}' not accessible (source: {source})")
        update_camera_status(camera_id, "offline")
        return

    update_camera_status(camera_id, "online")
    print(f"[INFO] Started stream for camera '{camera['name']}' (id: {camera_id})")

    frame_count = 0
    face_locations = []
    face_names = []
    person_boxes = []
    consecutive_failures = 0

    try:
        while True:
            ret, frame = cap.read()
            if not ret or frame is None or frame.size == 0:
                consecutive_failures += 1
                print(f"[WARN] Camera '{camera['name']}' frame read failed ({consecutive_failures}/{MAX_RETRIES})")

                if consecutive_failures >= MAX_RETRIES:
                    print(f"[WARN] Camera '{camera['name']}' attempting reconnect...")
                    cap.release()
                    update_camera_status(camera_id, "offline")

                    reconnected = False
                    for attempt in range(1, MAX_RETRIES + 1):
                        time.sleep(RETRY_DELAY)
                        print(f"[INFO] Reconnect attempt {attempt}/{MAX_RETRIES} for camera '{camera['name']}'")
                        cap = open_capture()
                        if cap is not None:
                            update_camera_status(camera_id, "online")
                            consecutive_failures = 0
                            reconnected = True
                            print(f"[INFO] Camera '{camera['name']}' reconnected successfully")
                            break

                    if not reconnected:
                        print(f"[ERROR] Camera '{camera['name']}' failed to reconnect, stopping stream")
                        break
                continue

            consecutive_failures = 0  # reset on successful frame

            frame_count += 1

            # --- Refresh camera config from DB periodically ---
            if frame_count % DB_REFRESH_EVERY == 0:
                refreshed = get_camera(camera_id)
                if refreshed:
                    camera = refreshed
                    print(f"[INFO] Refreshed config for camera '{camera['name']}' (ai_enabled={camera.get('ai_enabled')})")

            if frame_count % DETECT_EVERY == 0:
                # --- YOLO person detection ---
                results = yolo_model(frame, verbose=False)[0]
                person_boxes = []
                for box in results.boxes:
                    if int(box.cls[0]) == 0:
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        person_boxes.append((y1, x2, y2, x1))

                # --- InsightFace detection + recognition ---
                if camera.get("ai_enabled"):
                    faces = face_app.get(frame)
                    face_locations = []
                    face_names = []

                    for face in faces:
                        x1, y1, x2, y2 = map(int, face.bbox)
                        name, sim = recognize_face(face.normed_embedding)
                        face_locations.append((y1, x2, y2, x1))
                        face_names.append(name)
                else:
                    # AI disabled — clear any stale detections
                    face_locations = []
                    face_names = []
                    person_boxes = []

            # --- Draw face boxes (only if AI enabled) ---
            if camera.get("ai_enabled"):
                for (top, right, bottom, left), name in zip(face_locations, face_names):
                    box_color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
                    cv2.rectangle(frame, (left, top), (right, bottom), box_color, 2)
                    cv2.putText(
                        frame, name, (left, top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, box_color, 2
                    )

                for person_box in person_boxes:
                    if not face_inside_person(person_box, face_locations):
                        top, right, bottom, left = person_box
                        cv2.rectangle(frame, (left, top), (right, bottom), (0, 165, 255), 2)
                        cv2.putText(
                            frame, "Person (Face Hidden)", (left, top - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2
                        )

            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            # cache the latest frame
            set_frame(camera_id, frame_bytes)

            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n'
                + frame_bytes
                + b'\r\n'
            )

    finally:
        cap.release()
        clear_frame(camera_id)
        update_camera_status(camera_id, "offline")
        print(f"[INFO] Released camera '{camera['name']}' (id: {camera_id})")