import React, { useRef } from 'react'

interface CheckboxRFProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  name: string
  className?: string
  label: string
  muted?: boolean
  controller: any
  isError?: boolean
}

export const CheckboxRF: React.FC<CheckboxRFProps> = ({
  id,
  isError = false,
  name,
  label,
  className = '',
  muted = false,
  controller,
  children,
  ...props
}): JSX.Element => {
  const checkboxRef = useRef(null)
  return (
    <>
      <div className={`${className}  flex items-center gap-2`}>
        <input
          type="checkbox"
          name={name}
          id={id}
          ref={checkboxRef}
          disabled={muted}
          {...controller}
          {...props}
          className={`${
            muted ? 'cursor-not-allowed' : 'cursor-pointer'
          }  rounded-sm border border-gray-300 transition-all checked:bg-indigo-500 hover:bg-indigo-300 checked:hover:bg-indigo-600 focus:bg-indigo-200 focus:ring-transparent focus:checked:bg-indigo-600`}
        />
        <label htmlFor={id} className={`select-none whitespace-nowrap text-slate-700 ${muted ? 'cursor-not-allowed' : 'hover:cursor-pointer'}`}>
          {label}
        </label>
      </div>
    </>
  )
}
