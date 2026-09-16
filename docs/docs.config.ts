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
  GlassControlsExample,
  GlassNavigationExample,
  GlassPlayground,
} from './src/mdx/examples/glass-examples'
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
import { HomeShowcasePreview } from './src/showcase/home-showcase-preview'

export const docsConfig = defineDocsConfig({
  site: {
    title: 'Blackwork',
    description:
      'React UI inspired by Blackwork tattoos, for blogs, docs, and personal sites.',
    url: 'https://ui.chengpeiquan.com',
  },
  home: {
    badge: false,
    eyebrow: 'REACT COMPONENTS',
    title: 'Blackwork',
    description: {
      en: 'Tattoo-inspired React components for blogs, docs, and personal sites.',
      zh: 'Blackwork 纹身风格的 React 组件，适合博客、文档与个人网站。',
    },
    primaryAction: {
      href: '/guide/getting-started',
      label: { en: 'Getting Started', zh: '快速开始' },
    },
    secondaryAction: {
      href: '/components',
      label: { en: 'View components', zh: '浏览组件' },
    },
    highlights: false,
  },
  mdx: {
    components: {
      GlassControlsExample,
      GlassNavigationExample,
      GlassPlayground,
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
    appearance: 'glass',
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
      { href: '/components/glass', label: { en: 'Glass', zh: '液态玻璃' } },
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
    homePreview: HomeShowcasePreview,
    headerActions: DocsHeaderSearchAction,
  },
})
