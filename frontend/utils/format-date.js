import { format, parseISO } from "date-fns";

export function formatDate(date, formatStr = "PPP") {
    if (!date) return;

    const parsedDate = parseISO(date);
    return format(parsedDate, formatStr);
}
