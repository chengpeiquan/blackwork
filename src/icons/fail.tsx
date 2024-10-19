import React from 'react'
import { type IconProps } from './types'

export const Fail: React.FC<IconProps> = (props) => {
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
        strokeWidth="1.5"
        d="M12 18h.012M8.25 15c2-2 5.5-2 7.5 0m2.75-3a11 11 0 0 0-.231-.199M5.5 12c2.564-2.136 5.634-2.904 8.5-2.301M2 9c3.466-2.927 7.248-4.247 11-3.962M22 5l-6 6m6 0l-6-6"
        color="currentColor"
      ></path>
    </svg>
  )
}
