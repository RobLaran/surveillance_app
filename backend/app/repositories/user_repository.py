from app.core.supabase import supabase

from app.types.auth_types import CreateUserData
from app.types.user_types import UpdateUserData, User

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

def update_user_record(
    user_id: str,
    payload: UpdateUserData,
) -> User:

    response = (
        supabase
        .table("users")
        .update(payload)
        .eq("user_id", user_id)
        .execute()
    )

    if not response.data:
        raise RuntimeError("Failed to update user")

    return response.data[0]

def update_user_avatar(user_id, avatar_path):
    """"Updates user avatar"""
    response = (
        supabase.table("users")
        .update({"avatar_path": avatar_path})
        .eq("user_id", user_id)
        .execute()
    )

    return response

def update_password_record(user_id: str, hashed_password: str) -> None:
    response = (supabase
     .table("users")
     .update({
         "password_hash": hashed_password
     })
     .eq("user_id", user_id)
     .execute()
    )

    if not response.data:
        raise RuntimeError("Failed to update password")