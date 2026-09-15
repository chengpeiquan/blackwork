import * as React from 'react'

import { cn } from '@/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  appearance?: 'default' | 'glass'
  onEnterPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      appearance = 'default',
      onKeyDown,
      onEnterPress,
      ...props
    },
    ref,
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onEnterPress?.(e)
      }
      onKeyDown?.(e)
    }

    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          appearance === 'glass' && 'bw-glass-input',
          className,
        )}
        ref={ref}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
