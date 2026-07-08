from .supabase_client import supabase
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
   
    
def get_image(path):
    try:
        bucket = supabase.storage.from_("avatars")

        result = bucket.create_signed_url(
            path,
            60 * 60  # 1 hour
        )

        if hasattr(result, "error") and result.error:
            return {
                "success": False,
                "message": str(result.error)
            }

        return {
            "success": True,
            "message": "Image received",
            "data": {
                "path": path,
                "url": result["signedURL"]
            }
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

def is_image_exists(path):
    try:
        response = supabase.storage.from_('avatars').exists(path)
        public_url = supabase.storage.from_("avatars").create_signed_url(path,(60*60))

        return {
            "success": True,
            "response": response,
            "url": public_url
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }