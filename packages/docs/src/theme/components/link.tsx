import Link from 'next/link'
import React from 'react'
import type { DocsThemeLinkProps } from '../types'

export interface DefaultDocsLinkProps extends DocsThemeLinkProps {}

export const DefaultDocsLink: React.FC<DefaultDocsLinkProps> = ({
  children,
  href,
  ...props
}) => {
  return (
    <Link href={href} scroll={false} {...props}>
      {children}
    </Link>
  )
}
