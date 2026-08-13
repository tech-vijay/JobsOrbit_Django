import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names safely, resolving conflicts.
 * Use this for all conditional className logic.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
