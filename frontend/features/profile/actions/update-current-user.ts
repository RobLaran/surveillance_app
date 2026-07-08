import { updateCurrentUser } from "@/features/profile/services/profile-service";
import { ApiError } from "@/lib/api-client";

export async function updateCurrentUserAction(formData: FormData) {
    try {
        const message = await updateCurrentUser(formData);

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
