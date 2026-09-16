import { Button, buttonVariants } from 'blackwork/rsc'
import { ArrowUpFromLine } from 'lucide-react'
import React from 'react'
import { getDocsFloatingActionStyle } from './floating-actions'

export interface DocsScrollToTopProps {
  appearance?: 'default' | 'glass'
  label?: string
}

export const DocsScrollToTop: React.FC<DocsScrollToTopProps> = ({
  label = 'Scroll to top',
  appearance = 'default',
}) => {
  if (appearance === 'glass') {
    return (
      <Button
        asChild
        variant="glass"
        size="icon"
        className="fixed"
        style={getDocsFloatingActionStyle(0)}
      >
        <a href="#" title={label} aria-label={label}>
          <ArrowUpFromLine className="size-5" aria-hidden="true" />
        </a>
      </Button>
    )
  }
  return (
    <a
      href="#"
      title={label}
      aria-label={label}
      className={buttonVariants({
        variant: 'outline',
        size: 'icon',
        className:
          'fixed border border-input bg-background shadow-sm md:bg-transparent md:shadow-none',
      })}
      style={getDocsFloatingActionStyle(0)}
    >
      <ArrowUpFromLine className="size-5" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </a>
  )
}
