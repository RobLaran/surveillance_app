import { format, parseISO } from "date-fns";

export function formatDateMDY(date) {
    if (!date) return;

    const parsedDate = parseISO(date);
    return format(parsedDate, "MMMM d, yyyy");
}
