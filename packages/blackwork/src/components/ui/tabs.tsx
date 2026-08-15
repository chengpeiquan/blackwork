'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import * as React from 'react'

import { cn } from '@/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<HTMLDivElement, TabsPrimitive.List.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      data-slot="tabs-list"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
)
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsPrimitive.Tab.Props
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(
      'data-active:bg-background data-active:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active]:shadow-sm',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<HTMLDivElement, TabsPrimitive.Panel.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Panel
      ref={ref}
      data-slot="tabs-content"
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  ),
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
