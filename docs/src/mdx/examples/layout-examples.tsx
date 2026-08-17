'use client'

import {
  HolyGrailAside,
  HolyGrailContent,
  LanguageToggle,
  LayoutFooter,
  LayoutHeader,
  LayoutMain,
  ThemeToggle,
} from 'blackwork'
import { Example } from '../components/example'
import { PropsTable } from '../components/props-table'

const headerCode = `import { LanguageToggle, LayoutHeader, ThemeToggle } from 'blackwork'

export const Example = () => {
  return (
    <LayoutHeader
      socialLinks={[
        { type: 'github', link: 'https://github.com/chengpeiquan/blackwork' },
        { type: 'x', link: 'https://x.com/chengpeiquan' },
      ]}
      languageToggle={
        <LanguageToggle
          title="Change language"
          ariaLabel="Change language"
          defaultValue="en"
          options={[
            { value: 'en', label: 'English' },
            { value: 'zh', label: '简体中文' },
          ]}
        />
      }
      themeToggle={<ThemeToggle />}
    >
      <span className="font-medium">Blackwork</span>
    </LayoutHeader>
  )
}`

const mainCode = `import { LayoutMain } from 'blackwork/rsc'

export const Example = () => {
  return (
    <LayoutMain>
      <p>Page content uses the shared content gutter.</p>
    </LayoutMain>
  )
}`

const footerCode = `import { LayoutFooter } from 'blackwork/rsc'

export const Example = () => {
  return <LayoutFooter>© Blackwork</LayoutFooter>
}`

const holyGrailCode = `import { HolyGrailAside, HolyGrailContent } from 'blackwork'

export const Example = () => {
  return (
    <div className="flex gap-6">
      <HolyGrailAside smaller>Sidebar</HolyGrailAside>
      <HolyGrailContent>Article</HolyGrailContent>
      <HolyGrailAside>On this page</HolyGrailAside>
    </div>
  )
}`

export const LayoutHeaderExample = () => (
  <Example
    title="Header"
    className="w-full flex-col items-stretch overflow-hidden p-0"
    code={headerCode}
  >
    <LayoutHeader
      className="static w-full"
      socialLinks={[
        { type: 'github', link: 'https://github.com/chengpeiquan/blackwork' },
        { type: 'x', link: 'https://x.com/chengpeiquan' },
      ]}
      languageToggle={
        <LanguageToggle
          title="Change language"
          ariaLabel="Change language"
          defaultValue="en"
          options={[
            { value: 'en', label: 'English' },
            { value: 'zh', label: '简体中文' },
          ]}
        />
      }
      themeToggle={<ThemeToggle />}
    >
      <span className="font-medium">Blackwork</span>
    </LayoutHeader>
  </Example>
)

export const LayoutMainExample = () => (
  <Example
    title="Main"
    className="w-full flex-col items-stretch overflow-hidden p-0"
    code={mainCode}
  >
    <LayoutMain className="min-h-32 justify-center">
      <p className="text-sm text-muted-foreground">
        Page content uses the shared content gutter.
      </p>
    </LayoutMain>
  </Example>
)

export const LayoutFooterExample = () => (
  <Example
    title="Footer"
    className="w-full flex-col items-stretch overflow-hidden p-0"
    code={footerCode}
  >
    <LayoutFooter className="h-20">© Blackwork</LayoutFooter>
  </Example>
)

export const LayoutHolyGrailExample = () => (
  <Example
    title="Holy grail"
    className="w-full flex-col items-stretch"
    code={holyGrailCode}
  >
    <div className="flex min-h-40 w-full gap-4">
      <HolyGrailAside
        smaller
        className="flex w-24 rounded-md bg-muted p-3 text-sm text-muted-foreground lg:w-32"
      >
        Sidebar
      </HolyGrailAside>
      <HolyGrailContent className="rounded-md bg-muted/50 p-3 text-sm">
        Article
      </HolyGrailContent>
      <HolyGrailAside className="flex w-24 rounded-md bg-muted p-3 text-sm text-muted-foreground lg:w-40">
        On this page
      </HolyGrailAside>
    </div>
  </Example>
)

export const LayoutShellPropsTable = () => (
  <PropsTable
    title="LayoutHeader"
    rows={[
      {
        name: 'socialLinks',
        type: 'SocialLinkProps[]',
        description: 'Icon buttons rendered on the right of the header.',
      },
      {
        name: 'socialLinksVisible',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Hide social links even when the array has items.',
      },
      {
        name: 'languageToggle',
        type: 'ReactNode',
        description: 'Slot for LanguageToggle or a custom locale control.',
      },
      {
        name: 'themeToggle',
        type: 'ReactNode',
        description: 'Slot for ThemeToggle.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description: 'Brand and primary navigation on the left.',
      },
    ]}
  />
)

export const LayoutMainPropsTable = () => (
  <PropsTable
    title="LayoutMain"
    rows={[
      {
        name: 'fullscreen',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Drop the content gutter and vertical padding. Use for full-bleed pages.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Merge layout classes onto the child instead of a main.',
      },
    ]}
  />
)

export const LayoutHolyGrailPropsTable = () => (
  <PropsTable
    title="HolyGrailAside"
    rows={[
      {
        name: 'smaller',
        type: 'boolean',
        defaultValue: 'false',
        description:
          'Narrower column. Typical for a left nav. The default width fits a table of contents.',
      },
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Merge column classes onto the child.',
      },
    ]}
  />
)

export const LayoutRootPropsTable = () => (
  <PropsTable
    title="RootLayout"
    rows={[
      {
        name: 'lang',
        type: 'string',
        defaultValue: '"en"',
        description: 'html lang. Use a BCP 47 tag such as en or zh-CN.',
      },
      {
        name: 'metadata',
        type: 'ReactNode',
        description: 'Extra nodes rendered inside head, after ThemeScript.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Classes for body.',
      },
    ]}
  />
)
