import { formatDate } from "@/utils/format-date";

export function formatUser(data) {
    return {
        id: data?.user_id,
        firstName: data?.first_name,
        lastName: data?.last_name,
        email: data?.email,
        phone: data?.phone_number,
        location: data?.location,
        avatarUrl: data?.avatar_url,
        joinDate: formatDate(data?.created_at),
        lastLogin: formatDate(data?.login_log?.created_at, "PPPppp"),
    };
}
