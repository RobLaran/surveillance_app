import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    verify_jwt_in_request,
)
from app.services.auth_service import login_user, register_user
from app.services.user_service import get_user_by_id
from app.services.login_log_service import get_latest_login_log
from app.core.exceptions import NotFoundError

logger = logging.getLogger(__name__)
auth = Blueprint("auth", __name__)


# =========================
# REGISTER
# =========================
@auth.route("/api/auth/sign-up", methods=["POST"])
def sign_up():
    result = register_user(request.get_json())
    return jsonify(result), 201


# =========================
# LOGIN
# =========================
@auth.route("/api/auth/sign-in", methods=["POST"])
def sign_in():
    verify_jwt_in_request(optional=True)
    if get_jwt_identity():
        return jsonify({
            "success": True, 
            "message": "Already signed in"
        }), 200

    result = login_user(request.get_json())
    data = result["data"]
    login_log = data.get("login_log")
    user_id = login_log.get("user_id")
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    response = jsonify(result)

    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response, 200


# =========================
# CURRENT USER
# =========================
@auth.route("/api/auth/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id=user_id)
    login_log = get_latest_login_log(user_id=user_id)

    if not user:
        raise NotFoundError("User not found")
    
    return jsonify({
        "success": True,
        "user": {
            "user_id": user.get("user_id"),
            "first_name": user.get("first_name"),
            "last_name": user.get("last_name"),
            "email": user.get("email"),
            "phone_number": user.get("phone_number"),
            "location": user.get("location"),
            "avatar": user.get("avatar_path"),
            "login_log": login_log,
            "created_at": user.get("created_at"),
            "exp": get_jwt()["exp"],
        },
    }), 200

# =========================
# REFRESH
# =========================
@auth.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    new_access_token = create_access_token(identity=get_jwt_identity())
    response = jsonify({"success": True, "message": "Token refreshed successfully"})
    set_access_cookies(response, new_access_token)
    return response, 200


# =========================
# LOGOUT
# =========================
@auth.route("/api/auth/sign-out", methods=["POST"])
@jwt_required(verify_type=False)
def sign_out():
    response = jsonify({"success": True, "message": "Signed out successfully"})
    unset_jwt_cookies(response)
    return response, 200