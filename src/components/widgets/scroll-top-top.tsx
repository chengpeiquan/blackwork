import React from 'react'
import { ArrowUpFromLine } from 'lucide-react'
import { isBrowser } from '@bassist/utils'
import { Button, type ButtonProps } from '@/components/ui'
import { cn } from '@/utils'

export interface ScrollToTopProps {
  className?: string
  title?: string
  ariaLabel?: string
  variant?: ButtonProps['variant']
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  className,
  title,
  ariaLabel,
  variant = 'ghost',
}) => {
  const cls = cn('fixed right-3 bottom-3 w-10 h-10 z-10 select-none', className)

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
      variant={variant}
      size="icon"
      title={title}
      aria-label={ariaLabel}
      onClick={scrollToTop}
    >
      <ArrowUpFromLine className="w-5 h-5" />
    </Button>
  )
}
