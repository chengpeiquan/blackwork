import { ExternalLink } from 'blackwork'
import Link from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type DocsMdxLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode
  href?: string
  node?: unknown
}

export const DocsMdxLink = ({
  children,
  href,
  node: _node,
  ...props
}: DocsMdxLinkProps) => {
  if (!href) {
    return children
  }

  if (href.startsWith('http')) {
    return (
      <ExternalLink href={href} {...props}>
        {children}
      </ExternalLink>
    )
  }

  if (
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  ) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} scroll={false} {...props}>
      {children}
    </Link>
  )
}
