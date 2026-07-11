from app.repositories.login_log_repository import get_all_login_logs, get_user_last_login, get_user_login_logs
from app.types.login_log_types import LoginLog


# get all login logs
def get_all_login_history() -> list[LoginLog]:
    login_histories = get_all_login_logs()
    return login_histories

# Log login success
# Log login failed

# get login history
def get_login_history(user_id: str) -> list[LoginLog]:
    login_history = get_user_login_logs(user_id)
    return login_history

# get last login
def get_last_login(user_id: str) -> LoginLog:
    last_login = get_user_last_login(user_id)
    return last_login
