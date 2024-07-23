import React from 'react'
import { isObject, isUndefined } from '@bassist/utils'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui'
import * as Icons from './icons'

export interface LanguageToggleOption {
  value: string
  label?: React.ReactNode
  icon?: React.ReactNode
  onClick?: (value: string) => void
}

export interface LanguageToggleProps {
  title?: string
  ariaLabel?: string
  defaultValue?: string
  options: LanguageToggleOption[] | LanguageToggleOption
}

const isSingle = (v: unknown): v is LanguageToggleOption => isObject(v)

const DefaultIcon: React.FC = () => (
  <Icons.Language className="h-5 w-5 rotate-0 scale-100 transition-all" />
)

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  title,
  ariaLabel,
  defaultValue,
  options,
}) => {
  const icon = useMemo(() => {
    if (!isUndefined(defaultValue)) {
      const currentOption = isSingle(options)
        ? options
        : options?.find((i) => i.value === defaultValue)
      if (!currentOption) return <DefaultIcon />

      return currentOption?.icon || <DefaultIcon />
    }

    return <DefaultIcon />
  }, [defaultValue, options])

  if (isSingle(options)) {
    return (
      <Button
        variant="ghost"
        size="icon"
        title={title}
        aria-label={ariaLabel || title}
        onClick={() => options.onClick?.(options.value)}
      >
        {icon}
        <span className="sr-only">Toggle Language</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={title}
          aria-label={ariaLabel || title}
        >
          {icon}
          <span className="sr-only">Toggle Language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {options.map((i) => {
          return (
            <DropdownMenuItem
              key={i.value}
              className="gap-2"
              defaultChecked={i.value === defaultValue}
              onClick={() => i.onClick?.(i.value)}
            >
              {i.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
