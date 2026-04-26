import type React from 'react'

export type DocsCodeBlockProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLPreElement> & {
    node?: unknown
  }
>

export const DocsCodeBlock = ({
  children,
  className,
  node: _node,
  ...props
}: DocsCodeBlockProps) => {
  return (
    <div
      data-docs-region="mdx-code-block"
      className="not-prose my-6 overflow-x-auto rounded-xl border border-border/60 bg-card"
    >
      <pre
        {...props}
        className={['m-0 bg-transparent p-4 text-[13px] leading-6', className]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </pre>
    </div>
  )
}
