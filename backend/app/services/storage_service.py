import logging

from cv2 import FileStorage

from app.core.supabase import supabase

from app.types.storage_types import UploadImageResult
from app.repositories.user_repository import update_user_avatar
from app.core.exceptions import StorageError

logger = logging.getLogger(__name__)

def _upload_image(file: bytes, path: str, content_type: str="image/*") -> UploadImageResult:
        bucket = supabase.storage.from_("avatars")

        bucket.upload(
            file=file,
            path=path,
            file_options={
                "content-type": content_type,
                "upsert": "true"
            }
        )

        return {
               "path": path
        }

def upload_user_avatar(user_id: str, file: FileStorage) -> UploadImageResult:
    try:
        avatar_path = f"{user_id}/avatar.png"

        result = _upload_image(
            file.read(),
            avatar_path,
            file.content_type
        )

        update_user_avatar(user_id, avatar_path)

        return result
    except Exception as e:
          logger.warning("STORAGE ERROR: %s", e)
          raise StorageError("Failed to upload avatar image")
    
def remove_image(paths: list):
    bucket = supabase.storage.from_("avatars")
    bucket.remove(paths)
    
    return {
        "success": True,
        "message": "Avatar removed successfully"
    }
   
    
def get_image(path) -> str:
        bucket = supabase.storage.from_("avatars")
        result = bucket.create_signed_url(
            path,
            60 * 60  # 1 hour
        )

        image_url = str(result["signedURL"])
        return image_url