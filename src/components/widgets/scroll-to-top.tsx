import React from 'react'
import { isBrowser } from '@bassist/utils'
import { Button, type ButtonProps } from '@/components/ui'
import { ArrowUpFromLine } from '@/icons'
import { cn } from '@/utils'

export interface ScrollToTopProps {
  className?: string
  title?: string
  ariaLabel?: string
  variant?: ButtonProps['variant']
  style?: React.CSSProperties
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  className,
  title,
  ariaLabel,
  variant = 'ghost',
  style,
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
      style={style}
    >
      <ArrowUpFromLine className="w-5 h-5" />
    </Button>
  )
}
