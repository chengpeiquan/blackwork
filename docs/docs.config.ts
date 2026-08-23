import { defineDocsConfig } from '@blackwork/docs'
import { Callout } from './src/mdx/components/callout'
import {
  ComponentCatalog,
  PrimitiveCatalog,
} from './src/mdx/components/component-catalog'
import { DocsMdxLink } from './src/mdx/components/docs-mdx-link'
import {
  ButtonAsChildExample,
  ButtonBasicExample,
  ButtonLoadingExample,
  ButtonPropsTable,
  ButtonSizesExample,
  ButtonVariantsExample,
} from './src/mdx/examples/button-examples'
import {
  DialogBasicExample,
  DialogPropsTable,
} from './src/mdx/examples/dialog-examples'
import {
  FieldBasicExample,
  FieldHorizontalExample,
  FieldInvalidExample,
  FieldPropsTable,
} from './src/mdx/examples/field-examples'
import {
  FormBasicExample,
  FormCustomExample,
  FormFieldsExample,
  FormPropsTable,
} from './src/mdx/examples/form-examples'
import {
  LayoutFooterExample,
  LayoutHeaderExample,
  LayoutHolyGrailExample,
  LayoutHolyGrailPropsTable,
  LayoutMainExample,
  LayoutMainPropsTable,
  LayoutRootPropsTable,
  LayoutShellPropsTable,
} from './src/mdx/examples/layout-examples'
import {
  SheetBasicExample,
  SheetPropsTable,
  SheetSidesExample,
} from './src/mdx/examples/sheet-examples'
import {
  ThemeBasicExample,
  ThemeDropdownExample,
  ThemePropsTable,
} from './src/mdx/examples/theme-examples'
import {
  WidgetExternalExample,
  WidgetLanguageExample,
  WidgetLanguagePropsTable,
  WidgetQuickSearchExample,
  WidgetScrollExample,
  WidgetScrollPropsTable,
  WidgetSearchExample,
  WidgetSearchPropsTable,
  WidgetSocialExample,
  WidgetSocialPropsTable,
  WidgetTypographyExample,
  WidgetTypographyPropsTable,
} from './src/mdx/examples/widget-examples'
import { DocsHeaderSearchAction } from './src/search/docs-search'

export const docsConfig = defineDocsConfig({
  site: {
    title: 'Blackwork',
    description:
      'A tattoo-style React design system for blogs, docs, and content sites.',
    url: 'https://ui.chengpeiquan.com',
  },
  home: {
    badge: {
      alt: {
        en: 'Latest blackwork version on npm',
        zh: 'blackwork npm 最新版本',
      },
      href: 'https://www.npmjs.com/package/blackwork',
      src: 'https://img.shields.io/npm/v/blackwork?label=npm&labelColor=171717&color=cb3837',
    },
    eyebrow: false,
    title: 'Blackwork',
    description: {
      en: 'A tattoo-style React design system for blogs, documentation sites, and other content-driven products.',
      zh: '一套面向博客、文档站和其他内容型产品的刺青风格 React 设计系统。',
    },
    primaryAction: {
      href: '/guide/getting-started',
      label: { en: 'Getting Started', zh: '快速开始' },
    },
    secondaryAction: {
      href: '/components',
      label: { en: 'Components', zh: '组件' },
    },
    highlights: [
      {
        title: { en: 'Layouts', zh: '布局' },
        description: {
          en: 'Header, main, footer, and holy-grail columns for content sites.',
          zh: '为内容站准备的页头、主栏、页脚和圣杯分栏。',
        },
        href: '/components/layouts',
      },
      {
        title: { en: 'Forms', zh: '表单' },
        description: {
          en: 'Field layout plus TanStack Form helpers.',
          zh: '字段布局与 TanStack Form 接入工具。',
        },
        href: '/components/form',
      },
      {
        title: { en: 'Theme', zh: '主题' },
        description: {
          en: 'Light and dark mode with ThemeProvider and ThemeToggle.',
          zh: '通过 ThemeProvider 和 ThemeToggle 使用浅色与深色主题。',
        },
        href: '/components/theme',
      },
    ],
  },
  mdx: {
    components: {
      ButtonAsChildExample,
      ButtonBasicExample,
      ButtonLoadingExample,
      ButtonPropsTable,
      ButtonSizesExample,
      ButtonVariantsExample,
      a: DocsMdxLink,
      Callout,
      ComponentCatalog,
      PrimitiveCatalog,
      DialogBasicExample,
      DialogPropsTable,
      FieldBasicExample,
      FieldHorizontalExample,
      FieldInvalidExample,
      FieldPropsTable,
      FormBasicExample,
      FormCustomExample,
      FormFieldsExample,
      FormPropsTable,
      LayoutFooterExample,
      LayoutHeaderExample,
      LayoutHolyGrailExample,
      LayoutHolyGrailPropsTable,
      LayoutMainExample,
      LayoutMainPropsTable,
      LayoutRootPropsTable,
      LayoutShellPropsTable,
      SheetBasicExample,
      SheetPropsTable,
      SheetSidesExample,
      ThemeBasicExample,
      ThemeDropdownExample,
      ThemePropsTable,
      WidgetExternalExample,
      WidgetLanguageExample,
      WidgetLanguagePropsTable,
      WidgetQuickSearchExample,
      WidgetScrollExample,
      WidgetScrollPropsTable,
      WidgetSearchExample,
      WidgetSearchPropsTable,
      WidgetSocialExample,
      WidgetSocialPropsTable,
      WidgetTypographyExample,
      WidgetTypographyPropsTable,
    },
  },
  theme: {
    socialLinks: [
      {
        type: 'github',
        link: 'https://github.com/chengpeiquan/blackwork',
        label: 'GitHub',
        ariaLabel: {
          en: 'Source code on GitHub',
          zh: '在 GitHub 查看源码',
        },
      },
    ],
    labels: {
      changeLanguage: { en: 'Change language', zh: '切换语言' },
      documentationPages: { en: 'Documentation pages', zh: '文档页面' },
      documentPager: { en: 'Document pager', zh: '文档翻页' },
      next: { en: 'Next', zh: '下一页' },
      openSectionNavigation: {
        en: 'Open section navigation',
        zh: '打开章节导航',
      },
      openSiteNavigation: { en: 'Open site navigation', zh: '打开网站导航' },
      previous: { en: 'Previous', zh: '上一页' },
      primaryNavigation: { en: 'Primary navigation', zh: '主导航' },
      scrollToTop: { en: 'Scroll to top', zh: '回到顶部' },
      sections: { en: 'Sections', zh: '章节' },
      toggleTheme: { en: 'Toggle theme', zh: '切换主题' },
    },
    nav: [
      {
        href: '/guide/getting-started',
        label: {
          en: 'Guide',
          zh: '指南',
        },
      },
      {
        href: '/components',
        label: {
          en: 'Components',
          zh: '组件',
        },
      },
    ],
    toc: {
      collapseLabel: { en: 'Collapse outline', zh: '收起页面目录' },
      expandLabel: { en: 'Expand outline', zh: '展开页面目录' },
      openLabel: { en: 'Open outline', zh: '打开页面目录' },
      title: { en: 'On This Page', zh: '本页内容' },
    },
  },
  slots: {
    headerActions: DocsHeaderSearchAction,
  },
})
