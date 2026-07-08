def is_blank(value: str) -> bool:
    """"Checks for value if it is empty or not"""
    return True if not value else False

def has_valid_length(value: str, min_length: int, max_length: int) -> bool:
    """Check whether a value is within the allowed length range."""
    return min_length <= len(value) <= max_length