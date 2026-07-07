import { changePasswordRequest } from "@/features/profile/services/profile-service";

type ChangePasswordValues = {
    current_password: string;
    new_password: string;
};

type ChangePasswordSuccess = {
    success: true;
    message: string;
};

type ChangePasswordFailure = {
    success: false;
    message: string;
    errors?: Record<string, string> | string[];
    status?: number;
};

export type ChangePasswordResult =
    | ChangePasswordSuccess
    | ChangePasswordFailure;

export async function changePasswordAction(
    values: ChangePasswordValues,
): Promise<ChangePasswordResult> {
    try {
        const { data } = await changePasswordRequest(values);

        return {
            success: true,
            message: data.message,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            errors: error.errors,
            status: error.status,
        };
    }
}
