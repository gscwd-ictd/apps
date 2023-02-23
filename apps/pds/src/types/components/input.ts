import React, { MutableRefObject } from 'react'
import { MyPdsFormValuesType } from '../data/forms'
import { MyComponentSize, MyTextFieldComponentVariant } from './attributes'
import { MyTextFieldType } from './textfield'

export interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  label: string
  className?: string
  placeholder: string
  type: MyTextFieldType
  fluid?: boolean
  innerRef?: MutableRefObject<any>
  muted?: boolean
  variant?: MyTextFieldComponentVariant
  inputSize?: MyComponentSize
}

export interface MyInputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  label: string
  className?: string
  placeholder: string
  type: MyTextFieldType
  setValue: any
  control: any
  rules?: any
  fluid?: boolean
  muted?: boolean
  variant?: MyTextFieldComponentVariant
  inputSize?: MyComponentSize
}

export interface MyInputFieldOnlyFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: MyPdsFormValuesType
  className?: string
  placeholder: string
  type: MyTextFieldType
  // formType?: MyComponentFormValues;
  setValue: any
  control: any
  rules?: any
  fluid?: boolean
  muted?: boolean
  variant?: MyTextFieldComponentVariant
  inputSize?: MyComponentSize
}

export interface MyInputFloatingProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: MyPdsFormValuesType
  placeholder: string
  className?: string
  innerRef?: MutableRefObject<any>
  type: MyTextFieldType
  variant?: MyTextFieldComponentVariant
  fluid?: boolean
  muted?: boolean
  //
  setValue: any
  control: any
  rules?: any
}
