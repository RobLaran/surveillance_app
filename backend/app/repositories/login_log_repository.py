from app.core.supabase import supabase

from app.core.exceptions import InternalServerError
from app.types.login_log_types import LoginLog

def create_login_log(
    user_id: str | None = None,
    email: str | None = None,
    action: str = "LOGIN",
    status: str = "SUCCESS",
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> LoginLog:
    """Generates user login log into database"""
    response = (
        supabase
        .table("login_logs")
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

    if not response.data:
        raise InternalServerError("Failed to create login log")

    return response.data[0] 


def get_all_login_logs() -> list[LoginLog]:
    """Fetch all login logs from database"""
    response = (
        supabase
        .table("login_logs")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    return response.data or []


def get_user_login_logs(user_id: str) -> list[LoginLog]:
    """Fetch user login logs from database"""
    response = (
        supabase
        .table("login_logs")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data or []


def get_user_last_login(user_id: str) -> LoginLog | None:
    """"Fetches user last login"""
    response = (
        supabase
        .table("login_logs")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    return response.data[0] if response.data else None