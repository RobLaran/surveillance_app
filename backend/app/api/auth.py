import logging
from flask import Blueprint, request, Response
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

from app.core.exceptions import NotFoundError
from app.services.auth_service import login_user, register_user, set_tokens
from app.services.user_service import get_user_by_id
from app.services.login_log_service import get_last_login
from app.services.storage_service import get_image
from app.utils.responses import success_response
from app.serializers.user_serializer import serialize_current_user

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
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id=user_id)
    
    if not user:
        raise NotFoundError("User not found")
    
    login_log = get_last_login(user_id=user_id)

    avatar_path = user.get("avatar_path")
    avatar_url = get_image(avatar_path) if avatar_path else None
    
    return success_response(
        message="Fetched user successfully",
        data=serialize_current_user(
            user=user,
            login_log=login_log,
            avatar_url=avatar_url,
            exp=get_jwt()["exp"]
        )
    )

# =========================
# REFRESH
# =========================
@auth.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh() -> Response:
    new_access_token = create_access_token(identity=get_jwt_identity())
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