import React from 'react'
import { type IconProps } from './types'

export const Help: React.FC<IconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 14 14"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13"></path>
        <path d="M5.25 5.25a1.75 1.75 0 0 1 2.093-1.717A1.752 1.752 0 0 1 8.62 5.92A1.75 1.75 0 0 1 7.002 7v1.167M7 10.459a.25.25 0 1 1 0-.5m0 .5a.25.25 0 1 0 0-.5"></path>
      </g>
    </svg>
  )
}
