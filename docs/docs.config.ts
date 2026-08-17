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
    badge: false,
    eyebrow: false,
    title: 'Blackwork',
    description:
      'A tattoo-style React design system for blogs, documentation sites, and other content-driven products.',
    primaryAction: {
      href: '/guide/getting-started',
      label: 'Getting Started',
    },
    secondaryAction: {
      href: '/components',
      label: 'Components',
    },
    highlights: [
      {
        title: 'Layouts',
        description:
          'Header, main, footer, and holy-grail columns for content sites.',
        href: '/components/layouts',
      },
      {
        title: 'Forms',
        description: 'Field layout plus TanStack Form helpers.',
        href: '/components/form',
      },
      {
        title: 'Theme',
        description: 'Light and dark mode with ThemeProvider and ThemeToggle.',
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
  },
  slots: {
    headerActions: DocsHeaderSearchAction,
  },
})
