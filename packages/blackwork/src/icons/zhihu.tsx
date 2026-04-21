import React from 'react'
import { type IconProps } from './types'

export const ZhiHu: React.FC<IconProps> = (props) => {
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
        d="M14 6h6v12h-2l-2 2l-1-2h-1zM4 12h6.5m0-6h-5M6 4c-.5 2.5-1.5 3.5-2.5 4.5M8 6v7c0 4.5-2 5.5-4 7m7-2l-3-5"
      ></path>
    </svg>
  )
}
