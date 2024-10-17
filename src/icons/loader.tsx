import React from 'react'
import { cn } from '@/utils'
import { type IconProps } from './types'

export const Loader: React.FC<IconProps> = ({ className, ...props }) => {
  const cls = cn(className, 'animate-spin')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={cls}
      {...props}
    >
      <defs>
        <linearGradient
          id="mingcuteLoadingLine0"
          x1="50%"
          x2="50%"
          y1="5.271%"
          y2="91.793%"
        >
          <stop offset="0%" stopColor="currentColor"></stop>
          <stop offset="100%" stopColor="currentColor" stopOpacity=".55"></stop>
        </linearGradient>
        <linearGradient
          id="mingcuteLoadingLine1"
          x1="50%"
          x2="50%"
          y1="8.877%"
          y2="90.415%"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="0"></stop>
          <stop offset="100%" stopColor="currentColor" stopOpacity=".55"></stop>
        </linearGradient>
      </defs>
      <g fill="none">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
        <path
          fill="url(#mingcuteLoadingLine0)"
          d="M8.886.006a1 1 0 0 1 .22 1.988A8.001 8.001 0 0 0 10 17.944v2c-5.523 0-10-4.476-10-10C0 4.838 3.848.566 8.886.007Z"
          transform="translate(2 2.055)"
        ></path>
        <path
          fill="url(#mingcuteLoadingLine1)"
          d="M14.322 1.985a1 1 0 0 1 1.392-.248A9.99 9.99 0 0 1 20 9.945c0 5.523-4.477 10-10 10v-2a8 8 0 0 0 4.57-14.567a1 1 0 0 1-.248-1.393"
          transform="translate(2 2.055)"
        ></path>
      </g>
    </svg>
  )
}
