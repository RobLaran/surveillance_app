from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from app.services.storage_service import upload_image, get_image, remove_image
from app.repositories.user_repository import get_user_by_id, update_user_avatar
from app.core.exceptions import NotFoundError, ValidationError

storage = Blueprint('storage', __name__)

# =========================
# UPLOAD AVATAR IMAGE
# =========================
@storage.route("/api/avatars/upload", methods=["PUT"])
@jwt_required()
def upload_avatar():
    file = request.files.get("avatar")

    if not file:
        raise ValidationError("No file uploaded")

    user_id = get_jwt_identity()

    avatar_path = f"{user_id}/avatar.png"

    result = upload_image(
        file.read(),
        avatar_path,
        file.content_type
    )

    update_user_avatar(user_id, avatar_path)

    return jsonify(result), 201

# =========================
# REMOVE AVATAR IMAGE
# =========================
@storage.route("/api/avatars/me/remove", methods=["DELETE"])
@jwt_required()
def remove_avatar():
    user_id = get_jwt_identity()

    user = get_user_by_id(str(user_id))

    if not user:
        raise NotFoundError("User not found")

    avatar_path = user.get("avatar_path")

    if not avatar_path:
        raise ValidationError("No avatar uploaded")

    result = remove_image([avatar_path])

    update_user_avatar(user_id, None)

    return jsonify(result), 200

# =========================
# GET AVATAR IMAGE
# =========================
@storage.route("/api/avatars/me", methods=["GET"])
@jwt_required()
def get_avatar():
    user_id = get_jwt_identity()

    user = get_user_by_id(str(user_id))

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    avatar_path = user.get("avatar_path")

    if not avatar_path:
        return jsonify({
            "success": False,
            "message": "Avatar not found",
            "user": user
        }), 404

    result = get_image(avatar_path)

    return (
        jsonify(result),
        200 if result["success"] else 500
    )