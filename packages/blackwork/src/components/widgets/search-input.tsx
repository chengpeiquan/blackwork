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
    'text-muted-foreground absolute left-2.5 top-2.5 size-5',
    searchIconClassName,
  )

  const inputCls = cn(
    'bg-background box-border w-full rounded-lg pl-9 md:w-[200px] lg:w-[336px]',
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
