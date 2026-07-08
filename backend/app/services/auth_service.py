import logging
from .user_service import get_user_by_email, create_user
from .login_log_service import create_login_log
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
        "message": "Account created successfully",
        "data": {
            "user_id": user.get("user_id")
        },
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

    login_log = None
    try :
        login_log = create_login_log(
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
        "data": {
            "login_log": login_log
        }
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