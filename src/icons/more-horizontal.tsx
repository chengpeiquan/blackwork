import React from 'react'
import { type IconProps } from './types'

export const MoreHorizontal: React.FC<IconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="4" cy="12" r="1"></circle>
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="20" cy="12" r="1"></circle>
      </g>
    </svg>
  )
}
