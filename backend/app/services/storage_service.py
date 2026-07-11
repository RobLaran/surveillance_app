from app.core.supabase import supabase

from app.types.storage_types import UploadImageResult

def upload_image(file: bytes, path: str, content_type: str="image/*") -> UploadImageResult:
        bucket = supabase.storage.from_("avatars")

        bucket.upload(
            file=file,
            path=path,
            file_options={
                "content-type": content_type,
                "upsert": True
            }
        )

        return {
               "path": path
        }
    
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