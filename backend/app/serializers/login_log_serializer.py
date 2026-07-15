from user_agents import parse

from app.types.login_log_types import LoginLog, SerializedLoginLog
from app.core.exceptions import ValidationError

def serialize_login_log(log: LoginLog) -> SerializedLoginLog:
    if not log:
        raise ValidationError(errors=["No login log found"])
    elif not log["user_agent"]:
        raise ValidationError(errors=["No user agent found"])

    ua = parse(log["user_agent"])

    return {
        "login_log_id": log["login_log_id"],
        "user_id": log["user_id"],
        "email": log["email"],
        "device": "Desktop" if ua.is_pc else ua.device.family,
        "browser": ua.browser.family,
        "os": ua.os.family,
        "ip_address": log["ip_address"],
        "action": log["action"],
        "status": log["status"],
        "created_at": log["created_at"],
    }