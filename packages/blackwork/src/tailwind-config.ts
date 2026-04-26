import { existsSync, realpathSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export const theme: NonNullable<Config['theme']> = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px',
    },
  },
  extend: {
    screens: {
      '2xs': '320px',
      xs: '480px',
    },
    colors: {
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))',
      },
    },
    borderRadius: {
      lg: `var(--radius)`,
      md: `calc(var(--radius) - 2px)`,
      sm: 'calc(var(--radius) - 4px)',
    },
    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
    },
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
}

const defaultPackageContentGlobs = {
  distGlob: 'dist/**/*.{js,mjs,cjs}',
  srcGlob: 'src/**/*.{js,mjs,cjs,ts,jsx,tsx,md,mdx}',
}

const toDirectoryPath = (rootDir: string) => {
  const filePath = rootDir.startsWith('file:')
    ? fileURLToPath(rootDir)
    : rootDir

  return filePath.endsWith('.ts') ||
    filePath.endsWith('.js') ||
    filePath.endsWith('.mjs')
    ? dirname(filePath)
    : filePath
}

const resolvePackageContentGlob = (
  rootDir: string,
  packageName: string,
  options = defaultPackageContentGlobs,
) => {
  const packageRoot = realpathSync(
    resolve(rootDir, 'node_modules', packageName),
  )

  if (existsSync(join(packageRoot, 'src'))) {
    return join(packageRoot, options.srcGlob)
  }

  return join(packageRoot, options.distGlob)
}

export interface CreateBlackworkTailwindConfigOptions {
  content: string[]
  darkMode?: Config['darkMode']
  packageNames?: string[]
  plugins?: NonNullable<Config['plugins']>
  rootDir: string
}

export const createBlackworkTailwindConfig = ({
  content,
  darkMode = 'selector',
  packageNames = [],
  plugins = [],
  rootDir,
}: CreateBlackworkTailwindConfigOptions): Config => {
  const resolvedRootDir = toDirectoryPath(rootDir)
  const resolvedPackageNames = ['blackwork', ...packageNames]

  return {
    darkMode,
    content: [
      ...content.map((pattern) => join(resolvedRootDir, pattern)),
      ...resolvedPackageNames.map((packageName) =>
        resolvePackageContentGlob(resolvedRootDir, packageName),
      ),
    ],
    theme,
    plugins,
  }
}
