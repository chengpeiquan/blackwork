import React from 'react'
import { type IconProps } from './types'

export const Npm: React.FC<IconProps> = (props) => {
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
        d="M1 2.885C1 1.844 1.844 1 2.885 1h10.23C14.156 1 15 1.844 15 2.885v10.23A1.885 1.885 0 0 1 13.115 15H2.885A1.885 1.885 0 0 1 1 13.115zm1.885-.27a.27.27 0 0 0-.27.27v10.23c0 .15.12.27.27.27h5.653v-7a.808.808 0 1 1 1.616 0v7h2.961a.27.27 0 0 0 .27-.27V2.885a.27.27 0 0 0-.27-.27z"
      ></path>
    </svg>
  )
}
