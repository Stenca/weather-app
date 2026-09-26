export function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("en", { weekday: "long" }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
