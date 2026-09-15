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
      en: 'A tattoo-style React design system for blogs, documentation, and other content sites.',
      zh: '一套刺青风格的 React 设计系统，适合搭建博客、文档站和其他以内容为主的网站。',
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
          en: 'Build pages with a header, main content, footer, and sidebars.',
          zh: '用页头、正文、页脚和侧栏组件搭建页面。',
        },
        href: '/components/layouts',
      },
      {
        title: { en: 'Forms', zh: '表单' },
        description: {
          en: 'Combine field layouts with TanStack Form for values and submission.',
          zh: '组合字段布局，通过 TanStack Form 管理字段值和提交。',
        },
        href: '/components/form',
      },
      {
        title: { en: 'Theme', zh: '主题' },
        description: {
          en: 'Add light and dark themes with a toggle and saved preferences.',
          zh: '配置浅色和深色主题，切换主题并保存偏好。',
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
