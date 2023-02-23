import { MutableRefObject } from 'react'
import { MyComponentSize } from '../../../types/components/attributes'
import { MyTextFieldType } from '../../../types/components/textfield'
import { MyPopover } from '../../fixed/popover/helppopover'

type MyTextFieldComponentVariant = 'default' | 'primary' | 'secondary' | 'warning' | 'danger' | 'light' | 'simple'

interface MyInputReactFormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  label?: string
  placeholder?: string
  className?: string
  innerRef?: MutableRefObject<any>
  type: MyTextFieldType
  variant?: MyTextFieldComponentVariant
  fluid?: boolean
  muted?: boolean
  controller?: any
  withLabel?: boolean
  labelIsRequired?: boolean
  inputSize?: MyComponentSize
  withHelpButton?: boolean
  helpContent?: string
  isError?: boolean
  errorMessage?: string
}

export const background = {
  default: '',
  primary: 'bg-white',
  secondary: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-rose-100',
  light: 'bg-white',
  simple: 'bg-white',
}

export const border = {
  default: 'rounded-xl border border-gray-300',
  primary: 'rounded-xl border border-gray-300',
  secondary: 'rounded-xl border border-emerald-700',
  warning: 'rounded-xl border border-orange-600',
  danger: 'rounded-xl border border-rose-600',
  light: 'rounded-xl border-slate-300',
  simple: 'rounded-xl border border-gray-200 ',
}

export const focus = {
  default: 'focus:ring focus:border focus:border-gray-500 focus:ring-gray-100',
  primary: 'focus:ring focus:border focus:border-gray-700 focus:ring-indigo-100',
  secondary: 'focus:ring focus:border  focus:border-emerald-600 focus:ring-green-100',
  warning: 'focus:ring focus:border focus:border-orange-500 focus:ring-orange-100',
  danger: 'focus:ring focus:border focus:border-rose-600 border focus:ring-rose-100',
  light: 'focus:ring-2 focus:border focus:border-indigo-600 focus:ring-0',
  simple: 'focus:border  focus:border-indigo-800 focus:border focus:ring-0',
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
  md: 'px-4 py-3 text-sm',
  lg: 'px-4 py-4 text-lg',
}

export const InputReactForm = ({
  id,
  name,
  label,
  type,
  innerRef,
  placeholder = '',
  className = '',
  variant = 'simple',
  fluid = true,
  muted = false,
  controller,
  withLabel = false,
  inputSize = 'md',
  labelIsRequired = false,
  withHelpButton = false,
  helpContent,
  isError = false,
  errorMessage,
  ...props
}: MyInputReactFormProps): JSX.Element => {
  return (
    <>
      {withLabel ? (
        <label htmlFor={id} className="flex pr-4 pl-1 text-sm tracking-wide text-gray-600 select-none">
          {label}{labelIsRequired ? (
            <>
              <div className="text-red-700">*</div>
            </>
          ) : (
            <></>
          )}
          &nbsp;
          {/*HELP BUTTON START*/}
          {withHelpButton ? <MyPopover text={helpContent} /> : <></>}
          {/*HELP BUTTON END*/}
        </label>
      ) : (
        <></>
      )}

      <input
        id={id}
        type={type}
        readOnly={muted}
        disabled={muted}
        placeholder={placeholder}
        {...controller}
        {...props}
        className={`${className} ${fluid ? 'w-full' : ''}  ${isError ? `${focus['danger']} ${border['danger']} ${background['danger']}` : `${focus[variant]} ${border[variant]} ${background[variant]} `
          } 
   
 
        
        ${muted ? ` cursor-not-allowed bg-slate-100 focus:border-slate-200 focus:ring-0` : `${background[variant]}`} ${size[inputSize]
          }  text-gray-900 placeholder-gray-400 transition-colors focus:outline-none`}
      />
      {errorMessage && <span className="text-xs text-red-500">{errorMessage}</span>}
    </>
  )
}
