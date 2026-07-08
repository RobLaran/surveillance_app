import re
from .helpers import is_blank, has_valid_length

NAME_PATTERN = r"^[A-Za-z\s'-]+$"
EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"

NAME_MIN, NAME_MAX = 2, 50
PASSWORD_MIN, PASSWORD_MAX = 4, 128

PHONE_PATTERN = r"^[0-9+\-\s()]{7,20}$"
LOCATION_MIN = 2
LOCATION_MAX = 100

# =========================
# UPDATE USER
# =========================
def validate_user_update_fields(data: dict):
    errors = []

    for result in [
        validate_name(data.get("first_name"), "First name"),
        validate_name(data.get("last_name"), "Last name"),
        validate_email(data.get("email")),
        validate_phone_number(data.get("phone_number")),
        validate_location(data.get("location")),
    ]:
        valid, error = result
        if not valid:
            errors.append(error)

    return (False, errors) if errors else (True, None)

# =========================
# SIGN UP
# =========================
def validate_sign_up_fields(data: dict):
    errors = []

    for result in [
        validate_name(data.get("first_name"), "First name"),
        validate_name(data.get("last_name"), "Last name"),
        validate_email(data.get("email")),
        validate_password(data.get("password")),
        validate_confirm_password(data.get("password"), data.get("confirm_password")),
    ]:
        valid, error = result
        if not valid:
            errors.append(error)

    return (False, errors) if errors else (True, None)


# =========================
# SIGN IN
# =========================
def validate_sign_in_fields(data: dict):
    errors = []

    for result in [
        validate_email(data.get("email")),
        validate_presence(data.get("password"), "Password"),  # presence only — no length rules
    ]:
        valid, error = result
        if not valid:
            errors.append(error)

    return (False, errors) if errors else (True, None)


# =========================
# HELPERS
# =========================
def validate_presence(value: str, field_name: str):
    if is_blank(value):
        return False, f"{field_name} is required"
    return True, None

def validate_name(name: str, field_name: str):
    if is_blank(name):
        return False, f"{field_name} is required"

    if not has_valid_length(name, NAME_MIN, NAME_MAX):
        return False, f"{field_name} must be between {NAME_MIN} and {NAME_MAX} characters"

    if not re.match(NAME_PATTERN, name):
        return False, f"{field_name} may only contain letters, spaces, hyphens, and apostrophes"

    return True, None


def validate_email(email: str):
    if is_blank(email):
        return False, "Email is required"

    if not re.match(EMAIL_PATTERN, email):
        return False, "Invalid email format"

    return True, None


def validate_password(password: str):
    if is_blank(password):
        return False, "Password is required"

    if not has_valid_length(password, PASSWORD_MIN, PASSWORD_MAX):
        return False, f"Password must be between {PASSWORD_MIN} and {PASSWORD_MAX} characters"

    return True, None


def validate_confirm_password(password: str, confirm_password: str):
    if is_blank(confirm_password):
        return False, "Confirm password is required"

    if password != confirm_password:
        return False, "Passwords do not match"

    return True, None

def validate_phone_number(phone_number: str):
    if phone_number and not re.match(PHONE_PATTERN, phone_number):
        return False, "Invalid phone number format"

    return True, None

def validate_location(location: str):
    if location and not has_valid_length(
        location,
        LOCATION_MIN,
        LOCATION_MAX
    ):
        return (
            False,
            f"Location must be between {LOCATION_MIN} and {LOCATION_MAX} characters"
        )

    return True, None