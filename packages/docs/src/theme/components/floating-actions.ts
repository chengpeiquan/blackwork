import type { CSSProperties } from 'react'

const FLOATING_ACTION_SIZE = 40
const FLOATING_ACTION_GAP = 12
const FLOATING_ACTION_OFFSET = 20

export const getDocsFloatingActionStyle = (index = 0): CSSProperties => ({
  bottom: `${FLOATING_ACTION_OFFSET + index * (FLOATING_ACTION_SIZE + FLOATING_ACTION_GAP)}px`,
  height: `${FLOATING_ACTION_SIZE}px`,
  position: 'fixed',
  right: `${FLOATING_ACTION_OFFSET}px`,
  width: `${FLOATING_ACTION_SIZE}px`,
  zIndex: 10,
})
