import cv2
import io
import numpy as np

from flask import Blueprint, Response, jsonify
from app.core.video_stream import generate_frames
from app.core.camera_monitor import is_online
from app.core.frame_cache import get_frame
from app.services.camera_service import (
    get_all_cameras,
    get_camera,
    update_camera_status,
    update_camera_field
)

cameras = Blueprint('cameras', __name__)

# =========================
# VIDEO STREAM
# =========================
@cameras.route('/video/<int:camera_id>')
def video_feed(camera_id):
    camera = get_camera(camera_id)
    if not camera:
        return jsonify({"error": f"Camera {camera_id} not found"}), 404
    
    try:
        online = is_online(camera)

        if not online:
            return jsonify({
                "id": camera_id,
                "name": camera["name"],
                "status": "offline",
                "online": False,
                "message": "[ERROR] Camera is offline"
            }), 200 

        return Response(
            generate_frames(camera_id),
            mimetype='multipart/x-mixed-replace; boundary=frame'
        )
    except Exception as e:
        print(f"[ERROR] Status check failed for camera {camera_id}: {e}")
        return jsonify({
            "id": camera_id,
            "name": camera["name"],
            "status": "offline",
            "online": False,
        }), 200 

    

# =========================
# CAMERA LIST
# =========================
@cameras.route('/cameras')
def list_cameras():
    """Returns all cameras from the database."""
    cameras = get_all_cameras()
    return jsonify(cameras)

# =========================
# SINGLE CAMERA
# =========================
@cameras.route('/cameras/<int:camera_id>')
def camera_detail(camera_id):
    """Returns a single camera's details."""
    camera = get_camera(camera_id)
    if not camera:
        return jsonify({"error": f"Camera {camera_id} not found"}), 404
    return jsonify(camera)

# =========================
# CAMERA STATUS CHECK
# =========================
@cameras.route('/cameras/<int:camera_id>/status')
def camera_status(camera_id):
    """Checks if a camera stream is accessible and updates DB."""
    camera = get_camera(camera_id)
    if not camera:
        return jsonify({"error": f"Camera {camera_id} not found"}), 404

    try:
        online = is_online(camera)
        status = "online" if online else "offline"
        update_camera_status(camera_id, status)

        return jsonify({
            "id": camera_id,
            "name": camera["name"],
            "status": status,
            "online": online,
        })
    except Exception as e:
        print(f"[ERROR] Status check failed for camera {camera_id}: {e}")
        update_camera_status(camera_id, "offline")
        return jsonify({
            "id": camera_id,
            "name": camera["name"],
            "status": "offline",
            "online": False,
        }), 200  # still 200 so the frontend handles it gracefully

# =========================
# TOGGLE AI
# =========================
@cameras.route('/cameras/<int:camera_id>/ai', methods=['POST'])
def toggle_ai(camera_id):
    """Toggles AI processing for a camera."""
    camera = get_camera(camera_id)
    if not camera:
        return jsonify({"error": f"Camera {camera_id} not found"}), 404

    new_value = not camera.get("ai_enabled", False)
    update_camera_field(camera_id, "ai_enabled", new_value)

    return jsonify({
        "id": camera_id,
        "ai_enabled": new_value
    })

# =========================
# CAMERA THUMBNAIL
# =========================
@cameras.route('/cameras/<int:camera_id>/thumbnail')
def camera_thumbnail(camera_id):
    camera = get_camera(camera_id)
    if not camera:
        return jsonify({"error": f"Camera {camera_id} not found"}), 404

    # Try cache first
    frame_bytes = get_frame(camera_id)

    if frame_bytes:
        return Response(
            io.BytesIO(frame_bytes).read(),
            mimetype='image/jpeg'
        )

    # Fall back to opening a new connection if stream isn't active
    if camera.get("status") != "online":
        return jsonify({"error": "Camera is offline"}), 503

    source = camera.get("stream_url")
    if isinstance(source, str) and source.isdigit():
        source = int(source)

    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        return jsonify({"error": "Could not open stream"}), 503

    ret, frame = cap.read()
    cap.release()

    if not ret or frame is None:
        return jsonify({"error": "Could not capture frame"}), 503

    _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
    return Response(
        io.BytesIO(buffer).read(),
        mimetype='image/jpeg'
    )

# =========================
# TESTING ROUTES
# =========================
@cameras.route('/test/status/<int:camera_id>/<status>')
def test_status(camera_id, status):
    update_camera_status(camera_id, status)
    return jsonify({"camera_id": camera_id, "status": status})