/**
 * Maps an apartment's overall score to a color hex value.
 *
 * Color scale:
 * - score >= 8 → green (#22c55e)
 * - score >= 7 → lime (#84cc16)
 * - score >= 6 → yellow (#eab308)
 * - score >= 5 → orange (#f97316)
 * - score < 5  → red (#ef4444)
 */
export function getScoreColor(score: number): string {
  if (score >= 8) return '#22c55e';
  if (score >= 7) return '#84cc16';
  if (score >= 6) return '#eab308';
  if (score >= 5) return '#f97316';
  return '#ef4444';
}
