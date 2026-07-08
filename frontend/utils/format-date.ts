import { format, isToday, isYesterday, isValid } from "date-fns";

export function formatAccountCreatedSince(
    date: string | Date | null | undefined,
): string {
    if (!date) {
        return "";
    }

    const parsed = new Date(date);

    if (!isValid(parsed)) {
        return "";
    }

    return format(parsed, "MMMM d, yyyy");
}

export function formatLastLogin(
    date: string | Date | null | undefined,
): string | null {
    if (!date) {
        return null;
    }

    const parsed = new Date(date);

    if (!isValid(parsed)) {
        return null;
    }

    if (isToday(parsed)) {
        return `Today at ${format(parsed, "h:mm a")}`;
    }

    if (isYesterday(parsed)) {
        return `Yesterday at ${format(parsed, "h:mm a")}`;
    }

    return format(parsed, "MMM d, yyyy 'at' h:mm a");
}
