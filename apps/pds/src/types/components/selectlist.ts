import React, { MutableRefObject } from 'react'
import { Address } from '../data/address.type'
import { MyPdsFormSelectListValuesType } from '../data/forms'
import { MyTextFieldComponentVariant } from './attributes'

export interface MySelectFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  className?: string
  items: string
}

export type MySelectListType =
  | 'gender'
  | 'civilStatus'
  | 'dualCitizenshipType'
  | 'bloodType'
  | 'highschool'
  | 'eligibility'
  | 'salaryGrade'
  | 'govtService'
  | 'appointmentStatus'
  | 'lndType'
  | 'govtId'
  | 'highschool'
  | 'secondary'
  | 'juniorhighschool'
  | 'seniorhighschool'
  | 'country'

export type MySelectListAppearance = 'form' | 'modal'

type MyVariant = 'default' | 'primary' | 'secondary' | 'warning' | 'danger' | 'light' | 'simple'

export interface MySelectListProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id?: MySelectListType
  name: string
  className?: string
  selectList: Array<string>
  defaultOption: string
  listHeight?: string
  appearance: MySelectListAppearance
  muted?: boolean
  variant?: MyTextFieldComponentVariant
}

export interface MyPlainSelectListProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id?: MySelectListType
  name?: string
  className?: string
  listHeight?: string
  appearance: MySelectListAppearance
  muted?: boolean
  variant?: MyTextFieldComponentVariant
}

export interface MySelectListReactFormProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id?: MySelectListType
  name: MyPdsFormSelectListValuesType
  selectList?: MyPdsFormSelectListValuesType
  options: Array<any>
  className?: string
  listHeight?: string
  appearance: MySelectListAppearance
  setValue: any
  getValue?: any
  control: any
  rules?: any
  muted?: boolean
  variant?: MyTextFieldComponentVariant
}

export interface MySelectListAddressProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  id?: string
  name: string
}

export interface MySelectProvinceProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  id?: string
  name: string
  codeVariable: Address
  rfRegister?: any
  dispatchCodeVariable: any
  isError?: boolean
  innerRef?: MutableRefObject<any>
  variant?: MyVariant
}

export interface MySelectCityProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  id?: string
  name: string
  codeVariable: Address
  rfRegister?: any
  dispatchCodeVariable: any
  isError?: boolean
  innerRef?: MutableRefObject<any>
  variant?: MyVariant
}

export interface MySelectBrgyProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  id?: string
  name: string
  codeVariable: Address
  dispatchCodeVariable: any
  isError?: boolean
  rfRegister?: any
  innerRef?: MutableRefObject<any>
  variant?: MyVariant
}
