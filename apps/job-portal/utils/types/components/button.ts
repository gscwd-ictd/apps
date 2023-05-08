import React, { MutableRefObject } from 'react'
import { MyButtonComponentVariant, MyComponentSize } from './attributes'

export interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  btnLabel: string
  btnSize?: MyComponentSize
  variant?: MyButtonComponentVariant
  fluid?: boolean
  shadow?: boolean
  height?: string
  width?: string
  muted?: boolean
  innerRef?: MutableRefObject<HTMLButtonElement>
}
