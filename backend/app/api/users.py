from flask import Blueprint, jsonify, request
from app.services.user_service import get_all_users, update_user, change_user_password
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.utils.responses import success_response

users = Blueprint('users', __name__)

# =========================
# USER LIST
# =========================
@users.route('/api/users', methods=['GET'])
@jwt_required()
def list_users():
    """Returns all users from the database."""
    users = get_all_users()
    return success_response(
        message="Fetched all users successfully",
        data=users
    )

# =========================
# UPDATE USER
# =========================
@users.route("/api/users/me/update", methods=["PUT"])
@jwt_required()
def update_current_user():
    user_id = get_jwt_identity()
    updated_user = update_user(user_id, request.get_json())

    return success_response(
        message="User updated successfully",
        data=updated_user
    )

# =========================
# CHANGE USER PASSWORD
# =========================
@users.route("/api/users/me/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()

    change_user_password(
        user_id=user_id,
        data=request.get_json()
    )

    return success_response(
        message="Password updated successfully",
    )