import slugifyLib from "slugify";

/**
 * Generate a URL-safe slug from a string.
 * Example: "Software Developer at Google" → "software-developer-at-google"
 */
export function generateSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,      // removes special characters
    trim: true,
  });
}

/**
 * Generate a unique slug by appending a short timestamp suffix.
 * Use when you need guaranteed uniqueness (e.g. job titles can repeat).
 */
export function generateUniqueSlug(text: string): string {
  const base = generateSlug(text);
  const suffix = Date.now().toString(36).slice(-4); // 4-char base36 suffix
  return `${base}-${suffix}`;
}
