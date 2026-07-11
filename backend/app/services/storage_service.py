from app.core.supabase import supabase
import os

def upload_image(image, image_path, content_type="image/*"):
        bucket = supabase.storage.from_("avatars")

        # Upload with overwrite enabled (NO need for exists check)
        bucket.upload(
            image_path,
            image,
            {
                "content-type": content_type,
                "upsert": "true"
            }
        )

        return {
            "success": True,
            "message": "Image uploaded successfully",
            "data": {
                "path": image_path
            }
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