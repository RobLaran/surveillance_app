import { updateCurrentUser } from "@/features/profile/services/profile-service";
import { ApiError } from "@/lib/api-client";
import { UpdateCurrentUserValues } from "@/features/profile/types/profile";

export async function updateCurrentUserAction(values: UpdateCurrentUserValues) {
    try {
        const message = await updateCurrentUser(values);

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
