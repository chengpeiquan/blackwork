'use client'

import { clipboard } from '@bassist/utils'
import { Button, cn } from 'blackwork'
import { Check, Copy } from 'lucide-react'
import React from 'react'

const LANGUAGE_LABELS: Record<string, string> = {
  bash: 'Bash',
  css: 'CSS',
  html: 'HTML',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  md: 'Markdown',
  markdown: 'Markdown',
  shell: 'Shell',
  sh: 'Shell',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  vue: 'Vue',
  xml: 'XML',
  yaml: 'YAML',
  yml: 'YAML',
}

const WRAPPED_LANGUAGES = new Set([
  '',
  'md',
  'markdown',
  'text',
  'plaintext',
  'txt',
])

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  fileName?: string
  language?: string
  rawCode?: string
  copyLabel?: string
  copiedLabel?: string
}

export const CodeBlock: React.FC<React.PropsWithChildren<CodeBlockProps>> = ({
  fileName = '',
  language = '',
  rawCode = '',
  className,
  children,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  ...rest
}) => {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const onCopy = async () => {
    if (!rawCode) return

    const success = await clipboard.write(rawCode)
    if (!success) return

    setCopied(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false)
    }, 1600)
  }

  const normalizedLanguage = language.trim().toLowerCase()
  const shouldWrap = WRAPPED_LANGUAGES.has(normalizedLanguage)
  const languageLabel =
    (LANGUAGE_LABELS[normalizedLanguage] ?? language) || 'Text'
  const label = copied ? copiedLabel : copyLabel
  const Icon = copied ? Check : Copy

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="min-w-0 flex-1">
          {fileName && (
            <span className="block truncate font-mono text-[13px] text-foreground/80 dark:text-zinc-300">
              {fileName}
            </span>
          )}
        </div>

        <span className="shrink-0 font-mono text-[10px] text-muted-foreground/80 dark:text-zinc-500">
          {languageLabel}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          disabled={!rawCode}
          onClick={onCopy}
          className={cn(
            'size-8 rounded-md border border-border bg-background text-muted-foreground',
            'transition-colors hover:bg-accent hover:text-foreground',
            'dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <Icon className="size-4" />
          <span className="sr-only">{label}</span>
        </Button>
      </div>

      <pre
        {...rest}
        className={cn(
          'm-0 max-w-full border-0 bg-transparent p-4 text-[13px] leading-6',
          '[&_code]:block [&_code]:w-full [&_code]:min-w-0',
          shouldWrap
            ? 'overflow-x-hidden wrap-break-word whitespace-pre-wrap [&_code]:wrap-break-word [&_code]:whitespace-pre-wrap'
            : cn(
                'overflow-x-hidden wrap-break-word whitespace-pre-wrap [&_code]:wrap-break-word [&_code]:whitespace-pre-wrap',
                'sm:overflow-x-auto sm:whitespace-pre sm:[&_code]:w-max sm:[&_code]:min-w-full sm:[&_code]:break-normal sm:[&_code]:whitespace-pre',
              ),
          'rounded-none',
          className,
        )}
      >
        {children}
      </pre>
    </div>
  )
}
