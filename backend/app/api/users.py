from flask import Blueprint, jsonify, request
from app.services.user_service import get_all_users, update_user
from flask_jwt_extended import get_jwt_identity, jwt_required

users = Blueprint('users', __name__)

# =========================
# USER LIST
# =========================
@users.route('/api/users', methods=['GET'])
def list_users():
    """Returns all users from the database."""
    users = get_all_users()
    return jsonify(users), 200

# =========================
# UPDATE USER
# =========================
@users.route("/api/users/me/update", methods=["PUT"])
@jwt_required()
def update_current_user():
    user_id = get_jwt_identity()

    payload = {
        "first_name": request.form.get("first_name"),
        "last_name": request.form.get("last_name"),
        "email": request.form.get("email"),
        "phone_number": request.form.get("phone_number"),
        "location": request.form.get("location"),
    }

    result = update_user(user_id, payload)

    return jsonify(result), 200