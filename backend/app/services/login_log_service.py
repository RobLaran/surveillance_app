from app.repositories.login_log_repository import get_all_login_logs
from app.types.login_log_types import LoginLog


# get all login logs
def get_all_login_history() -> list[LoginLog]:
    login_logs = get_all_login_logs()
    return login_logs

# Log login success
# Log login failed
# get login history
# get last login
