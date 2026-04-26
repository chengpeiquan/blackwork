import typography from '@tailwindcss/typography'
import { createBlackworkTailwindConfig } from 'blackwork/tailwind-config'
import animate from 'tailwindcss-animate'

export default createBlackworkTailwindConfig({
  rootDir: import.meta.url,
  content: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx,md,mdx}'],
  packageNames: ['@blackwork/docs'],
  plugins: [typography, animate],
})
