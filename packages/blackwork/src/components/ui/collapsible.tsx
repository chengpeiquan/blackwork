'use client'

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import * as React from 'react'
import {
  ChevronsDown as CollapsibleClosed,
  ChevronsUp as CollapsibleOpened,
} from '@/icons'
import { splitAsChild, type AsChildProps } from '@/utils/as-child'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsiblePrimitive.Trigger.Props & AsChildProps
>(({ asChild, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    data-slot="collapsible-trigger"
    {...splitAsChild({ asChild, ...props })}
  />
))
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsiblePrimitive.Panel.Props
>(({ ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    data-slot="collapsible-content"
    {...props}
  />
))
CollapsibleContent.displayName = 'CollapsibleContent'

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleOpened,
  CollapsibleClosed,
}
