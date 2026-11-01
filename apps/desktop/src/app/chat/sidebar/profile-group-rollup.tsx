/**
 * PROFILE GROUP ROLLUP — the grouped sidebar's profile header carrying the
 * same attention state the rail square paints (#91710's summary, reused).
 *
 * In the all-profiles view every profile's sessions are listed under one pane,
 * so the question the user asks of a header is "does this profile need me?"
 * before scrolling its rows. This renders that answer compactly — the loudest
 * state's dot plus its count — and puts the full breakdown in the tooltip and
 * accessible name, so a header never says "1" without saying one of what.
 *
 * Deliberately silent for a scope with no claims: a header with a permanent
 * "0" reads as a badge, not a signal.
 */
import { sessionDotClassName } from '@/app/chat/session-status-dot'
import { useI18n } from '@/i18n'
import { useStoreSelector } from '@/lib/use-session-slice'
import { $profileDotStateByScope, profileDotSummaryFor } from '@/store/profile-dot-state'

import { profileStatusCount, profileStatusLabel } from './profile-status'

interface ProfileGroupRollupProps {
  connectionId: null | string
  profile: string
}

export function ProfileGroupRollup({ connectionId, profile }: ProfileGroupRollupProps) {
  const { t } = useI18n()

  const summary = useStoreSelector(
    $profileDotStateByScope,
    byScope => profileDotSummaryFor(byScope, connectionId, profile) ?? null
  )

  if (!summary) {
    return null
  }

  const label = profileStatusLabel(t.profiles, summary)

  return (
    <span
      aria-label={label}
      className="flex shrink-0 items-center gap-1 pl-1 text-[0.625rem] leading-none tabular-nums text-(--ui-text-tertiary)"
      data-slot="profile-group-rollup"
      role="img"
      title={label}
    >
      <span aria-hidden="true" className={sessionDotClassName(summary.state)} />
      {profileStatusCount(summary)}
    </span>
  )
}
