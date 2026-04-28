export interface DocsRailScrollMetrics {
  scrollTop: number
  clientHeight: number
  scrollHeight: number
}

export interface DocsRailFadeState {
  bottomVisible: boolean
  topVisible: boolean
}

const SCROLL_EPSILON = 1

export const getDocsRailFadeState = ({
  scrollTop,
  clientHeight,
  scrollHeight,
}: DocsRailScrollMetrics): DocsRailFadeState => {
  const maxScrollTop = Math.max(scrollHeight - clientHeight, 0)

  if (maxScrollTop <= SCROLL_EPSILON) {
    return {
      bottomVisible: false,
      topVisible: false,
    }
  }

  return {
    bottomVisible: maxScrollTop - scrollTop > SCROLL_EPSILON,
    topVisible: scrollTop > SCROLL_EPSILON,
  }
}
