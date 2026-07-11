from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from app.services.storage_service import get_user_avatar, remove_user_avatar, upload_user_avatar
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

    user_id = str(get_jwt_identity())

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
    user_id = str(get_jwt_identity())
    result = remove_user_avatar(user_id)

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
    user_id = str(get_jwt_identity())

    user = get_user_by_id(user_id)

    if not user:
        raise NotFoundError("User not found")
    
    avatar_path = str(user["avatar_path"])

    if not avatar_path:
        raise ValidationError("No avatar path")

    result = get_user_avatar(avatar_path)

    return success_response(
        message="User avatar retrieved successfully",
        data=result
    )