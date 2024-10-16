import React from 'react'
import { type IconProps } from './types'

export const ArrowUpFromLine: React.FC<IconProps> = (props) => {
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
        d="m18 9l-6-6l-6 6m6-6v14m-7 4h14"
      ></path>
    </svg>
  )
}
