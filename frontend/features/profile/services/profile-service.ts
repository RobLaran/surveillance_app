import { request } from "@/lib/api-client";
import { UpdateCurrentUserValues } from "@/features/profile/types/profile";
import { LoginLog, LoginLogResponse } from "@/features/profile/types/login-log";
import { formatLoginLog } from "../utils/format-login-log";

type ChangePasswordValues = {
    current_password: string;
    new_password: string;
};

export async function uploadAvatarRequest(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("avatar", file);

    const { message } = await request.put("/api/avatars/upload", formData);

    return message;
}

export async function removeAvatarRequest(): Promise<string> {
    const { message } = await request.delete("/api/avatars/me/remove");

    return message;
}

export async function updateCurrentUserRequest(
    values: UpdateCurrentUserValues,
): Promise<string> {
    const { message } = await request.put("/api/users/me/update", values);

    return message;
}

export async function getLoginHistoryRequest(): Promise<LoginLog[]> {
    const { data } =
        await request.get<LoginLogResponse[]>("/api/login-logs/me");

    return data.map((log: LoginLogResponse) => formatLoginLog(log));
}

export async function changePasswordRequest(
    data: ChangePasswordValues,
): Promise<string> {
    const { message } = await request.put(
        "/api/users/me/change-password",
        data,
    );

    return message;
}
