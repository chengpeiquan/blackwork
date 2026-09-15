'use client'

import { isBrowser, isFunction } from '@bassist/utils'
import { Search, X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/utils'
import { Button } from './button'
import { Dialog, DialogClose, DialogContent, DialogTitle } from './dialog'
import { ScrollArea } from './scroll-area'

const QuickSearchAppearance = React.createContext({
  glass: false,
  closeLabel: 'Close',
})

const QuickSearch = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex size-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    )}
    {...props}
  />
))

QuickSearch.displayName = 'QuickSearch'

export interface QuickSearchTriggerProps {
  appearance?: 'default' | 'glass'
  className?: string
  kbdClassName?: string
  label?: React.ReactNode
  shortLabel?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const QuickSearchTrigger = ({
  className,
  kbdClassName,
  appearance = 'default',
  label = 'QuickSearch documentation...',
  shortLabel = 'QuickSearch...',
  onClick,
}: QuickSearchTriggerProps) => {
  return (
    <Button
      variant={appearance === 'glass' ? 'glass' : 'outline'}
      className={cn(
        'relative h-8 w-full justify-start rounded-lg bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64',
        appearance === 'glass' && 'bw-glass-search-trigger',
        className,
      )}
      onClick={onClick}
    >
      {appearance === 'glass' && (
        <Search className="size-4 shrink-0" aria-hidden="true" />
      )}
      <span className="hidden lg:inline-flex">{label}</span>
      <span className="inline-flex lg:hidden">{shortLabel}</span>

      <kbd
        className={cn(
          'pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded-sm border bg-muted px-1.5 font-mono text-[10px] font-medium text-black opacity-100 shadow-sm sm:flex dark:bg-black dark:text-white',
          appearance === 'glass' && 'bw-glass-shortcut',
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

export interface QuickSearchDialogProps extends React.ComponentPropsWithoutRef<
  typeof Dialog
> {
  appearance?: 'default' | 'glass'
  closeLabel?: string
  ariaLabel?: string
  contentProps?: React.ComponentPropsWithoutRef<typeof DialogContent>
}

const QuickSearchDialog = ({
  ariaLabel = 'Search',
  appearance = 'default',
  closeLabel = 'Close',
  contentProps = {},
  children,
  ...props
}: QuickSearchDialogProps) => {
  const { className, ...rest } = contentProps

  return (
    <Dialog {...props}>
      <DialogContent
        appearance={appearance}
        closeButtonVisible={appearance !== 'glass'}
        closeLabel={closeLabel}
        className={cn(
          'max-w-xl overflow-hidden p-0 shadow-lg',
          appearance === 'glass'
            ? 'bw-glass-quick-search'
            : 'data-closed:animate-none! data-open:animate-none!',
          className,
        )}
        {...rest}
      >
        <DialogTitle className="sr-only">{ariaLabel}</DialogTitle>
        <QuickSearchAppearance.Provider
          value={{ glass: appearance === 'glass', closeLabel }}
        >
          <QuickSearch
            className={
              appearance === 'glass'
                ? 'bw-glass-quick-search-content'
                : undefined
            }
          >
            {children as React.ReactNode}
          </QuickSearch>
        </QuickSearchAppearance.Provider>
      </DialogContent>
    </Dialog>
  )
}

QuickSearchDialog.displayName = 'QuickSearchDialog'

const QuickSearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    appearance?: 'default' | 'glass'
  }
>(({ className, appearance, autoFocus = true, ...props }, ref) => {
  const context = React.useContext(QuickSearchAppearance)
  const glass = appearance ? appearance === 'glass' : context.glass
  return (
    <div
      className={cn(
        'flex items-center border-b px-3',
        glass && 'bw-glass-search-field',
      )}
    >
      <Search className="size-5 shrink-0 text-muted-foreground" />
      <input
        ref={ref}
        className={cn(
          'flex h-12 min-w-0 flex-1 rounded-md border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          glass ? 'mx-3' : 'mr-8 ml-2',
          className,
        )}
        autoFocus={autoFocus}
        {...props}
      />
      {context.glass && (
        <DialogClose asChild>
          <Button
            variant="glass"
            size="icon"
            aria-label={context.closeLabel}
            title={context.closeLabel}
          >
            <X className="size-4" />
          </Button>
        </DialogClose>
      )}
    </div>
  )
})

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
      'flex h-[480px] w-full flex-col overflow-y-auto overflow-x-hidden',
      className,
    )}
    {...props}
  >
    <ScrollArea className={cn('box-border size-full p-3', scrollClassName)}>
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
      'flex size-full items-center justify-center text-center text-sm text-muted-foreground',
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
  /** Shortcut key or shortcut key combination to activate the search dialog */
  isActiveHotkey?: (e: KeyboardEvent) => boolean
}

const useQuickSearchState = ({
  isActiveHotkey,
}: QuickSearchStateOptions = {}) => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
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
