import { useRender } from '@base-ui/react/use-render'
import * as React from 'react'

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    return useRender({
      render: React.isValidElement(children) ? children : undefined,
      props,
      ref,
      enabled: React.isValidElement(children),
    })
  },
)
Slot.displayName = 'Slot'
