'use client'

import { CodeBlock } from '@blackwork/machine/runtime'
import { Button } from 'blackwork'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/utils/class-name'
import type React from 'react'

export interface ExampleProps extends React.PropsWithChildren {
  title?: string
  titleZh?: string
  description?: string
  descriptionZh?: string
  code: string
  className?: string
}

const EXAMPLE_COPY = {
  en: { code: 'Code', preview: 'Preview' },
  zh: { code: '代码', preview: '预览' },
} as const

export const Example = ({
  title,
  titleZh,
  description,
  descriptionZh,
  code,
  className,
  children,
}: ExampleProps) => {
  const pathname = usePathname()
  const copy =
    EXAMPLE_COPY[
      pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en'
    ]
  const isZh = copy === EXAMPLE_COPY.zh
  const [mode, setMode] = useState<'preview' | 'code'>('preview')

  return (
    <section className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {isZh
              ? (titleZh ?? title ?? copy.preview)
              : (title ?? copy.preview)}
          </p>
          {description || descriptionZh ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {isZh && descriptionZh ? descriptionZh : description}
            </p>
          ) : null}
        </div>
        <div className="flex gap-1 rounded-md bg-muted p-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={mode === 'preview'}
            className={cn(
              'h-8',
              mode === 'preview' && 'bg-background shadow-sm',
            )}
            onClick={() => setMode('preview')}
          >
            {copy.preview}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={mode === 'code'}
            className={cn('h-8', mode === 'code' && 'bg-background shadow-sm')}
            onClick={() => setMode('code')}
          >
            {copy.code}
          </Button>
        </div>
      </div>
      {mode === 'preview' ? (
        <div
          className={cn(
            'flex flex-wrap items-center gap-3 bg-background/40 p-6',
            className,
          )}
        >
          {children}
        </div>
      ) : (
        <div className="p-0 [&_[data-docs-region]]:my-0 [&_.not-prose]:my-0 [&_.rounded-xl]:rounded-none [&_.border]:border-0 [&_.shadow-sm]:shadow-none">
          <CodeBlock language="tsx" rawCode={code}>
            <code className="language-tsx">{code}</code>
          </CodeBlock>
        </div>
      )}
    </section>
  )
}
