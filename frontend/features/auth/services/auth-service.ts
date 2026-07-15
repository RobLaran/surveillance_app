import { request } from "@/lib/api-client";
import { SignInValues, SignUpValues } from "@/features/auth/types/auth";
import { UserResponse } from "@/features/auth/types/user";

export async function fetchCurrentUserRequest(): Promise<UserResponse> {
    const { data } = await request.get<UserResponse>("/api/auth/me");

    return data;
}

export async function signInRequest(payload: SignInValues): Promise<string> {
    const { message } = await request.post("/api/auth/sign-in", payload, {
        auth: false,
    });

    return message;
}

export async function signUpRequest(payload: SignUpValues): Promise<string> {
    const { message } = await request.post("/api/auth/sign-up", payload, {
        auth: false,
    });

    return message;
}

export async function logoutRequest(): Promise<void> {
    await request.post("/api/auth/sign-out");
}
