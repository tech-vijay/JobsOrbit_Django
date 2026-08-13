import { format, formatDistanceToNow, isPast, differenceInDays } from "date-fns";

/**
 * Format a date as "Jan 15, 2025"
 */
export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

/**
 * Format a date as "2 days ago" or "in 3 days"
 */
export function formatRelativeDate(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Returns true if the deadline has passed
 */
export function isExpired(deadline: Date | string): boolean {
  return isPast(new Date(deadline));
}

/**
 * Returns days remaining until deadline (negative = past)
 */
export function daysUntilDeadline(deadline: Date | string): number {
  return differenceInDays(new Date(deadline), new Date());
}

/**
 * Returns a deadline urgency label
 */
export function deadlineLabel(deadline: Date | string): {
  label: string;
  urgent: boolean;
  expired: boolean;
} {
  const days = daysUntilDeadline(deadline);
  if (days < 0) return { label: "Expired", urgent: false, expired: true };
  if (days === 0) return { label: "Last day!", urgent: true, expired: false };
  if (days <= 3) return { label: `${days}d left`, urgent: true, expired: false };
  return { label: `${days} days left`, urgent: false, expired: false };
}
