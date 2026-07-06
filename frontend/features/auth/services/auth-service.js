import { request } from "@/lib/api-client";
import { getAvatar } from "@/features/profile/services/profile-service";

export async function fetchCurrentUser() {
    console.log("FETCH CURRENT USER");
    const { data } = await request.get("/api/auth/me");

    if (data.user && data.user.avatar) {
        data.user.avatar_url = await getAvatar();
    }

    return data.user;
}

export async function signInRequest(credentials) {
    return request.post("/api/auth/sign-in", credentials, { auth: false });
}

export async function signUpRequest(payload) {
    return request.post("/api/auth/sign-up", payload, { auth: false });
}

export async function logoutRequest() {
    return request.post("/api/auth/sign-out");
}
