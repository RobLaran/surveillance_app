import { uploadAvatar } from "@/features/profile/services/profile-service";

export async function uploadAvatarAction(file) {
    try {
        const result = await uploadAvatar(file);

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
}
