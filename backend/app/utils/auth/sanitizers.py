def sanitize_sign_up_fields(data: dict) -> dict:
    """"Clean data inputs"""
    return {
        "first_name": clean_str(data.get('firstName')),
        "last_name": clean_str(data.get('lastName')),
        "email": clean_str(data.get('email')).lower(),
        "password": data.get('password') or "",
        "confirm_password": data.get('confirmPassword') or ""
    }

def sanitize_sign_in_fields(data: dict) -> dict:
    """"Clean data inputs"""
    return {
        "email": clean_str(data.get('email')).lower(),
        "password": data.get('password') or ""
    }

def sanitize_user_update_fields(data: dict) -> dict:
    """"Clean data inputs"""
    return {
        "first_name": clean_str(data.get('first_name')),
        "last_name": clean_str(data.get('last_name')),
        "email": clean_str(data.get('email')).lower(),
        "phone_number": clean_str(data.get('phone_number')),
        "location": clean_str(data.get('location'))
    }

def clean_str(value: str) -> str:
    """
    Normalize text input by:
    - Converting None to an empty string
    - Trimming whitespace
    - Collapsing multiple spaces into one
    """
    return " ".join((value or "").split())