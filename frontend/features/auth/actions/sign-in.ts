import { AuthResult, SignInValues } from "@/features/auth/types/auth";
import { signInRequest } from "@/features/auth/services/auth-service";
import type { ApiError } from "@/lib/api-client";

export async function signInAction(values: SignInValues): Promise<AuthResult> {
    try {
        const { data } = await signInRequest(values);

        return {
            success: true,
            message: data.message ?? "Signed in successfully",
        };
    } catch (error) {
        const err = error as ApiError;

        return {
            success: false,
            message: err.message,
            errors: err.errors,
            status: err.status,
        };
    }
}
