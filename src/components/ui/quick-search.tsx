'use client'

import * as React from 'react'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

import { Button } from './button'
import { Dialog, DialogContent, DialogTitle } from './dialog'
import { ScrollArea } from './scroll-area'

import { Search } from '@/icons'
import { cn } from '@/utils'
import { isBrowser, isFunction } from '@bassist/utils'

const QuickSearch = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    )}
    {...props}
  />
))

QuickSearch.displayName = 'QuickSearch'

export interface QuickSearchTriggerProps {
  className?: string
  kbdClassName?: string
  label?: React.ReactNode
  shortLabel?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const QuickSearchTrigger = ({
  className,
  kbdClassName,
  label = 'QuickSearch documentation...',
  shortLabel = 'QuickSearch...',
  onClick,
}: QuickSearchTriggerProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        'relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64',
        className,
      )}
      onClick={onClick}
    >
      <span className="hidden lg:inline-flex">{label}</span>
      <span className="inline-flex lg:hidden">{shortLabel}.</span>

      <kbd
        className={cn(
          'pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium !text-xs opacity-100 sm:flex bg-white dark:bg-black text-black dark:text-white shadow-sm',
          kbdClassName,
        )}
        style={{ fontFamily: 'inherit' }}
      >
        ⌘K
      </kbd>
    </Button>
  )
}

QuickSearchTrigger.displayName = 'QuickSearchTrigger'

export interface QuickSearchDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  ariaLabel?: string
  contentProps?: React.ComponentPropsWithoutRef<typeof DialogContent>
}

const QuickSearchDialog = ({
  ariaLabel = 'Search',
  contentProps = {},
  children,
  ...props
}: QuickSearchDialogProps) => {
  const { className, ...rest } = contentProps

  return (
    <Dialog {...props}>
      <DialogContent
        className={cn('max-w-xl overflow-hidden p-0 shadow-lg', className)}
        {...rest}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{ariaLabel}</DialogTitle>
        </VisuallyHidden.Root>
        <QuickSearch>{children}</QuickSearch>
      </DialogContent>
    </Dialog>
  )
}

QuickSearchDialog.displayName = 'QuickSearchDialog'

const QuickSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, autoFocus = true, ...props }, ref) => (
  <div className="flex items-center border-b px-3">
    <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />

    <input
      ref={ref}
      className={cn(
        'flex flex-1 h-12 rounded-md bg-transparent py-3 mr-[32px] text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0',
        className,
      )}
      autoFocus={autoFocus}
      {...props}
    />
  </div>
))

QuickSearchInput.displayName = 'QuickSearchInput'

const QuickSearchList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    scrollClassName?: string
  }
>(({ className, scrollClassName, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col w-full h-[480px] overflow-y-auto overflow-x-hidden',
      className,
    )}
    {...props}
  >
    <ScrollArea className={cn('w-full h-full box-border p-3', scrollClassName)}>
      {children}
    </ScrollArea>
  </div>
))

QuickSearchList.displayName = 'QuickSearchList'

const QuickSearchEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-center w-full h-full text-center text-sm text-muted-foreground',
      className,
    )}
    {...props}
  />
))

QuickSearchEmpty.displayName = 'QuickSearchEmpty'

const QuickSearchItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm p-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
      className,
    )}
    {...props}
  />
))

QuickSearchItem.displayName = 'QuickSearchItem'

export interface QuickSearchStateOptions {
  /**
   * Shortcut key or shortcut key combination
   * to activate the search dialog
   */
  isActiveHotkey?: (e: KeyboardEvent) => boolean
}

const useQuickSearchState = ({
  isActiveHotkey,
}: QuickSearchStateOptions = {}) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isBrowser) return

    const down = (e: KeyboardEvent) => {
      const isActive = isFunction(isActiveHotkey)
        ? isActiveHotkey(e)
        : e.key === 'k' && (e.metaKey || e.ctrlKey)

      if (isActive) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isActiveHotkey])

  return {
    open,
    setOpen,
  }
}

export {
  QuickSearch,
  QuickSearchTrigger,
  QuickSearchDialog,
  QuickSearchInput,
  QuickSearchList,
  QuickSearchEmpty,
  QuickSearchItem,
  useQuickSearchState,
}
