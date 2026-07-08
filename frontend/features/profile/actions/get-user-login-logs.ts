import { getUserLoginLogs } from "@/features/profile/services/profile-service";

export async function getUserLoginLogsAction() {
    try {
        const { data } = await getUserLoginLogs();

        return {
            success: true,
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            errors: error.errors,
        };
    }
}
