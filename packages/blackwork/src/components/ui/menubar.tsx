'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { Menubar as MenubarPrimitive } from '@base-ui/react/menubar'
import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, Circle } from '@/icons'
import { cn } from '@/utils'

const Menubar = React.forwardRef<HTMLDivElement, MenubarPrimitive.Props>(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive
      ref={ref}
      data-slot="menubar"
      className={cn(
        'flex h-10 items-center space-x-1 rounded-md border bg-background p-1',
        className,
      )}
      {...props}
    />
  ),
)
Menubar.displayName = 'Menubar'

function MenubarMenu(props: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu data-slot="menubar-menu" {...props} />
}

function MenubarGroup(props: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />
}

function MenubarPortal(props: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup(
  props: React.ComponentProps<typeof DropdownMenuRadioGroup>,
) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />
}

function MenubarSub(props: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />
}

const MenubarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuTrigger>
>(({ className, ...props }, ref) => (
  <DropdownMenuTrigger
    ref={ref}
    data-slot="menubar-trigger"
    className={cn(
      'data-open:bg-accent data-open:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground',
      className,
    )}
    {...props}
  />
))
MenubarTrigger.displayName = 'MenubarTrigger'

const MenubarSubTrigger = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSubTrigger>
>(({ className, ...props }, ref) => (
  <DropdownMenuSubTrigger
    ref={ref}
    data-slot="menubar-sub-trigger"
    className={className}
    {...props}
  />
))
MenubarSubTrigger.displayName = 'MenubarSubTrigger'

const MenubarSubContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuSubContent
    ref={ref}
    data-slot="menubar-sub-content"
    className={className}
    {...props}
  />
))
MenubarSubContent.displayName = 'MenubarSubContent'

const MenubarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(
  (
    { className, align = 'start', alignOffset = -4, sideOffset = 8, ...props },
    ref,
  ) => (
    <DropdownMenuContent
      ref={ref}
      data-slot="menubar-content"
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn('min-w-48', className)}
      {...props}
    />
  ),
)
MenubarContent.displayName = 'MenubarContent'

const MenubarItem = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem>
>(({ className, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    data-slot="menubar-item"
    className={className}
    {...props}
  />
))
MenubarItem.displayName = 'MenubarItem'

const MenubarCheckboxItem = React.forwardRef<
  HTMLElement,
  MenuPrimitive.CheckboxItem.Props
>(({ className, children, checked, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
    ref={ref}
    data-slot="menubar-checkbox-item"
    className={cn(
      'data-disabled:pointer-events-none data-disabled:opacity-50 relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <MenuPrimitive.CheckboxItemIndicator>
        <Check className="size-4" />
      </MenuPrimitive.CheckboxItemIndicator>
    </span>
    {children}
  </MenuPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem'

const MenubarRadioItem = React.forwardRef<
  HTMLElement,
  MenuPrimitive.RadioItem.Props
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.RadioItem
    ref={ref}
    data-slot="menubar-radio-item"
    className={cn(
      'data-disabled:pointer-events-none data-disabled:opacity-50 relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <MenuPrimitive.RadioItemIndicator>
        <Circle className="size-2 fill-current" />
      </MenuPrimitive.RadioItemIndicator>
    </span>
    {children}
  </MenuPrimitive.RadioItem>
))
MenubarRadioItem.displayName = 'MenubarRadioItem'

const MenubarLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuLabel>
>(({ className, ...props }, ref) => (
  <DropdownMenuLabel
    ref={ref}
    data-slot="menubar-label"
    className={className}
    {...props}
  />
))
MenubarLabel.displayName = 'MenubarLabel'

const MenubarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>
>(({ className, ...props }, ref) => (
  <DropdownMenuSeparator
    ref={ref}
    data-slot="menubar-separator"
    className={className}
    {...props}
  />
))
MenubarSeparator.displayName = 'MenubarSeparator'

const MenubarShortcut = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) => {
  return (
    <DropdownMenuShortcut
      data-slot="menubar-shortcut"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  )
}
MenubarShortcut.displayName = 'MenubarShortcut'

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
