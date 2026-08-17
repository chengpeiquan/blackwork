'use client'

import { CodeBlock } from '@blackwork/machine/runtime'
import { Button } from 'blackwork'
import { useState } from 'react'
import { cn } from '@/utils/class-name'
import type React from 'react'

export interface ExampleProps extends React.PropsWithChildren {
  title?: string
  description?: string
  code: string
  className?: string
}

export const Example = ({
  title = 'Preview',
  description,
  code,
  className,
  children,
}: ExampleProps) => {
  const [mode, setMode] = useState<'preview' | 'code'>('preview')

  return (
    <section className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
            Preview
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={mode === 'code'}
            className={cn('h-8', mode === 'code' && 'bg-background shadow-sm')}
            onClick={() => setMode('code')}
          >
            Code
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
