import { signUpRequest } from "@/features/auth/services/auth-service";
import type { ApiError } from "@/lib/api-client";
import type { AuthResult, SignUpValues } from "@/features/auth/types/auth";

export async function signUpAction(values: SignUpValues): Promise<AuthResult> {
    try {
        const { data } = await signUpRequest(values);

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
