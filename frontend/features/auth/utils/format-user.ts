import type { User, CurrentUser } from "@/features/auth/types/auth";

import {
    formatAccountCreatedSince,
    formatLastLogin,
} from "@/utils/format-date";

export function formatUser(data: User): CurrentUser {
    return {
        id: data.user_id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone_number,
        location: data.location,
        avatarUrl: data?.avatar_url ?? "",
        ipAddress: data.ip_address ?? "",
        userAgent: data.user_agent ?? "",
        joinDate: formatAccountCreatedSince(data.created_at),
        lastLogin: formatLastLogin(data.last_login),
    };
}
