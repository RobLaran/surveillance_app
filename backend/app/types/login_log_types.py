from typing import TypedDict

class LoginLog(TypedDict):
    login_log_id: str
    user_id: str
    email: str
    ip_address: str
    user_agent: str
    action: str
    status: str
    created_at: str
