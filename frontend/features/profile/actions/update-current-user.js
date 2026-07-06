import { updateCurrentUser } from "@/features/profile/services/profile-service";

export async function updateCurrentUserAction(formData) {
    try {
        const result = await updateCurrentUser(formData);

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
            errors: error.errors || [],
        };
    }
}
