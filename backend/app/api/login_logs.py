from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.login_log_service import get_all_login_history, get_last_login, get_login_history
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
def login_history():
    user_id = str(get_jwt_identity())
    result = get_login_history(user_id=user_id)
    return success_response(
        message="Login history retrieved successfully",
        data=result
    )


# =========================
# USER LOGIN LOGS
# =========================
@login_logs.route("/api/login-logs/me/last", methods=["GET"])
@jwt_required()
def last_login():
    user_id = str(get_jwt_identity())
    result = get_last_login(user_id=user_id)
    return success_response(
        message="Last login retrieved successfully",
        data=result
    )

