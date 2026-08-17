import Link from 'next/link'

const CATALOG = [
  {
    href: '/components/layouts',
    label: { en: 'Layouts', zh: '布局' },
  },
  {
    href: '/components/widgets',
    label: { en: 'Widgets', zh: '小工具' },
  },
  {
    href: '/components/theme',
    label: { en: 'Theme', zh: '主题' },
  },
  { href: '/components/button', label: { en: 'Button', zh: 'Button' } },
  { href: '/components/dialog', label: { en: 'Dialog', zh: 'Dialog' } },
  { href: '/components/field', label: { en: 'Field', zh: 'Field' } },
  { href: '/components/form', label: { en: 'Form', zh: 'Form' } },
  { href: '/components/sheet', label: { en: 'Sheet', zh: 'Sheet' } },
] as const

const PRIMITIVES = [
  { label: 'Accordion', slug: 'accordion' },
  { label: 'Alert', slug: 'alert' },
  { label: 'Alert Dialog', slug: 'alert-dialog' },
  { label: 'Aspect Ratio', slug: 'aspect-ratio' },
  { label: 'Avatar', slug: 'avatar' },
  { label: 'Badge', slug: 'badge' },
  { label: 'Breadcrumb', slug: 'breadcrumb' },
  { label: 'Button Group', slug: 'button-group' },
  { label: 'Card', slug: 'card' },
  { label: 'Checkbox', slug: 'checkbox' },
  { label: 'Collapsible', slug: 'collapsible' },
  { label: 'Combobox', slug: 'combobox' },
  { label: 'Dropdown Menu', slug: 'dropdown-menu' },
  { label: 'Empty', slug: 'empty' },
  { label: 'Hover Card', slug: 'hover-card' },
  { label: 'Input', slug: 'input' },
  { label: 'Input Group', slug: 'input-group' },
  { label: 'Label', slug: 'label' },
  { label: 'Menubar', slug: 'menubar' },
  { label: 'Navigation Menu', slug: 'navigation-menu' },
  { label: 'Pagination', slug: 'pagination' },
  { label: 'Progress', slug: 'progress' },
  { label: 'Radio Group', slug: 'radio-group' },
  { label: 'Resizable', slug: 'resizable' },
  { label: 'Scroll Area', slug: 'scroll-area' },
  { label: 'Select', slug: 'select' },
  { label: 'Separator', slug: 'separator' },
  { label: 'Slider', slug: 'slider' },
  { label: 'Switch', slug: 'switch' },
  { label: 'Table', slug: 'table' },
  { label: 'Tabs', slug: 'tabs' },
  { label: 'Textarea', slug: 'textarea' },
  { label: 'Toast', slug: 'sonner' },
  { label: 'Toggle', slug: 'toggle' },
  { label: 'Toggle Group', slug: 'toggle-group' },
  { label: 'Tooltip', slug: 'tooltip' },
] as const

export interface ComponentCatalogProps {
  locale?: 'en' | 'zh'
}

export const ComponentCatalog = ({ locale = 'en' }: ComponentCatalogProps) => {
  const prefix = locale === 'zh' ? '/zh' : ''

  return (
    <div className="not-prose mt-10 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {CATALOG.map((item) => (
        <Link
          key={item.href}
          href={`${prefix}${item.href}`}
          className="text-foreground transition-colors hover:text-foreground/70"
        >
          {item.label[locale]}
        </Link>
      ))}
    </div>
  )
}

export const PrimitiveCatalog = () => {
  return (
    <div className="not-prose mt-10 grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {PRIMITIVES.map((item) => (
        <a
          key={item.slug}
          href={`https://ui.shadcn.com/docs/components/${item.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-foreground transition-colors hover:text-foreground/70"
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}
