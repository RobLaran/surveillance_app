import { formatDateMDY } from "@/utils/format-date";

export function formatUser(data) {
    return {
        id: data?.user_id,
        firstName: data?.first_name,
        lastName: data?.last_name,
        email: data?.email,
        phone: data?.phone_number,
        location: data?.location,
        joinDate: formatDateMDY(data?.created_at),
        lastLogin: "Today at 2:45 PM",
    };
}
