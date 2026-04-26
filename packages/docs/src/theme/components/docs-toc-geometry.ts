export interface DocsTocTrackMetric {
  bottom: number
  depth: number
  id: string
  top: number
}

export interface DocsTocTrackPosition extends DocsTocTrackMetric {
  x: number
}

export interface DocsTocTrackGeometry {
  height: number
  path: string
  positions: DocsTocTrackPosition[]
  width: number
}

const TOC_CURVE_SPREAD = 4
const TOC_GUIDE_BASE_OFFSET = 8
const TOC_GUIDE_STEP = 8
const TOC_ITEM_BASE_PADDING = 20
const TOC_ITEM_PADDING_STEP = 12

export const getTocGuideOffset = (depth: number) =>
  TOC_GUIDE_BASE_OFFSET + Math.max(depth - 2, 0) * TOC_GUIDE_STEP

export const getTocItemPadding = (depth: number) =>
  TOC_ITEM_BASE_PADDING + Math.max(depth - 2, 0) * TOC_ITEM_PADDING_STEP

export function buildTocTrackGeometry(
  items: DocsTocTrackMetric[],
): DocsTocTrackGeometry {
  const positions: DocsTocTrackPosition[] = []
  let height = 1
  let path = ''
  let width = 1

  items.forEach((item, index) => {
    const x = getTocGuideOffset(item.depth) + 0.5
    const position: DocsTocTrackPosition = {
      ...item,
      x,
    }

    height = Math.max(height, item.bottom)
    width = Math.max(width, x + TOC_GUIDE_BASE_OFFSET)

    if (index === 0) {
      path += `M${x} ${item.top} L${x} ${item.bottom}`
    } else {
      const upper = positions[index - 1]
      path += ` C ${upper.x} ${item.top - TOC_CURVE_SPREAD} ${x} ${
        upper.bottom + TOC_CURVE_SPREAD
      } ${x} ${item.top} L${x} ${item.bottom}`
    }

    positions.push(position)
  })

  return {
    height,
    path,
    positions,
    width,
  }
}
