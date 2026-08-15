'use client'

import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card'
import * as React from 'react'

import { cn } from '@/utils'
import { splitAsChild, type AsChildProps } from '@/utils/as-child'

const HoverCard = PreviewCardPrimitive.Root

const HoverCardTrigger = React.forwardRef<
  HTMLAnchorElement,
  PreviewCardPrimitive.Trigger.Props & AsChildProps
>(({ asChild, ...props }, ref) => (
  <PreviewCardPrimitive.Trigger
    ref={ref}
    data-slot="hover-card-trigger"
    {...splitAsChild({ asChild, ...props })}
  />
))
HoverCardTrigger.displayName = 'HoverCardTrigger'

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  PreviewCardPrimitive.Popup.Props &
    Pick<
      PreviewCardPrimitive.Positioner.Props,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    >
>(
  (
    {
      className,
      align = 'center',
      sideOffset = 4,
      side = 'bottom',
      alignOffset = 0,
      ...props
    },
    ref,
  ) => (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          ref={ref}
          data-slot="hover-card-content"
          className={cn(
            'origin-(--transform-origin) z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  ),
)
HoverCardContent.displayName = 'HoverCardContent'

export { HoverCard, HoverCardTrigger, HoverCardContent }
