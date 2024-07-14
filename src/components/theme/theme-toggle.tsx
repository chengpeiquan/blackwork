import React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { capitalize, isArray } from '@bassist/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from './theme-provider'
import { type Theme } from './types'

export interface ThemeToggleOption {
  value: Theme
  label: React.ReactNode
  icon?: React.ReactNode
}

export const defaultThemeToggleValues: Readonly<Theme[]> = [
  'light',
  'dark',
  'system',
]

export const defaultThemeToggleIconMap: Readonly<
  Record<Theme, React.ReactNode>
> = {
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Monitor className="h-4 w-4" />,
}

export const defaultThemeToggleOptions =
  defaultThemeToggleValues.map<ThemeToggleOption>((value) => {
    return {
      value,
      label: capitalize(value),
      icon: defaultThemeToggleIconMap[value],
    }
  })

export interface ThemeToggleProps {
  /**
   * If you only need light / dark, or i18n support,
   * you can customize the rendering
   */
  options?: ThemeToggleOption[]
}

/**
 * Provides theme toggle based on dropdown menu
 *
 * @description
 *    If the icon change does not take effect,
 *    please check if the `darkMode` option value is `selector`
 *    in `tailwind.config.ts`
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  options: customOptions,
}) => {
  const { setTheme } = useTheme()

  const options = useMemo(() => {
    if (isArray(customOptions)) return customOptions
    return defaultThemeToggleOptions
  }, [customOptions])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {options.map((i) => {
          return (
            <DropdownMenuItem
              key={i.value}
              className="gap-2"
              onClick={() => setTheme(i.value)}
            >
              {i.icon}
              {i.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
