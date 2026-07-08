import { request } from "@/lib/api-client";
import { getAvatar } from "@/features/profile/services/profile-service";
import { CurrentUserResponse } from "@/features/auth/types/responses";
import type {
    CurrentUser,
    SignInValues,
    SignUpValues,
} from "@/features/auth/types/auth";

export async function fetchCurrentUser(): Promise<CurrentUser> {
    const { data } = await request.get<CurrentUser>("/api/auth/me");

    if (data.avatar) {
        data.avatar_url = await getAvatar();
    }   

    return data;
}

export async function signInRequest(
    credentials: SignInValues,
): Promise<string> {
    const { message } = await request.post("/api/auth/sign-in", credentials, {
        auth: false,
    });

    return message;
}

export async function signUpRequest(payload: SignUpValues) {
    return request.post("/api/auth/sign-up", payload, {
        auth: false,
    });
}

export async function logoutRequest() {
    return request.post("/api/auth/sign-out");
}
