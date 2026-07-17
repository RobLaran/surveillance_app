from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.types.user_types import CurrentUser, PublicUser, UpdateUserData, User
from app.utils.auth.validators import validate_change_password_fields, validate_user_update_fields
from app.utils.auth.sanitizers import sanitize_change_password_fields, sanitize_user_update_fields
from app.utils.auth.password import verify_password, hash_password
from app.services.storage_service import get_user_avatar
from app.serializers.user_serializer import serialize_current_user, serialize_public_user
from app.repositories.user_repository import get_user_by_email, get_user_by_id, update_password_record, update_user_record
from app.services.login_log_service import get_last_login


# =========================
# BUILD CURRENT USER
# =========================
def build_current_user(user_id: str, exp: int) -> CurrentUser:
    user = get_user_by_id(user_id)
    
    if not user:
        raise NotFoundError("User not found")
    
    login_log = get_last_login(user_id)
    avatar_url = get_user_avatar(user_id) 

    return serialize_current_user(
        user=user,
        login_log=login_log,
        avatar_url=avatar_url,
        exp=exp
    )


def _get_existing_user(user_id: str) -> User:
    user = get_user_by_id(user_id)

    if not user:
        raise NotFoundError("User not found")
    
    return user


def _ensure_email_available(existing_email: str, new_email: str) -> None:
    if existing_email == new_email:
        return

    user_with_email = get_user_by_email(new_email)

    if user_with_email:
        raise ConflictError("Email already in use")


def update_user(user_id: str, data: dict) -> PublicUser:
    """"Updates user info"""
    if not user_id:
        raise NotFoundError("No user id")
    elif not data:
        raise ValidationError(errors=["Request body is required"])
    
    data = sanitize_user_update_fields(data)

    is_valid, errors = validate_user_update_fields(data)
    if not is_valid:
        raise ValidationError(errors=errors)
    
    existing_user = _get_existing_user(user_id)

    # Should separate for email if already use   
    existing_email = existing_user["email"]
    new_email = data["email"]

    _ensure_email_available(
        existing_email=existing_email, 
        new_email=new_email
    )
        
    payload: UpdateUserData = {
        "first_name": data['first_name'],
        "last_name": data['last_name'],
        "email": data['email'],
        "phone_number": data['phone_number'],
        "location": data['location'],
    }
    
    updated_user = update_user_record(user_id=user_id, payload=payload)
    
    return serialize_public_user(updated_user)

  
def _validate_new_password(
    current_password: str,
    new_password: str,
    password_hash: str,
) -> None:

    if not verify_password(current_password, password_hash):
        raise ValidationError(
            errors={
                "Current password is incorrect"
            }
        )

    if verify_password(new_password, password_hash):
        raise ValidationError(
            errors={
                "New password cannot be the same as the current password"
            }
        )


def change_user_password(
    user_id: str,
    data: dict[str, str],
) -> None:
    """Change the authenticated user's password."""
    if not user_id:
        raise NotFoundError("No user id")
    elif not data:
        raise ValidationError(errors={ "Request body is required" })
    
    data = sanitize_change_password_fields(data)

    is_valid, errors = validate_change_password_fields(data)
    if not is_valid:
        raise ValidationError(errors=errors)
    
    user = _get_existing_user(user_id)

    _validate_new_password(
        current_password=data["current_password"], 
        new_password=data["new_password"], 
        password_hash=user["password_hash"])

    hashed_password = hash_password(data["new_password"])

    update_password_record(user_id, hashed_password)
