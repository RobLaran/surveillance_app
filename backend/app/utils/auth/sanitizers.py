def sanitize_sign_up_fields(data: dict) -> dict:
    """"Clean data inputs"""
    return {
        "first_name": clean_str(data.get('firstName')),
        "last_name": clean_str(data.get('lastName')),
        "email": clean_str(data.get('email')).lower(),
        "password": clean_password(data.get('password')),
        "confirm_password": clean_password(data.get('confirmPassword'))
    }

def sanitize_sign_in_fields(data: dict) -> dict:
    """"Clean data inputs"""
    return {
        "email": clean_str(data.get('email')).lower(),
        "password": clean_password(data.get('password'))
    }

def sanitize_user_update_fields(data: dict) -> dict:
    """"Clean data inputs"""
    return {
        "first_name": clean_str(data.get('firstName')),
        "last_name": clean_str(data.get('lastName')),
        "email": clean_str(data.get('email')).lower(),
        "phone_number": clean_str(data.get('phone')),
        "location": clean_str(data.get('location'))
    }

def sanitize_change_password_fields(data: dict) -> dict:
    """Clean password change inputs."""
    return {
        "current_password": clean_password(data.get("current_password")),
        "new_password": clean_password(data.get("new_password")),
        "confirm_password": clean_password(data.get("confirm_password")),
    }


def clean_str(value: str) -> str:
    """
    Normalize text input by:
    - Converting None to an empty string
    - Trimming whitespace
    - Collapsing multiple spaces into one
    """
    return " ".join((value or "").split())

def clean_password(value: str | None) -> str:
    """Return password as-is, only replacing None with an empty string."""
    return value or ""