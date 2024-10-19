import React from 'react'
import { Input, type InputProps } from '@/components/ui'
import { Search } from '@/icons'
import { cn } from '@/utils'

export interface SearchInputProps extends Omit<InputProps, 'type'> {
  searchIconClassName?: string
  inputClassName?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
}

export const SearchInput: React.FC<SearchInputProps> = ({
  inputRef,
  className,
  searchIconClassName,
  inputClassName,
  placeholder = 'Search...',
  ...rest
}) => {
  const cls = cn('relative', className)

  const searchIconCls = cn(
    'absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground',
    searchIconClassName,
  )

  const inputCls = cn(
    'w-full rounded-lg bg-background box-border pl-9 md:w-[200px] lg:w-[336px]',
    inputClassName,
  )

  return (
    <div className={cls}>
      <Search className={searchIconCls} />

      <Input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        className={inputCls}
        {...rest}
      />
    </div>
  )
}
