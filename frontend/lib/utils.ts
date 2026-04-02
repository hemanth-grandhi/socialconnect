/**
 * Utility functions for the frontend
 */

/**
 * Generates initials from a name or username for avatar display
 * @param name - The name or username
 * @returns The initials (first letter or first two letters)
 */
export function getInitials(name: string): string {
  if (!name) return "?";
  return name.trim().slice(0, 2).toUpperCase();
}