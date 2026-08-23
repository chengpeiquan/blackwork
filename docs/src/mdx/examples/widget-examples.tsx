'use client'

import {
  ExternalLink,
  Heading,
  LanguageToggle,
  Paragraph,
  QuickSearchDialog,
  QuickSearchEmpty,
  QuickSearchInput,
  QuickSearchItem,
  QuickSearchList,
  QuickSearchTrigger,
  ScrollToTop,
  SearchInput,
  SocialLinks,
} from 'blackwork'
import { useState } from 'react'
import { Example } from '../components/example'
import { PropsTable } from '../components/props-table'

const languageCode = `import { LanguageToggle } from 'blackwork'

export const Example = () => {
  return (
    <LanguageToggle
      title="Change language"
      ariaLabel="Change language"
      defaultValue="en"
      options={[
        { value: 'en', label: 'English' },
        { value: 'zh', label: '简体中文' },
      ]}
    />
  )
}`

const searchCode = `import { SearchInput } from 'blackwork'

export const Example = () => {
  return <SearchInput placeholder="Search posts..." />
}`

const socialCode = `import { SocialLinks } from 'blackwork'

export const Example = () => {
  return (
    <SocialLinks
      items={[
        { type: 'github', link: 'https://github.com/chengpeiquan/blackwork' },
        { type: 'x', link: 'https://x.com/chengpeiquan' },
        { type: 'rss', link: '/rss.xml' },
      ]}
    />
  )
}`

const scrollCode = `import { ScrollToTop } from 'blackwork'

export const Example = () => {
  return <ScrollToTop title="Back to top" ariaLabel="Back to top" />
}`

const typographyCode = `import { Heading, Paragraph } from 'blackwork'

export const Example = () => {
  return (
    <>
      <Heading level={2}>Section title</Heading>
      <Paragraph>Body copy for a content page.</Paragraph>
    </>
  )
}`

const externalCode = `import { ExternalLink } from 'blackwork'

export const Example = () => {
  return (
    <ExternalLink href="https://ui.chengpeiquan.com">
      Blackwork docs
    </ExternalLink>
  )
}`

const quickSearchCode = `import {
  QuickSearchDialog,
  QuickSearchEmpty,
  QuickSearchInput,
  QuickSearchItem,
  QuickSearchList,
  QuickSearchTrigger,
  useQuickSearchState,
} from 'blackwork'

export const Example = () => {
  const { open, setOpen } = useQuickSearchState()

  return (
    <>
      <QuickSearchTrigger
        label="Search docs..."
        shortLabel="Search"
        onClick={() => setOpen(true)}
      />
      <QuickSearchDialog open={open} onOpenChange={setOpen}>
        <QuickSearchInput placeholder="Search docs..." />
        <QuickSearchList>
          <QuickSearchItem>Getting started</QuickSearchItem>
          <QuickSearchEmpty>No matching pages.</QuickSearchEmpty>
        </QuickSearchList>
      </QuickSearchDialog>
    </>
  )
}`

export const WidgetLanguageExample = () => (
  <Example title="Language toggle" titleZh="语言切换" code={languageCode}>
    <LanguageToggle
      title="Change language"
      ariaLabel="Change language"
      defaultValue="en"
      options={[
        { value: 'en', label: 'English' },
        { value: 'zh', label: '简体中文' },
      ]}
    />
  </Example>
)

export const WidgetSearchExample = () => (
  <Example title="Search input" titleZh="搜索框" code={searchCode}>
    <SearchInput placeholder="Search posts..." />
  </Example>
)

export const WidgetSocialExample = () => (
  <Example title="Social links" titleZh="社交链接" code={socialCode}>
    <SocialLinks
      items={[
        { type: 'github', link: 'https://github.com/chengpeiquan/blackwork' },
        { type: 'x', link: 'https://x.com/chengpeiquan' },
        { type: 'rss', link: '/rss.xml' },
      ]}
    />
  </Example>
)

export const WidgetScrollExample = () => (
  <Example title="Scroll to top" titleZh="回到顶部" code={scrollCode}>
    <ScrollToTop
      className="relative right-auto bottom-auto"
      title="Back to top"
      ariaLabel="Back to top"
    />
  </Example>
)

export const WidgetTypographyExample = () => (
  <Example
    title="Typography"
    titleZh="排版"
    className="w-full max-w-xl flex-col items-start"
    code={typographyCode}
  >
    <Heading level={2}>Section title</Heading>
    <Paragraph>Body copy for a content page.</Paragraph>
  </Example>
)

export const WidgetExternalExample = () => (
  <Example title="External link" titleZh="外部链接" code={externalCode}>
    <ExternalLink href="https://ui.chengpeiquan.com">
      Blackwork docs
    </ExternalLink>
  </Example>
)

export const WidgetQuickSearchExample = () => {
  const [open, setOpen] = useState(false)

  return (
    <Example title="Quick search" titleZh="快速搜索" code={quickSearchCode}>
      <QuickSearchTrigger
        label="Search docs..."
        shortLabel="Search"
        onClick={() => setOpen(true)}
      />
      <QuickSearchDialog open={open} onOpenChange={setOpen} ariaLabel="Search">
        <QuickSearchInput placeholder="Search docs..." />
        <QuickSearchList>
          <QuickSearchItem>Getting started</QuickSearchItem>
          <QuickSearchEmpty>Type to filter results.</QuickSearchEmpty>
        </QuickSearchList>
      </QuickSearchDialog>
    </Example>
  )
}

export const WidgetLanguagePropsTable = () => (
  <PropsTable
    title="LanguageToggle"
    rows={[
      {
        name: 'options',
        type: 'LanguageToggleOption | LanguageToggleOption[]',
        required: true,
        description:
          'One option renders a button. An array renders a dropdown.',
        descriptionZh: '单个 option 显示按钮，数组显示下拉菜单。',
      },
      {
        name: 'defaultValue',
        type: 'string',
        description: 'Current locale. Used to pick the trigger icon.',
        descriptionZh: '当前语言，用于选择触发器图标。',
      },
      {
        name: 'title',
        type: 'string',
        description: 'Tooltip on the trigger.',
        descriptionZh: '触发器的 tooltip。',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        description: 'Accessible name. Falls back to title.',
        descriptionZh: '无障碍名称，默认使用 title。',
      },
    ]}
  />
)

export const WidgetSocialPropsTable = () => (
  <PropsTable
    title="SocialLink"
    rows={[
      {
        name: 'type',
        type: '"github" | "x" | "twitter" | "instagram" | "zhihu" | "rss"',
        required: true,
        description: 'Built-in brand mark. Other types render nothing.',
        descriptionZh: '内置品牌图标，其他类型不会显示内容。',
      },
      {
        name: 'link',
        type: 'string',
        required: true,
        description: 'Destination URL. Opens in a new tab.',
        descriptionZh: '目标 URL，会在新标签页打开。',
      },
      {
        name: 'label',
        type: 'string',
        description: 'Tooltip. Defaults to the brand name.',
        descriptionZh: 'Tooltip，默认使用品牌名称。',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        description: 'Accessible name. Defaults to Visit {label} in a new tab.',
        descriptionZh: '无障碍名称，默认是 Visit {label} in a new tab。',
      },
    ]}
  />
)

export const WidgetScrollPropsTable = () => (
  <PropsTable
    title="ScrollToTop"
    rows={[
      {
        name: 'title',
        type: 'string',
        description: 'Tooltip on the button.',
        descriptionZh: '按钮的 tooltip。',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        description: 'Accessible name for the icon-only button.',
        descriptionZh: '纯图标按钮的无障碍名称。',
      },
      {
        name: 'variant',
        type: 'Button variant',
        defaultValue: '"ghost"',
        description: 'Passed through to Button.',
        descriptionZh: '原样传给 Button。',
      },
    ]}
  />
)

export const WidgetSearchPropsTable = () => (
  <PropsTable
    title="SearchInput"
    rows={[
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: '"Search..."',
        description: 'Native input placeholder.',
        descriptionZh: '原生 input placeholder。',
      },
      {
        name: 'inputRef',
        type: 'RefObject<HTMLInputElement>',
        description: 'Ref for the inner input.',
        descriptionZh: '内部 input 的 ref。',
      },
      {
        name: 'inputClassName',
        type: 'string',
        description: 'Classes for the inner input.',
        descriptionZh: '内部 input 的 class。',
      },
      {
        name: 'searchIconClassName',
        type: 'string',
        description: 'Classes for the search icon.',
        descriptionZh: '搜索图标的 class。',
      },
    ]}
  />
)

export const WidgetTypographyPropsTable = () => (
  <PropsTable
    title="Heading"
    rows={[
      {
        name: 'level',
        type: '1 | 2 | 3 | 4',
        defaultValue: '1',
        description: 'Renders h1 through h4 with the matching type scale.',
        descriptionZh: '显示 h1 至 h4，并使用对应的字号层级。',
      },
    ]}
  />
)
