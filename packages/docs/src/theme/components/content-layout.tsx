import React from 'react'

export interface DefaultContentLayoutProps {
  children: React.ReactNode
  contentTocVisible?: boolean
  footer?: React.ReactNode
  headerMeta?: React.ReactNode
  pagefindFilterEntries?: string[]
  title: React.ReactNode
}

export const DefaultContentLayout: React.FC<DefaultContentLayoutProps> = ({
  children,
  contentTocVisible = false,
  footer,
  headerMeta,
  pagefindFilterEntries = [],
  title,
}) => {
  return (
    <main
      data-docs-region="content-shell"
      className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-6 py-8 sm:px-8 xl:flex-row xl:items-start xl:gap-12 xl:px-10 2xl:gap-16 2xl:px-12"
    >
      {contentTocVisible ? (
        <div aria-hidden="true" className="hidden w-64 shrink-0 xl:block" />
      ) : null}

      <div className="flex min-w-0 flex-1 justify-center">
        <div className="flex w-full max-w-4xl flex-col gap-8">
          <div
            data-docs-region="article-content"
            data-pagefind-body=""
            className="flex flex-col gap-8"
          >
            <div hidden>
              {pagefindFilterEntries.map((filter) => (
                <span key={filter} data-pagefind-filter={filter} />
              ))}
            </div>

            <header
              data-docs-region="article-header"
              className="flex flex-col gap-5"
            >
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>

              {headerMeta ? (
                <div data-docs-region="article-header-meta">{headerMeta}</div>
              ) : null}
            </header>

            <article
              data-docs-region="article-body"
              className="prose prose-neutral max-w-none dark:prose-invert"
            >
              {children}
            </article>
          </div>

          {footer}
        </div>
      </div>

      {contentTocVisible ? (
        <div aria-hidden="true" className="hidden w-64 shrink-0 xl:block" />
      ) : null}
    </main>
  )
}
