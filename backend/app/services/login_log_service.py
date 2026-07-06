from .supabase_client import supabase

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