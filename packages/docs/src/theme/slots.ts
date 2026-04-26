import type {
  DocsThemeFooterSlotProps,
  DocsThemeLinkComponent,
  DocsThemeSlots,
} from './types'
import type { ComponentType } from 'react'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isFooterSlot = (
  value: unknown,
): value is ComponentType<DocsThemeFooterSlotProps> =>
  typeof value === 'function'

const isLinkComponent = (value: unknown): value is DocsThemeLinkComponent =>
  typeof value === 'function'

export function resolveThemeSlots(value: unknown): DocsThemeSlots {
  if (!isRecord(value)) {
    return {}
  }

  return {
    ...(isFooterSlot(value.footer) ? { footer: value.footer } : {}),
    ...(isLinkComponent(value.link) ? { link: value.link } : {}),
  }
}
