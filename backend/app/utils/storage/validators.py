# utils/storage/validators.py

from PIL import Image
from werkzeug.datastructures import FileStorage

from app.core.exceptions import ValidationError

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}
MAX_AVATAR_SIZE = 2 * 1024 * 1024  # 2 MB


def validate_avatar_image(file: FileStorage | None) -> None:
    if not file:
        raise ValidationError(errors=["No file uploaded"])
    
    validate_file_type(
        allowed_types=ALLOWED_IMAGE_TYPES,
        file=file,
        err_msg="Only JPG, JPEG, PNG, or WebP image are allowed."
    )
    validate_file_size(
        file=file,
        max_size=MAX_AVATAR_SIZE,
    )
    validate_image(file)


def validate_file_type(
        allowed_types: set[str], 
        file: FileStorage, 
        err_msg: str = "Invalid file type"
) -> None:
    if file.mimetype not in allowed_types:
        raise ValidationError(errors=[{
            err_msg
        }])    
    

def validate_file_size(
    file: FileStorage,
    max_size: int,
    message: str | None = None,
) -> None:
    file.stream.seek(0, 2)  # Move to end
    size = file.tell()
    file.stream.seek(0)     # Reset pointer

    if size > max_size:
        raise ValidationError({
             message or f"File must not exceed {max_size // (1024 * 1024)} MB."
        })
    

def validate_image(file: FileStorage) -> None:
    try:
        Image.open(file.stream).verify()
        file.stream.seek(0)
    except Exception:
        raise ValidationError({
            "Invalid image file."
        })