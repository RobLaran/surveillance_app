from app.types.user_types import User, CurrentUser, PublicUser

def serialize_current_user(
    user: dict,
    login_log: dict | None = None,
    avatar_url: str | None = None,
    exp: int | None = None,
) -> CurrentUser:
    return {
        "user_id": user["user_id"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "phone_number": user.get("phone_number"),
        "location": user.get("location"),
        "avatar_path": user.get("avatar_path"),
        "avatar_url": avatar_url,
        "last_login": login_log.get("created_at") if login_log else None,
        "ip_address": login_log.get("ip_address") if login_log else None,
        "user_agent": login_log.get("user_agent") if login_log else None,
        "created_at": user.get("created_at"),
        "exp": exp,
    }

def serialize_public_user(user: User) -> PublicUser:
    return {
        "user_id": user["user_id"],
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
    }