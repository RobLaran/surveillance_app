import { format, isToday, isYesterday } from "date-fns";

export function formatAccountCreatedSince(date: string | Date) {
    return format(new Date(date), "MMMM d, yyyy");
}

export function formatLastLogin(date: string | Date) {
    const parsed = new Date(date);

    if (isToday(parsed)) {
        return `Today at ${format(parsed, "h:mm a")}`;
    }

    if (isYesterday(parsed)) {
        return `Yesterday at ${format(parsed, "h:mm a")}`;
    }

    return format(parsed, "MMM d, yyyy 'at' h:mm a");
}
