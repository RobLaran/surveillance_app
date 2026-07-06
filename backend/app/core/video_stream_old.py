import cv2
from ultralytics import YOLO
from app.services.face_service import get_face_app, recognize_face
from app.utils.geometry import face_inside_person

# =========================
# CONFIG
# =========================
URL = "http://192.168.100.95:4747/video"
DETECT_EVERY = 5

# =========================
# MODELS
# =========================
yolo_model = YOLO("yolov8n.pt")
face_app = get_face_app()

# =========================
# STREAM
# =========================
def generate_frames():
    cap = cv2.VideoCapture(URL, cv2.CAP_FFMPEG)

    if not cap.isOpened():
        print("[ERROR] Camera not accessible")
        return

    frame_count = 0
    face_locations = []
    face_names = []
    person_boxes = []

    try:
        while True:
            ret, frame = cap.read()
            if not ret or frame is None or frame.size == 0:
                continue

            frame_count += 1

            if frame_count % DETECT_EVERY == 0:
                # --- YOLO person detection ---
                results = yolo_model(frame, verbose=False)[0]
                person_boxes = []
                for box in results.boxes:
                    if int(box.cls[0]) == 0:  # class 0 = person
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        person_boxes.append((y1, x2, y2, x1))

                # --- InsightFace detection + recognition ---
                faces = face_app.get(frame)
                face_locations = []
                face_names = []

                for face in faces:
                    x1, y1, x2, y2 = map(int, face.bbox)
                    name, sim = recognize_face(face.normed_embedding)
                    face_locations.append((y1, x2, y2, x1))
                    face_names.append(name)

            # --- Draw face boxes ---
            for (top, right, bottom, left), name in zip(face_locations, face_names):
                box_color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
                cv2.rectangle(frame, (left, top), (right, bottom), box_color, 2)
                cv2.putText(
                    frame, name, (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, box_color, 2
                )

            # --- Draw person boxes where face is hidden ---
            for person_box in person_boxes:
                if not face_inside_person(person_box, face_locations):
                    top, right, bottom, left = person_box
                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 165, 255), 2)
                    cv2.putText(
                        frame, "Person (Face Hidden)", (left, top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2
                    )

            _, buffer = cv2.imencode('.jpg', frame)
            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n'
                + buffer.tobytes()
                + b'\r\n'
            )

    finally:
        cap.release()