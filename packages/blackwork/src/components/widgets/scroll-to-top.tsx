import { isBrowser } from '@bassist/utils'
import React from 'react'
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
  const cls = cn('fixed bottom-3 right-3 z-10 size-10 select-none', className)

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
      <ArrowUpFromLine className="size-5" />
    </Button>
  )
}
