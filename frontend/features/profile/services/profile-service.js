import { request } from "@/lib/api-client";

export async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    return request.put("/api/avatars/upload", formData);
}

export async function removeAvatar() {
    return request.delete("/api/avatars/me/remove");
}

export async function getAvatar() {
    const { data } = await request.get("/api/avatars/me");
    return data.url;
}

export async function updateCurrentUser(data) {
    return request.put("/api/users/me/update", data);
}

export async function getUserLoginLogs() {
    return request.get("/api/login-logs/me");
}

export async function changePasswordRequest(data) {
    return request.put("/api/users/me/change-password", data);
}
