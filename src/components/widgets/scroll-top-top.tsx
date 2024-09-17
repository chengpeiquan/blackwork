import React from 'react'
import { ArrowUpFromLine } from 'lucide-react'
import { isBrowser } from '@bassist/utils'
import { Button } from '@/components/ui'
import { cn } from '@/utils'

export interface ScrollToTopProps {
  className?: string
  title?: string
  ariaLabel?: string
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  className,
  title,
  ariaLabel,
}) => {
  const cls = cn('fixed right-4 bottom-4 select-none', className)

  const scrollToTop = () => {
    if (isBrowser) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <Button
      className={cls}
      variant="ghost"
      size="icon"
      title={title}
      aria-label={ariaLabel}
      onClick={scrollToTop}
    >
      <ArrowUpFromLine />
    </Button>
  )
}
