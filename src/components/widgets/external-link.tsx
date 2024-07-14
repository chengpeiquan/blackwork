import React from 'react'

export interface ExternalLinkProps {
  className?: string
  href: string
  children: React.ReactNode
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  className,
  href,
  children,
}) => {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      {children}
    </a>
  )
}
