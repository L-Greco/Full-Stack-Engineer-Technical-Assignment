export function formatDate(value: string | null): string {
  if (value === null) {
    return "Not inspected yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
