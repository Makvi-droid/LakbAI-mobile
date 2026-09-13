export function formatDateRange(start: string, end: string): string {
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();

    const startLabel = s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endLabel = sameMonth
        ? e.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })
        : e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return `${startLabel} – ${endLabel}`;
}