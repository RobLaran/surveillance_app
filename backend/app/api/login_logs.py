from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.login_log_service import get_all_login_history
from app.repositories.login_log_repository import get_user_login_logs, get_last_login
from app.utils.responses import success_response

login_logs = Blueprint("login_logs", __name__)

# =========================
# ALL LOGIN LOGS
# =========================
@login_logs.route("/api/login-logs", methods=["GET"])
@jwt_required()
def get_login_logs():
    result = get_all_login_history()
    return success_response(
        message="Retrieved all login logs successfully",
        data=result
    )

# =========================
# USER LOGIN LOGS
# =========================
@login_logs.route("/api/login-logs/me", methods=["GET"])
@jwt_required()
def me_login_logs():
    user_id = get_jwt_identity()
    result = get_user_login_logs(user_id=user_id)
    return jsonify({
        "success": True,
        "message": "Login logs fetched successfully",
        "data" : result
    }), 201

# =========================
# USER LOGIN LOGS
# =========================
@login_logs.route("/api/login-logs/me/latest", methods=["GET"])
@jwt_required()
def me_latest_login_log():
    user_id = get_jwt_identity()
    result = get_last_login(user_id=user_id)
    return jsonify(result), 201

