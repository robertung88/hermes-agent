/**
 * One profile's rollup, rendered as words. Shared by every surface that paints
 * a profile-level status — the rail square's accessible name, the condensed
 * profile dropdown and the grouped sidebar's profile header — so the same
 * state reads identically wherever it is drawn.
 */
import type { Translations } from '@/i18n'
import type { ProfileDotSummary } from '@/store/profile-dot-state'

/** The a11y/tooltip text for one profile summary — every non-zero count, most
 *  urgent first ("1 session needs your answer, 2 unread sessions"). The counts
 *  ride the accessible name so the state is never color-only. */
export function profileStatusLabel(p: Translations['profiles'], summary: ProfileDotSummary): string {
  const parts: string[] = []

  if (summary.needsInputCount > 0) {
    parts.push(p.status.needsInput(summary.needsInputCount))
  }

  if (summary.workingCount > 0) {
    parts.push(p.status.working(summary.workingCount))
  }

  if (summary.unreadCount > 0) {
    parts.push(p.status.unread(summary.unreadCount))
  }

  return parts.join(', ')
}

/** The count behind the summary's loudest state — what a header badge prints
 *  beside the dot. Priority matches the summary's own state ladder. */
export function profileStatusCount(summary: ProfileDotSummary): number {
  if (summary.state === 'needs-input') {
    return summary.needsInputCount
  }

  return summary.state === 'working' ? summary.workingCount : summary.unreadCount
}
