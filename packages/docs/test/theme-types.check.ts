import type { DocsConfig } from '@blackwork/docs'
import type {
  DefaultDocsFooterProps,
  DefaultDocsHeaderProps,
  DefaultDocsShellProps,
  DefaultHomeShellProps,
  DocsThemeContentHeaderMetaProps,
  DocsThemeFooterSlotProps,
  DocsThemeHeaderActionsProps,
  DocsThemeLinkProps,
} from '@blackwork/docs/theme'

const contentHeaderMeta = (_props: DocsThemeContentHeaderMetaProps) => null
const footer = (_props: DocsThemeFooterSlotProps) => null
const headerActions = (_props: DocsThemeHeaderActionsProps) => null
const link = (_props: DocsThemeLinkProps) => null

const validConfig = {
  home: {
    title: 'Typed home config',
    primaryAction: {
      href: '/guide/getting-started',
      label: 'Read docs',
    },
  },
  slots: {
    contentHeaderMeta,
    footer,
    headerActions,
    link,
  },
} satisfies DocsConfig

const wrapHeader = (_props: DefaultDocsHeaderProps) => null
const wrapFooter = (_props: DefaultDocsFooterProps) => null
const wrapDocsShell = (_props: DefaultDocsShellProps) => null
const wrapHomeShell = (_props: DefaultHomeShellProps) => null

const invalidHomeConfig = {
  home: {
    // @ts-expect-error typoed home keys must not compile
    titlle: 'Broken',
  },
} satisfies DocsConfig

const invalidSlotsConfig = {
  slots: {
    // @ts-expect-error typoed slot keys must not compile
    footter: footer,
  },
} satisfies DocsConfig

void validConfig
void wrapHeader
void wrapFooter
void wrapDocsShell
void wrapHomeShell
void invalidHomeConfig
void invalidSlotsConfig
