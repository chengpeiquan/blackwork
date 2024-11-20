import React from 'react'
import { type IconProps } from './types'

export const Toc: React.FC<IconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 12H3m13 6H3M16 6H3m18 6h.01M21 18h.01M21 6h.01"
      ></path>
    </svg>
  )
}
