import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

export interface MyButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  action?: Function
  type?: 'button' | 'submit' | 'reset'
  formId?: string
}
