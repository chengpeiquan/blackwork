import React from 'react'
import { type IconProps } from './types'

export const ChevronsUp: React.FC<IconProps> = (props) => {
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
        d="m17 11l-5-5l-5 5m10 7l-5-5l-5 5"
      ></path>
    </svg>
  )
}
