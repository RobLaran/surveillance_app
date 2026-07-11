import logging
from flask import Blueprint, request, Response
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
    verify_jwt_in_request,
)

from app.services.auth_service import login_user, register_user, set_tokens
from app.services.user_service import build_current_user
from app.utils.responses import success_response

logger = logging.getLogger(__name__)
auth = Blueprint("auth", __name__)


# =========================
# REGISTER
# =========================
@auth.route("/api/auth/sign-up", methods=["POST"])
def sign_up() -> Response:
    user = register_user(request.get_json())

    return success_response(
        message="Account created successfully",
        data=user,
        status=201
    )


# =========================
# LOGIN
# =========================
@auth.route("/api/auth/sign-in", methods=["POST"])
def sign_in() -> Response:
    verify_jwt_in_request(optional=True)

    if get_jwt_identity():
        return success_response(
            message="Already signed in",
        )

    user = login_user(request.get_json())
    user_id = str(user["user_id"])
    response = success_response(
        message="Signed in successfully",
        data=user
    )

    return set_tokens(identity=user_id, response=response)


# =========================
# CURRENT USER
# =========================
@auth.route("/api/auth/me", methods=["GET"])
@jwt_required()
def me() -> Response:
    current_user = build_current_user(
        user_id=str(get_jwt_identity()),
        exp=get_jwt()["exp"]
    )
    
    return success_response(
        message="Fetched current user successfully",
        data=current_user
    )

# =========================
# REFRESH TOKEN
# =========================
@auth.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh() -> Response:
    new_access_token = create_access_token(identity=str(get_jwt_identity()))
    response = success_response(
        message="Token refreshed successfully"
    )
    
    set_access_cookies(response, new_access_token)
    return response


# =========================
# LOGOUT
# =========================
@auth.route("/api/auth/sign-out", methods=["POST"])
@jwt_required(verify_type=False)
def sign_out() -> Response:
    response = success_response(
        message="Signed out successfully"
    )

    unset_jwt_cookies(response)
    return response