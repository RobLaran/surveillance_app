import logging

from app.types.user_types import User
from app.repositories.login_log_repository import create_login_log
from app.utils.request import get_client_ip, get_user_agent

logger = logging.getLogger(__name__)

def log_login_success(user: User) -> None:
    try:
        create_login_log(
            user_id=user["user_id"],
            email=user["email"],
            status="SUCCESS",
            ip_address=get_client_ip(),
            user_agent=get_user_agent(),
        )
    except Exception:
        logger.exception("Failed to create login log")
