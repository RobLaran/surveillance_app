import { signInRequest } from "@/features/auth/services/auth-service";

export async function signInAction(values) {
    try {
        const { response, data } = await signInRequest(values);

        // Normalize backend response
        if (!response.ok) {
            return {
                success: false,
                error: {
                    type: "HTTP_ERROR",
                    message: data?.message || "Sign in failed",
                    status: response.status,
                },
            };
        }

        // Backend-level failure (even if HTTP 200)
        if (data?.success === false) {
            return {
                success: false,
                error: {
                    type: "AUTH_ERROR",
                    message: data?.message || "Invalid credentials",
                },
            };
        }

        return {
            success: true,
            data,
        };
    } catch (err) {
        return {
            success: false,
            error: {
                type: "NETWORK_ERROR",
                message:
                    err?.message ||
                    "Server is unreachable. Please try again later.",
            },
        };
    }
}
