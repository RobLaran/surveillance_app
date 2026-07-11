from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from app.services.storage_service import get_image, remove_user_avatar, upload_user_avatar
from app.repositories.user_repository import get_user_by_id
from app.core.exceptions import NotFoundError, ValidationError
from app.utils.responses import success_response

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

    result = upload_user_avatar(
        user_id=user_id,
        file=file
    )

    return success_response(
        message="User avatar uploaded successfully",
        data=result
    )


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

    avatar_path = str(user["avatar_path"])

    if not avatar_path:
        raise ValidationError("No avatar path")

    result = remove_user_avatar(user_id, avatar_path)

    return success_response(
        message="User avatar removed successfully",
        data=result
    )


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