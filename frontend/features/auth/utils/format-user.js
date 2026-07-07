import {
    formatAccountCreatedSince,
    formatLastLogin,
} from "@/utils/format-date";

export function formatUser(data) {
    return {
        id: data?.user_id,
        firstName: data?.first_name,
        lastName: data?.last_name,
        email: data?.email,
        phone: data?.phone_number,
        location: data?.location,
        avatarUrl: data?.avatar_url,
        ipAddress: data?.login_log?.ip_address,
        userAgent: data?.login_log?.user_agent,
        joinDate: formatAccountCreatedSince(data?.created_at),
        lastLogin: formatLastLogin(data?.login_log?.created_at),
    };
}
