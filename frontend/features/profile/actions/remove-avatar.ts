import { removeAvatar } from "@/features/profile/services/profile-service";
import { ApiError } from "@/lib/api-client";
import { ActionResult } from "@/types/action-result";

export async function removeAvatarAction(): Promise<ActionResult> {
    try {
        const message = await removeAvatar();

        return {
            success: true,
            message: message,
        };
    } catch (error: any) {
        const err = error as ApiError;

        return {
            success: false,
            message: err.message,
            errors: err.errors,
        };
    }
}
