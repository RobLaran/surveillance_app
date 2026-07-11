import logging

from cv2 import FileStorage

from app.core.supabase import supabase

from app.types.storage_types import RemoveImageResult, UploadImageResult
from app.repositories.user_repository import get_user_by_id, update_user_avatar
from app.core.exceptions import NotFoundError, StorageError, ValidationError

logger = logging.getLogger(__name__)

def _upload_image(file: bytes, path: str, content_type: str="image/*") -> None:
    try:
        bucket = supabase.storage.from_("avatars")
        bucket.upload(
            file=file,
            path=path,
            file_options={
                "content-type": content_type,
                "upsert": "true"
            }
        )
    except Exception as e:
        logger.exception("STORAGE ERROR: %s", e)
        raise StorageError("Failed to upload image") from e


def _remove_images(paths: list[str]) -> None:
    try:
        bucket = supabase.storage.from_("avatars")
        bucket.remove(paths)
    except Exception as e:
        logger.exception("STORAGE ERROR: %s", e)
        raise StorageError("Failed to remove image") from e


def _get_image(path: str) -> str:
    try:
        bucket = supabase.storage.from_("avatars")
        result = bucket.create_signed_url(
            path,
            60 * 60  # 1 hour
        )

        signed_url = str(result.get("signedURL"))

        if not signed_url:
            raise StorageError("Failed to generate image URL")

        return signed_url
    except Exception as e:
        logger.exception("Failed to generate signed URL for '%s'", path)
        raise StorageError("Failed to retrieve image") from e


def upload_user_avatar(user_id: str, file: FileStorage) -> UploadImageResult:
    avatar_path = f"{user_id}/avatar.png"

    _upload_image(
        file.read(),
        avatar_path,
        file.content_type
    )
    update_user_avatar(user_id, avatar_path)

    return {
        "path": avatar_path
    }
    

def remove_user_avatar(user_id: str) -> RemoveImageResult:
    user = get_user_by_id(str(user_id))

    if not user:
        raise NotFoundError("User not found")

    avatar_path = str(user["avatar_path"])

    if not avatar_path:
        raise ValidationError("No avatar path")

    _remove_images([avatar_path])
    update_user_avatar(user_id, None)

    return {
        "path": avatar_path
    }

def get_user_avatar(user_id: str) -> str:
    user = get_user_by_id(user_id)

    if not user:
        raise NotFoundError("User not found")
    
    avatar_path = str(user["avatar_path"])

    if not avatar_path:
        raise ValidationError("No avatar path")

    return _get_image(avatar_path)