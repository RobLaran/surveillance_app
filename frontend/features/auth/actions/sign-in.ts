import { SignInValues } from "@/features/auth/types/auth";
import { signInRequest } from "@/features/auth/services/auth-service";
import { ActionResult } from "@/types/action-result";
import type { ApiError } from "@/lib/api-client";

export async function signInAction(
    values: SignInValues,
): Promise<ActionResult> {
    try {
        const message = await signInRequest(values);

        return {
            success: true,
            message: message,
        };
    } catch (error) {
        const err = error as ApiError;

        return {
            success: false,
            message: err.message,
            errors: err.errors,
        };
    }
}
