export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-CA").format(n);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatList(items: string[]): string {
  return items.join(", ");
}

export function formatFee(amount: number, frequency?: string): string {
  const formatted = formatPrice(amount);
  return frequency ? `${formatted} / ${frequency.toLowerCase()}` : formatted;
}
