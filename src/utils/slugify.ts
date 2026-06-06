/**
 * Converts a string into a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove non-alphanumeric characters, except spaces and hyphens
    .trim()
    .replace(/\s+/g, "-") // replace spaces with single hyphens
    .replace(/-+/g, "-"); // collapse multiple consecutive hyphens
}
