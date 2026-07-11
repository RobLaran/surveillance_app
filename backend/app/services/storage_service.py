import logging

from cv2 import FileStorage

from app.core.supabase import supabase

from app.types.storage_types import RemoveImageResult, UploadImageResult
from app.repositories.user_repository import update_user_avatar
from app.core.exceptions import StorageError

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
    

def remove_user_avatar(user_id: str, avatar_path: str) -> RemoveImageResult:
    _remove_images([avatar_path])
    update_user_avatar(user_id, None)

    return {
        "path": avatar_path
    }

    
def get_image(path) -> str:
        bucket = supabase.storage.from_("avatars")
        result = bucket.create_signed_url(
            path,
            60 * 60  # 1 hour
        )

        image_url = str(result["signedURL"])
        return image_url