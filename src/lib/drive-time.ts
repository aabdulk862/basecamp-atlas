/**
 * Drive time formatting utilities.
 *
 * Formats integer minutes into human-readable drive time strings
 * and parses them back for round-trip verification.
 */

/**
 * Formats a number of minutes into a drive time string.
 *
 * - For values >= 60: "Xh Ym" (e.g., 150 → "2h 30m")
 * - For values < 60: "Ym" (e.g., 45 → "45m")
 *
 * @param minutes - Integer number of minutes (must be >= 0)
 * @returns Formatted drive time string
 */
export function formatDriveTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }

  return `${mins}m`;
}

/**
 * Parses a formatted drive time string back into minutes.
 *
 * Accepts formats:
 * - "Xh Ym" (e.g., "2h 30m" → 150)
 * - "Ym" (e.g., "45m" → 45)
 *
 * @param formatted - A drive time string produced by formatDriveTime
 * @returns The number of minutes represented by the string
 * @throws Error if the string does not match expected format
 */
export function parseDriveTime(formatted: string): number {
  // Match "Xh Ym" format
  const hoursMinutesMatch = formatted.match(/^(\d+)h\s+(\d+)m$/);
  if (hoursMinutesMatch) {
    const hours = parseInt(hoursMinutesMatch[1], 10);
    const mins = parseInt(hoursMinutesMatch[2], 10);
    return hours * 60 + mins;
  }

  // Match "Ym" format
  const minutesOnlyMatch = formatted.match(/^(\d+)m$/);
  if (minutesOnlyMatch) {
    return parseInt(minutesOnlyMatch[1], 10);
  }

  throw new Error(`Invalid drive time format: "${formatted}"`);
}
