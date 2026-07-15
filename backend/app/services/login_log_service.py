from app.repositories.login_log_repository import get_all_login_logs, get_user_last_login, get_user_login_logs
from app.types.login_log_types import LoginLog, SerializedLoginLog
from app.serializers.login_log_serializer import serialize_login_log


# get all login logs
def get_all_login_history() -> list[LoginLog]:
    login_histories = get_all_login_logs()
    return login_histories

# Log login success
# Log login failed

# get login history
def get_login_history(user_id: str) -> list[SerializedLoginLog]:
    login_history = get_user_login_logs(user_id)
    return [serialize_login_log(log) for log in login_history]

# get last login
def get_last_login(user_id: str) -> SerializedLoginLog:
    last_login = get_user_last_login(user_id)
    return serialize_login_log(last_login)
