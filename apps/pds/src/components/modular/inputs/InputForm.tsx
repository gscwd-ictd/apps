import { MutableRefObject } from 'react'
import { MyComponentSize } from '../../../types/components/attributes'
import { MyTextFieldType } from '../../../types/components/textfield'
import { MyTextFieldComponentVariant } from '../select/SelectList'

export interface MyInputFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
  withLabel: boolean
  labelIsRequired?: boolean
  inputSize?: MyComponentSize
}

export const background = {
  default: '',
  primary: 'bg-white',
  secondary: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-rose-50',
  light: 'bg-white',
  simple: 'bg-slate-100',
}

export const border = {
  default: 'rounded-md border border-gray-200',
  primary: 'rounded-md border border-gray-200',
  secondary: 'rounded-md border border-emerald-700',
  warning: 'rounded-md border border-orange-600',
  danger: 'rounded-md border border-rose-600',
  light: 'rounded-md border-slate-200',
  simple: 'rounded-md border-white',
}

export const focus = {
  default: 'focus:ring focus:border-gray-500 focus:ring-gray-100',
  primary: 'focus:ring focus:border-gray-700 focus:ring-indigo-100',
  secondary: 'focus:ring focus:border-emerald-600 focus:ring-green-100',
  warning: 'focus:ring focus:border-orange-500 focus:ring-orange-100',
  danger: 'focus:ring focus:border-rose-600 focus:ring-rose-100',
  light: 'focus:ring focus:border-indigo-600 focus:ring-0',
  simple: 'focus:ring focus:border-indigo-600 focus:ring-0',
}

export const focusWithin = {
  default: 'focus-within:ring-1 focus-within:border focus-within:border-gray-500 focus-within:ring-gray-100',
  primary: 'focus-within:ring-1  focus-within:border focus-within:border-indigo-700 focus-within:ring-indigo-100',
  secondary: 'focus-within:ring-1 focus-within:border focus-within:border-emerald-600 focus-within:ring-green-100',
  warning: 'focus-within:ring-1 focus-within:border focus-within:border-orange-500 focus-within:ring-orange-100',
  danger: 'focus-within:ring-1 focus-within:border focus-within:border-rose-600 focus-within:ring-rose-100',
  light: 'focus-within:ring-1 focus-within:border focus-within:border-indigo-500 focus-within:ring-indigo-100',
  simple: '',
}

export const size = {
  xs: 'px-4 py-1 text-xs font-light',
  sm: 'px-4 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-4 py-4 text-lg',
}

export const InputForm = ({
  id,
  name,
  label,
  type,
  innerRef,
  placeholder = 'placeholder',
  className = '',
  variant = 'simple',
  fluid = true,
  muted = false,
  //   rfRegister,
  withLabel = true,
  inputSize = 'md',
  labelIsRequired = false,
  ...props
}: MyInputFormProps): JSX.Element => {
  return (
    <>
      {withLabel ? (
        <label htmlFor={id} className="flex px-4 font-medium text-gray-600 select-none">
          {labelIsRequired ? (
            <>
              <div className="text-red-500">*</div>
            </>
          ) : (
            <></>
          )}
          {label}
        </label>
      ) : (
        <></>
      )}

      <input
        id={id}
        type={type}
        readOnly={muted}
        placeholder={placeholder}
        {...props}
        className={`${className} ${fluid ? 'w-full' : ''} ${border[variant]} ${focus[variant]} ${focusWithin[variant]}  ${muted ? `cursor-not-allowed bg-slate-100 focus:border-slate-200 focus:ring-0` : `${background[variant]}`
          } ${size[inputSize]} border-gray-300 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none`}
      />
    </>
  )
}
