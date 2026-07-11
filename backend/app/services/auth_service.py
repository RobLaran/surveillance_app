import logging

from flask import Response
from flask_jwt_extended import create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies

from app.utils.auth.password import verify_password, hash_password
from app.utils.auth.validators import validate_sign_up_fields, validate_sign_in_fields
from app.utils.auth.sanitizers import sanitize_sign_up_fields, sanitize_sign_in_fields
from app.core.exceptions import ValidationError, ConflictError, UnauthorizedError
from app.serializers.user_serializer import serialize_public_user
from app.types.user_types import PublicUser, User
from app.types.auth_types import CreateUserData, LoginUserData
from app.repositories.user_repository import create_user, get_user_by_email
from app.helpers.auth import log_login_success

logger = logging.getLogger(__name__)

_DUMMY_HASH = "$2b$12$invalidhashfortimingpurposesXXXXXXXXXXXXXXXXXXXXXXXXXX"

# =========================
# REGISTER
# =========================
def register_user(data: dict) -> PublicUser:
    """Register a new user."""
    if not data:
        raise ValidationError(errors=["Request body is required"])

    data = sanitize_sign_up_fields(data)

    is_valid, errors = validate_sign_up_fields(data)
    if not is_valid:
        raise ValidationError(errors=errors)
    
    email = data["email"]

    if get_user_by_email(email):
        raise ConflictError("Email already in use")

    password_hash = hash_password(data["password"])

    payload: CreateUserData = {
        "first_name": data["first_name"],
        "last_name": data["last_name"],
        "email": email,
        "password_hash": password_hash,
    }

    user = create_user(payload)
    
    return serialize_public_user(user)


# =========================
# LOGIN
# =========================
def login_user(data: dict) -> PublicUser:
    """Authenticate a user and return its public representation."""
    if not data:
        raise ValidationError(errors=["Request body is required"])

    data = sanitize_sign_in_fields(data)

    is_valid, errors = validate_sign_in_fields(data)
    if not is_valid:
        raise ValidationError(errors=errors)
    
    payload: LoginUserData = {
        "email": data["email"],
        "password": data["password"]
    }

    user = authenticate_user(payload)

    log_login_success(user)
    return serialize_public_user(user)


# =========================
# AUTHENTICATE
# =========================
def authenticate_user(payload: LoginUserData) -> User:
    """Verify credentials. Always runs verify_password to prevent timing attacks."""
    user = get_user_by_email(payload["email"])

    password_hash = user["password_hash"] if user else _DUMMY_HASH
    is_valid = verify_password(payload["password"], password_hash)

    if not user or not is_valid:
        logger.warning("AUTH FAILED: %s", payload["email"])
        raise UnauthorizedError()

    return user


# =========================
# SET TOKENS
# =========================
def set_tokens(identity: str, response: Response) -> Response:
    """Set access token and refresh token in response."""
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response