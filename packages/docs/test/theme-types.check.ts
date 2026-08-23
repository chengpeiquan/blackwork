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
    badge: {
      alt: { en: 'Latest version', zh: '最新版本' },
      href: 'https://www.npmjs.com/package/example',
      src: 'https://img.shields.io/npm/v/example?label=npm',
    },
    title: { en: 'Typed home config', zh: '有类型的首页配置' },
    primaryAction: {
      href: '/guide/getting-started',
      label: { en: 'Read docs', zh: '阅读文档' },
    },
  },
  theme: {
    socialLinks: [
      {
        type: 'github',
        link: 'https://github.com/example/docs',
        label: { en: 'GitHub', zh: 'GitHub' },
        ariaLabel: { en: 'Source code on GitHub', zh: '在 GitHub 查看源码' },
      },
    ],
    labels: {
      next: { en: 'Next', zh: '下一页' },
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
