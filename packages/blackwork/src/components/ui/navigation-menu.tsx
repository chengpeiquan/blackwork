'use client'

import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import { ChevronDown } from '@/icons'

import { cn } from '@/utils'
import { splitAsChild, type AsChildProps } from '@/utils/as-child'

const NavigationMenu = React.forwardRef<
  HTMLElement,
  NavigationMenuPrimitive.Root.Props
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    data-slot="navigation-menu"
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className,
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = 'NavigationMenu'

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  NavigationMenuPrimitive.List.Props
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    data-slot="navigation-menu-list"
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className,
    )}
    {...props}
  />
))
NavigationMenuList.displayName = 'NavigationMenuList'

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  NavigationMenuPrimitive.Item.Props
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Item
    ref={ref}
    data-slot="navigation-menu-item"
    className={cn('relative', className)}
    {...props}
  />
))
NavigationMenuItem.displayName = 'NavigationMenuItem'

const navigationMenuTriggerStyle = cva(
  'data-open:bg-accent/50 data-open:text-accent-foreground data-open:hover:bg-accent data-open:focus:bg-accent group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
)

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuPrimitive.Trigger.Props
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    data-slot="navigation-menu-trigger"
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="group-data-open:rotate-180 relative top-px ml-1 size-3 transition duration-200"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger'

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  NavigationMenuPrimitive.Content.Props
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    data-slot="navigation-menu-content"
    className={cn(
      'data-ending-style:opacity-0 data-starting-style:opacity-0 h-full w-auto transition-[opacity,transform] md:w-auto',
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = 'NavigationMenuContent'

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuPrimitive.Link.Props & AsChildProps
>(({ className, asChild, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    data-slot="navigation-menu-link"
    className={className}
    {...splitAsChild({ asChild, ...props })}
  />
))
NavigationMenuLink.displayName = 'NavigationMenuLink'

const NavigationMenuViewport = React.forwardRef<
  HTMLDivElement,
  NavigationMenuPrimitive.Positioner.Props
>(
  (
    {
      className,
      side = 'bottom',
      sideOffset = 8,
      align = 'start',
      alignOffset = 0,
      ...props
    },
    ref,
  ) => (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        ref={ref}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn('absolute left-0 top-full isolate z-50', className)}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="relative mt-1.5 origin-top overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[open]:animate-in data-[closed]:animate-out data-[closed]:zoom-out-95 data-[open]:zoom-in-90">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  ),
)
NavigationMenuViewport.displayName = 'NavigationMenuViewport'

const NavigationMenuIndicator = React.forwardRef<
  HTMLDivElement,
  NavigationMenuPrimitive.Icon.Props
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Icon
    ref={ref}
    data-slot="navigation-menu-indicator"
    className={cn(
      'z-1 top-full flex h-1.5 items-end justify-center overflow-hidden data-[hidden]:fade-out data-[visible]:fade-in',
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Icon>
))
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator'

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
