import { request } from "@/lib/api-client";

type ChangePasswordValues = {
    current_password: string;
    new_password: string;
};

export async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    const { message } = await request.put("/api/avatars/upload", formData);

    return message;
}

export async function removeAvatar(): Promise<string> {
    const { message } = await request.delete("/api/avatars/me/remove");

    return message;
}

export async function getAvatar(): Promise<string> {
    const { data } = await request.get<{ path: string; url: string }>(
        "/api/avatars/me",
    );
    return data.url;
}

export async function updateCurrentUser(values: FormData) {
    const { message } = await request.put("/api/users/me/update", values);

    return message;
}

export async function getUserLoginLogs() {
    return request.get("/api/login-logs/me");
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
