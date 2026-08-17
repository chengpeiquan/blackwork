import { withBlackworkDocs } from '@blackwork/docs/next'
import type { NextConfig } from 'next'

const isStaticExport = process.env.NEXT_OUTPUT === 'export'
const distDir = process.env.NEXT_DIST_DIR

const nextConfig: NextConfig = {
  distDir: distDir || undefined,
  images: {
    unoptimized: true,
  },
  output: isStaticExport ? 'export' : undefined,
  trailingSlash: isStaticExport,
  transpilePackages: ['blackwork'],
}

export default withBlackworkDocs()(nextConfig)
