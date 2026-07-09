

from .supabase_client import supabase

from typing import Any

from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.types.user_types import CreateUserData, CurrentUser, User
from app.utils.auth.validators import validate_user_update_fields
from app.utils.auth.sanitizers import sanitize_user_update_fields
from app.utils.auth.password import verify_password, hash_password
from app.services.login_log_service import get_last_login
from app.services.storage_service import get_image
from app.serializers.user_serializer import serialize_current_user

def get_all_users() -> list[User]:
    """Fetch all users from the database."""
    response = (
        supabase
        .table("users")
        .select("*")
        .execute()
    )

    return response.data or []

   
def get_user_by_id(user_id: str) -> User | None:
    """"Fetches user info by id"""
    response = (
        supabase
        .table("users")
        .select("*")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    return response.data[0] if response.data else None


def get_user_by_email(email: str) -> User | None:
    """"Fetches user info by email"""
    response = (
        supabase
        .table("users")
        .select("*")
        .eq("email", email)
        .limit(1)
        .execute()
    )

    return response.data[0] if response.data else None
  
    
def email_exists(email: str) -> bool:
    """"Checks db if email already used"""
    result = (
        supabase.table("users")
        .select("user_id")
        .eq("email", email)
        .limit(1)
        .execute()
    )

    return len(result.data) > 0
   

# =========================
# BUILD CURRENT USER
# =========================
def build_current_user(user_id: str, exp: int) -> CurrentUser:
    user = get_user_by_id(user_id=user_id)
    
    if not user:
        raise NotFoundError("User not found")
    
    login_log = get_last_login(user_id=user_id)

    avatar_path = user.get("avatar_path")
    avatar_url = get_image(avatar_path) if avatar_path else None

    return serialize_current_user(
        user=user,
        login_log=login_log,
        avatar_url=avatar_url,
        exp=exp
    )

def create_user(payload: CreateUserData) -> User | None:
    """"Creates user/Insert user into database"""
    response = (supabase
        .table("users")
        .insert({
            "first_name": payload['first_name'],
            "last_name": payload['last_name'],
            "email": payload['email'],
            "password_hash": payload['password_hash'],
        })
        .execute()
    )
    
    return response.data[0] if response.data else None

def update_user(user_id: str, data: dict):
    """"Updates user info"""
    if not user_id:
        raise NotFoundError("No user id")
    elif not data:
        raise ValidationError(errors=["Request body is required"])
    
    data = sanitize_user_update_fields(data)

    is_valid, errors = validate_user_update_fields(data)
    if not is_valid:
        raise ValidationError(errors=errors)
    
    user = get_user_by_id(user_id)
    current_email = user.get("email")
    new_email = data.get("email")

    if current_email != new_email:
        existing_user = get_user_by_email(new_email)

        if existing_user:
            raise ConflictError("Email already in use")
    
    (supabase
        .table("users")
        .update({
            "first_name": data['first_name'],
            "last_name": data['last_name'],
            "email": data['email'],
            "phone_number": data['phone_number'],
            "location": data['location'],
        })
        .eq("user_id", user_id)
        .execute()
    )
    
    return {
        "success": True,
        "message": "User updated successfully",
        "data": {
            "user_id": user_id
        }
    }

  
def update_user_avatar(user_id, avatar_path):
    """"Updates user avatar"""
    response = (
        supabase.table("users")
        .update({"avatar_path": avatar_path})
        .eq("user_id", user_id)
        .execute()
    )

    return response


def change_user_password(
    user_id: str,
    data: dict[str, str],
) -> dict[str, Any]:
    """Change the authenticated user's password."""
    if not user_id:
        raise NotFoundError("No user id")
    elif not data:
        raise ValidationError(errors={ "data": "Request body is required" })
    
    # Fetch user
    user = get_user_by_id(user_id=user_id)

    # Verify current password
    if not verify_password(
        data["current_password"],
        user["password_hash"]
    ):
       raise ValidationError(errors={ "current_password": "Current password is incorrect" })

    # Check new and old password
    if verify_password(
        data["new_password"],
        user["password_hash"]
    ):
        raise ValidationError(errors={ "new_password": "New password cannot be the same as the current password" })
    
    # Hash new password
    hashed_password = hash_password(data["new_password"])

    # Update database
    (supabase
     .table("users")
     .update({
         "password_hash": hashed_password
     })
     .eq("user_id", user_id)
     .execute()
    )

    return {
        "success": True,
        "message": "Password updated successfully"
    }
