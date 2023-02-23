import React, { MutableRefObject, Ref } from 'react'
import { ValidationRule } from 'react-hook-form'
import { MyComponentSize, MyTextFieldComponentVariant } from './attributes'

export type MyTextFieldType = 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel' | 'date' | 'textarea' | 'checkbox'

export interface MyFloatingLabelTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  placeholder: string
  className?: string
  innerRef?: MutableRefObject<any>
  type: MyTextFieldType
  variant?: MyTextFieldComponentVariant
  fluid?: boolean
  muted?: boolean
}

export interface MyTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  className?: string
  placeholder: string
  type: MyTextFieldType
  innerRef?: MutableRefObject<any>
  fluid?: boolean
  muted?: boolean
  variant?: MyTextFieldComponentVariant
  inputSize?: MyComponentSize
}

export interface MyInputReactFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  label: string
  placeholder: string
  className?: string
  innerRef?: MutableRefObject<any>
  type: MyTextFieldType
  variant?: MyTextFieldComponentVariant
  fluid?: boolean
  muted?: boolean
  rfRegister: any
  withLabel: boolean
  labelIsRequired?: boolean
  inputSize?: MyComponentSize
}
