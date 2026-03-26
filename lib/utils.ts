import { clsx, type ClassValue } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, pattern = "MMM d, yyyy") {
  const value = typeof date === "string" ? parseISO(date) : date;
  return format(value, pattern);
}

export function startOfDayUtc(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export function endOfDayUtc(date: string) {
  return new Date(`${date}T23:59:59.999Z`);
}

export function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}
