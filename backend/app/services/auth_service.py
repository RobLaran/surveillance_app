import logging
from .supabase_client import supabase
from .user_service import get_user_by_email, create_user
from app.utils.auth.password import verify_password, hash_password
from app.utils.auth.validators import validate_sign_up_fields, validate_sign_in_fields
from app.utils.auth.sanitizers import sanitize_sign_up_fields, sanitize_sign_in_fields
from app.utils.request import get_client_ip, get_user_agent
from app.core.exceptions import ValidationError, ConflictError, UnauthorizedError

logger = logging.getLogger(__name__)

_DUMMY_HASH = "$2b$12$invalidhashfortimingpurposesXXXXXXXXXXXXXXXXXXXXXXXXXX"

# =========================
# REGISTER
# =========================
def register_user(data: dict):
    if not data:
        raise ValidationError(errors=["Request body is required"])

    data = sanitize_sign_up_fields(data)

    is_valid, errors = validate_sign_up_fields(data)
    if not is_valid:
        raise ValidationError(errors=errors)

    if get_user_by_email(data.get("email")):
        raise ConflictError("Email already in use")

    password_hash = hash_password(data.get("password"))

    user = create_user({
        "first_name": data.get("first_name"),
        "last_name": data.get("last_name"),
        "email": data.get("email"),
        "password_hash": password_hash,
    })

    if not user:
        raise RuntimeError("Failed to create user")

    return {
        "success": True,
        "user_id": user.get("user_id"),
        "message": "Account created successfully",
    }


# =========================
# LOGIN
# =========================
def login_user(data: dict):
    if not data:
        raise ValidationError(errors=["Request body is required"])

    data = sanitize_sign_in_fields(data)

    is_valid, errors = validate_sign_in_fields(data)
    if not is_valid:
        raise ValidationError(errors=errors)

    user = authenticate_user(data.get("email"), data.get("password"))

    # Scrub password_hash before the dict leaves the service layer
    user.pop("password_hash", None)

    user_id = str(user["user_id"])
    email = user["email"]

    try :
        create_login_log(
            user_id=user_id,
            email=email,
            ip_address=get_client_ip(),
            user_agent=get_user_agent()
        )
    except Exception as e:
        print(f"Failed to create login log: {e}")

    return {
        "success": True,
        "message": "Signed in successfully",
        "user_id": user_id
    }


# =========================
# AUTHENTICATE
# =========================
def authenticate_user(email: str, password: str):
    """Verify credentials. Always runs verify_password to prevent timing attacks."""
    user = get_user_by_email(email)

    password_hash = user["password_hash"] if user else _DUMMY_HASH

    if not user or not verify_password(password, password_hash):
        logger.warning("AUTH FAILED: %s", email)
        raise UnauthorizedError()

    return user

# =========================
# LOGIN LOG
# =========================
def create_login_log(
    user_id: str | None = None,
    email: str | None = None,
    action: str = "LOGIN",
    status: str = "SUCCESS",
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> dict | None:
    response = (
        supabase.table("login_logs")
        .insert({
            "user_id": user_id,
            "email": email,
            "action": action,
            "status": status,
            "ip_address": ip_address,
            "user_agent": user_agent,
        })
        .execute()
    )

    return response.data[0] if response.data else None