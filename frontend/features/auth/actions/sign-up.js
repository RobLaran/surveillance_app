import { signUpRequest } from "@/features/auth/services/auth-service";

export async function signUpAction(values) {
    try {
        const { response, data } = await signUpRequest({
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            password: values.password,
            confirm_password: values.confirmPassword,
        });

        return {
            success: response.ok,
            data,
        };
    } catch (err) {
        return {
            success: false,
            data: {
                message:
                    err.message ||
                    "Server is unreachable. Please try again later.",
            },
        };
    }
}
