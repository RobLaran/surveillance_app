import { removeAvatar } from "@/features/profile/services/profile-service";

export async function removeAvatarAction() {
    try {
        const result = await removeAvatar();

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
