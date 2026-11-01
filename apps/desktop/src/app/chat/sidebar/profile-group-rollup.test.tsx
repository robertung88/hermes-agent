import { cleanup, render, screen } from '@testing-library/react'
import { atom } from 'nanostores'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type * as ConnectionsStore from '@/store/connections'
import type * as ProfileStore from '@/store/profile'

import { ProfileGroupRollup } from './profile-group-rollup'

// The grouped sidebar's profile header carries the same attention summary the
// rail square paints. These tests drive the REAL summary derivation (persisted
// unread markers → $profileDotStateByScope), so what is asserted is the
// header's own readout of that state, not a hand-fed fixture.

vi.mock('@/i18n', () => ({
  useI18n: () => ({
    t: {
      profiles: {
        status: {
          needsInput: (count: number) => `${count} needs input`,
          unread: (count: number) => `${count} unread`,
          working: (count: number) => `${count} working`
        }
      }
    }
  })
}))

vi.mock('@/store/profile', async importOriginal => {
  const actual = await importOriginal<typeof ProfileStore>()

  return {
    ...actual,
    $profiles: atom([
      { is_default: true, name: 'default' },
      { is_default: false, name: 'writer' }
    ])
  }
})

vi.mock('@/store/connections', async importOriginal => {
  const actual = await importOriginal<typeof ConnectionsStore>()

  return { ...actual, $activeConnectionId: atom<null | string>(null) }
})

const { $unreadFinishedMarkers } = await import('@/store/session-unread')

afterEach(() => {
  cleanup()
  $unreadFinishedMarkers.set({})
})

describe('ProfileGroupRollup', () => {
  it('names the loudest state and prints its count', () => {
    // writer finished a session while another profile was selected: the
    // persisted marker is the whole signal, exactly as it is for the rail.
    $unreadFinishedMarkers.set({ writer: ['s1'] })

    render(<ProfileGroupRollup connectionId={null} profile="writer" />)

    const rollup = screen.getByRole('img', { name: '1 unread' })

    expect(rollup.textContent).toBe('1')
  })

  it('paints nothing for a profile with no claims', () => {
    const { container } = render(<ProfileGroupRollup connectionId={null} profile="brainiac" />)

    expect(container.firstChild).toBeNull()
  })
})
