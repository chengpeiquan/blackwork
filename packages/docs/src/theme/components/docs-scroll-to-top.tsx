import { Button } from 'blackwork'
import { ArrowUpFromLine } from 'blackwork/icons'
import React from 'react'
import { getDocsFloatingActionStyle } from './floating-actions'

export const DocsScrollToTop: React.FC = () => {
  return (
    <Button
      asChild
      type="button"
      variant="outline"
      size="icon"
      title="Scroll to top"
      aria-label="Scroll to top"
      className="fixed border border-input bg-background shadow-sm md:bg-transparent md:shadow-none"
      style={getDocsFloatingActionStyle(0)}
    >
      <a href="#">
        <ArrowUpFromLine className="size-5" aria-hidden="true" />
        <span className="sr-only">Scroll to top</span>
      </a>
    </Button>
  )
}
