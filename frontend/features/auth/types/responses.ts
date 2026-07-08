import { CurrentUser } from "@/features/auth/types/auth";
import { ApiResponseBody } from "@/lib/api-client";

type LoginLogResponse = {
    ip_address: string | null;
    user_agent: string | null;
    created_at: string | null;
};

export type UserResponse = {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    location: string;
    avatar_url: string | null;
    created_at: string;
    login_log: LoginLogResponse | null;
};

export interface CurrentUserResponse extends ApiResponseBody {
    user: CurrentUser;
}
