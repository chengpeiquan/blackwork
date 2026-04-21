import React from 'react'

export interface ExternalLinkProps {
  className?: string
  href: string
  title?: string
  ariaLabel?: string
  children: React.ReactNode
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  className,
  href,
  title,
  ariaLabel,
  children,
}) => {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}
