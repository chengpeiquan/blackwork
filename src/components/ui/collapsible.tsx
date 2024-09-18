'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import {
  ChevronsDown as CollapsibleClosed,
  ChevronsUp as CollapsibleOpened,
} from 'lucide-react'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleOpened,
  CollapsibleClosed,
}
