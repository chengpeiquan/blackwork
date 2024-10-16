import React from 'react'
import { type IconProps } from './types'

export const Rss: React.FC<IconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2 2.75A.75.75 0 0 1 2.75 2C8.963 2 14 7.037 14 13.25a.75.75 0 0 1-1.5 0A9.75 9.75 0 0 0 2.75 3.5A.75.75 0 0 1 2 2.75m0 4.5a.75.75 0 0 1 .75-.75a6.75 6.75 0 0 1 6.75 6.75a.75.75 0 0 1-1.5 0C8 10.35 5.65 8 2.75 8A.75.75 0 0 1 2 7.25M3.5 11a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}
