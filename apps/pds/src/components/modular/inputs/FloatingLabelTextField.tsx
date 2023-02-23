import { MutableRefObject } from 'react'
import { background, border, focusWithin } from '../../../classes/textfield'

type MyTextFieldType = 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel' | 'date' | 'textarea'

type MyTextFieldComponentVariant = 'default' | 'primary' | 'secondary' | 'warning' | 'danger' | 'light' | 'simple'

const size = {
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
}

const shadowSize = {
  none: 'shadow-none',
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
}

interface MyFloatingLabelTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  placeholder: string
  className?: string
  innerRef?: MutableRefObject<any>
  type: MyTextFieldType
  variant?: MyTextFieldComponentVariant
  fluid?: boolean
  muted?: boolean
  isRequired?: boolean
  isError?: boolean
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  roundedSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const FloatingLabelTextField: React.FC<MyFloatingLabelTextFieldProps> = ({
  id,
  name,
  type,
  innerRef,
  placeholder,
  className = '',
  variant = 'primary',
  isError = false,
  fluid = true,
  muted = false,
  roundedSize = 'md',
  shadow = 'none',
  isRequired = false,
  ...props
}) => {
  return (
    <>
      <div
        className={`${className} ${fluid ? 'w-full' : ''} ${muted ? `cursor-not-allowed  focus-within:ring-0` : `${background[variant]}`} ${focusWithin[variant]
          } ${isError ? `${border['danger']} ${background['danger']}` : `${border[variant]} ${background[variant]}`} ${props.hidden ? 'hidden' : ''}   select-none ${size[roundedSize]}  px-4 pt-[0.9rem] pb-0   ${shadow ? shadowSize[shadow] : 'shadow-0'
          } shadow-slate-300 transition-all`}
      >
        <div className="relative">
          <input
            {...props}
            ref={innerRef}
            tabIndex={muted ? -1 : 0}
            id={id}
            name={name}
            type={type}
            placeholder="placeholder"
            autoComplete="off"
            readOnly={muted}
            disabled={muted}
            className={`${muted ? 'cursor-not-allowed select-none text-gray-400' : 'text-gray-600'}  ${isError ? background['danger'] : background[variant]
              } peer pt-1 px-1 pb-[0.9rem] w-full border-0 font-normal  placeholder:select-none placeholder:text-transparent focus:outline-none focus:ring-0`}
          />
          <label
            htmlFor={id}
            className={`peer-focus:font-sm  absolute -top-10 left-0 mt-4  h-fit cursor-text px-1
          text-xs  font-normal  transition-all peer-placeholder-shown:-inset-y-[0.85rem] peer-placeholder-shown:left-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-1 peer-placeholder-shown:text-sm peer-focus:px-1  ${muted ? 'peer-placeholder-shown:text-gray-400' : 'peer-placeholder-shown:text-gray-600'
              } bg-white peer-focus:-top-10  peer-focus:left-0 peer-focus:h-fit peer-focus:bg-white peer-focus:text-xs peer-focus:text-indigo-900`}
          >

            {placeholder}
            {isRequired ? (
              <>
                <span className={`${muted ? 'text-red-400' : 'text-red-700'} `}>*</span>
              </>
            ) : (
              ''
            )}

          </label>
        </div>
      </div>
    </>
  )
}
