'use client'

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { Check, ChevronDown, X } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { cn } from '@/utils'

const Combobox = ComboboxPrimitive.Root

const ComboboxValue = (props: ComboboxPrimitive.Value.Props) => (
  <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
)

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  ComboboxPrimitive.Trigger.Props
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Trigger
    ref={ref}
    data-slot="combobox-trigger"
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDown className="size-4 shrink-0 opacity-50" />
  </ComboboxPrimitive.Trigger>
))
ComboboxTrigger.displayName = 'ComboboxTrigger'

const ComboboxClear = React.forwardRef<
  HTMLButtonElement,
  ComboboxPrimitive.Clear.Props
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Clear
    ref={ref}
    data-slot="combobox-clear"
    render={<InputGroupButton variant="ghost" size="icon-xs" />}
    className={className}
    {...props}
  >
    <X className="size-4 opacity-50" />
    <span className="sr-only">Clear</span>
  </ComboboxPrimitive.Clear>
))
ComboboxClear.displayName = 'ComboboxClear'

const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  ComboboxPrimitive.Input.Props & {
    showTrigger?: boolean
    showClear?: boolean
  }
>(
  (
    {
      className,
      children,
      disabled = false,
      showTrigger = true,
      showClear = false,
      ...props
    },
    ref,
  ) => (
    <InputGroup className={cn('w-auto', className)}>
      <ComboboxPrimitive.Input
        ref={ref}
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger ? (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            disabled={disabled}
          >
            <ComboboxTrigger className="size-7 border-0 p-0 shadow-none" />
          </InputGroupButton>
        ) : null}
        {showClear ? <ComboboxClear disabled={disabled} /> : null}
      </InputGroupAddon>
      {children}
    </InputGroup>
  ),
)
ComboboxInput.displayName = 'ComboboxInput'

const ComboboxContent = React.forwardRef<
  HTMLDivElement,
  ComboboxPrimitive.Popup.Props &
    Pick<
      ComboboxPrimitive.Positioner.Props,
      'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'
    >
>(
  (
    {
      className,
      side = 'bottom',
      sideOffset = 6,
      align = 'start',
      alignOffset = 0,
      anchor,
      ...props
    },
    ref,
  ) => (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          ref={ref}
          data-slot="combobox-content"
          className={cn(
            'max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) relative z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95',
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  ),
)
ComboboxContent.displayName = 'ComboboxContent'

const ComboboxList = React.forwardRef<
  HTMLDivElement,
  ComboboxPrimitive.List.Props
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.List
    ref={ref}
    data-slot="combobox-list"
    className={cn('max-h-64 overflow-y-auto overscroll-contain p-1', className)}
    {...props}
  />
))
ComboboxList.displayName = 'ComboboxList'

const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  ComboboxPrimitive.Item.Props
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Item
    ref={ref}
    data-slot="combobox-item"
    className={cn(
      'data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
      className,
    )}
    {...props}
  >
    {children}
    <ComboboxPrimitive.ItemIndicator className="absolute left-2 flex size-3.5 items-center justify-center">
      <Check className="size-4" />
    </ComboboxPrimitive.ItemIndicator>
  </ComboboxPrimitive.Item>
))
ComboboxItem.displayName = 'ComboboxItem'

const ComboboxGroup = ComboboxPrimitive.Group

const ComboboxLabel = React.forwardRef<
  HTMLDivElement,
  ComboboxPrimitive.GroupLabel.Props
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.GroupLabel
    ref={ref}
    data-slot="combobox-label"
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
))
ComboboxLabel.displayName = 'ComboboxLabel'

const ComboboxCollection = ComboboxPrimitive.Collection

const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  ComboboxPrimitive.Empty.Props
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Empty
    ref={ref}
    data-slot="combobox-empty"
    className={cn(
      'px-2 py-6 text-center text-sm text-muted-foreground',
      className,
    )}
    {...props}
  />
))
ComboboxEmpty.displayName = 'ComboboxEmpty'

const ComboboxSeparator = React.forwardRef<
  HTMLDivElement,
  ComboboxPrimitive.Separator.Props
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Separator
    ref={ref}
    data-slot="combobox-separator"
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
ComboboxSeparator.displayName = 'ComboboxSeparator'

const ComboboxChips = React.forwardRef<
  HTMLDivElement,
  ComboboxPrimitive.Chips.Props
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Chips
    ref={ref}
    data-slot="combobox-chips"
    className={cn(
      'flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2',
      className,
    )}
    {...props}
  />
))
ComboboxChips.displayName = 'ComboboxChips'

const ComboboxChip = React.forwardRef<
  HTMLDivElement,
  ComboboxPrimitive.Chip.Props & {
    showRemove?: boolean
  }
>(({ className, children, showRemove = true, ...props }, ref) => (
  <ComboboxPrimitive.Chip
    ref={ref}
    data-slot="combobox-chip"
    className={cn(
      'inline-flex items-center gap-1 rounded-sm bg-muted px-2 py-0.5 text-xs',
      className,
    )}
    {...props}
  >
    {children}
    {showRemove ? (
      <ComboboxPrimitive.ChipRemove
        render={<Button variant="ghost" size="icon" />}
        className="size-4 p-0"
        data-slot="combobox-chip-remove"
      >
        <X className="size-3" />
        <span className="sr-only">Remove</span>
      </ComboboxPrimitive.ChipRemove>
    ) : null}
  </ComboboxPrimitive.Chip>
))
ComboboxChip.displayName = 'ComboboxChip'

const ComboboxChipsInput = React.forwardRef<
  HTMLInputElement,
  ComboboxPrimitive.Input.Props
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Input
    ref={ref}
    data-slot="combobox-chip-input"
    className={cn(
      'min-w-16 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground',
      className,
    )}
    {...props}
  />
))
ComboboxChipsInput.displayName = 'ComboboxChipsInput'

const useComboboxAnchor = () => {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxClear,
  useComboboxAnchor,
}
