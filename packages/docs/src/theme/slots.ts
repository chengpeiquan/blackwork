import type {
  DocsThemeContentHeaderMetaProps,
  DocsThemeFooterSlotProps,
  DocsThemeHeaderActionsProps,
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

const isHeaderActionsSlot = (
  value: unknown,
): value is ComponentType<DocsThemeHeaderActionsProps> =>
  typeof value === 'function'

const isContentHeaderMetaSlot = (
  value: unknown,
): value is ComponentType<DocsThemeContentHeaderMetaProps> =>
  typeof value === 'function'

const isLinkComponent = (value: unknown): value is DocsThemeLinkComponent =>
  typeof value === 'function'

export function resolveThemeSlots(value: unknown): DocsThemeSlots {
  if (!isRecord(value)) {
    return {}
  }

  return {
    ...(isContentHeaderMetaSlot(value.contentHeaderMeta)
      ? { contentHeaderMeta: value.contentHeaderMeta }
      : {}),
    ...(isFooterSlot(value.footer) ? { footer: value.footer } : {}),
    ...(isHeaderActionsSlot(value.headerActions)
      ? { headerActions: value.headerActions }
      : {}),
    ...(isLinkComponent(value.link) ? { link: value.link } : {}),
  }
}
