import cv2
import io

from flask import Blueprint, Response, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.core.stream import generate_frames
from app.core.camera_monitor import is_online
from app.core.frame_cache import get_frame
from app.services.camera_service import (
    get_camera_details,
    get_camera_list,
    get_user_camera_list,
    update_camera_field
)
from app.repositories.camera_repository import update_camera_status
from app.utils.responses import success_response
from app.core.camera_manager import start_camera
from app.core.exceptions import NotFoundError, ValidationError
from app.utils.cameras.camera import open_camera

cameras = Blueprint('cameras', __name__)

# =========================
# VIDEO STREAM
# =========================
@cameras.route('/api/cameras/<int:camera_id>/video', methods=["GET"])
@jwt_required()
def video_feed(camera_id):
    user_id = str(get_jwt_identity())
    worker = start_camera(user_id, camera_id)
    worker.viewers += 1

    return Response(
        response=generate_frames(worker, camera_id),
        status=200,
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )
    

# =========================
# CAMERA LIST
# =========================
@cameras.route('/api/cameras')
@jwt_required()
def camera_list():
    """Returns all cameras from the database."""
    camera_list = get_camera_list()
    return success_response(
        message="Fetched all cameras successfully",
        data=camera_list
    )

# =========================
# USER CAMERA LIST
# =========================
@cameras.route('/api/cameras/me')
@jwt_required()
def me_camera_list():
    """Returns all cameras from the database."""
    user_id = str(get_jwt_identity())
    camera_list = get_user_camera_list(user_id)
    return success_response(
        message="Fetched user cameras successfully",
        data=camera_list
    )

# =========================
# SINGLE CAMERA
# =========================
@cameras.route('/api/cameras/<int:camera_id>')
@jwt_required()
def camera_details(camera_id: int):
    """Returns a single camera's details."""
    camera_details = get_camera_details(camera_id)
    return success_response(
        message="Fetched camera details successfully",
        data=camera_details
    )

# =========================
# CAMERA STATUS CHECK
# =========================
@cameras.route('/api/cameras/<int:camera_id>/status',  methods=["GET"])
@jwt_required()
def camera_status(camera_id):
    """Checks if a camera stream is accessible and updates DB."""
    user_id = str(get_jwt_identity())
    if not user_id:
        raise NotFoundError("No user id found")

    camera = get_camera_details(camera_id)
    if not camera:
        raise NotFoundError(f"No camera {camera_id} found")
    
    source = str(camera["camera_stream_url"])

    if not source:
        raise ValidationError("No stream url")

    print(f"Opening camera {camera_id}")
    cap = open_camera(source)

    data = None

    if cap is None:
        print(f"Failed to open camera {camera_id}")
        data = update_camera_status(
            user_id=user_id, 
            camera_id=int(camera_id), 
            status="offline"
        )
        return success_response(
            message="Camera status is offline",
            data=data
        )

    data = update_camera_status(
        user_id=user_id, 
        camera_id=camera_id, 
        status="online"
    )

    return success_response(
        message="Camera status is online",
        data=data
    )


# =========================
# TOGGLE AI
# =========================
@cameras.route('/cameras/<int:camera_id>/ai', methods=['POST'])
def toggle_ai(camera_id):
    """Toggles AI processing for a camera."""
    camera = get_camera_details(camera_id)
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
    camera = get_camera_details(camera_id)
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