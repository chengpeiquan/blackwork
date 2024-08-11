export interface GeneratePagesOptions {
  currentPage: number
  totalPages: number

  /**
   * The page number range to be displayed on the left
   * and right sides of the current page number
   *
   * @default 2
   */
  delta?: number
}

export enum GeneratedPageType {
  Previous = 'previous',
  Page = 'page',
  Ellipsis = 'ellipsis',
  Next = 'next',
}

export interface GeneratedPageItem {
  type: GeneratedPageType
  page?: number
}

export const generatePages = ({
  currentPage,
  totalPages,
  delta = 2,
}: GeneratePagesOptions) => {
  const pages: GeneratedPageItem[] = []

  pages.push({ type: GeneratedPageType.Previous, page: currentPage - 1 })

  let leftEllipsisShown = false
  let rightEllipsisShown = false

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push({ type: GeneratedPageType.Page, page: i })
    } else if (i < currentPage - delta && !leftEllipsisShown) {
      pages.push({ type: GeneratedPageType.Ellipsis })
      leftEllipsisShown = true
    } else if (i > currentPage + delta && !rightEllipsisShown) {
      pages.push({ type: GeneratedPageType.Ellipsis })
      rightEllipsisShown = true
    }
  }

  pages.push({ type: GeneratedPageType.Next, page: currentPage + 1 })

  return pages
}
