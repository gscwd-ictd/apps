import React, { useRef } from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  className?: string
  label: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, className = '', children, ...props }): JSX.Element => {
  const checkboxRef = useRef(null)
  return (
    <>
      <div className={`${className} flex items-center gap-2`}>
        <input
          type="checkbox"
          id={id}
          {...props}
          ref={checkboxRef}
          className="transition-all border border-gray-300 rounded-sm cursor-pointer checked:bg-indigo-500 checked:hover:bg-indigo-600 focus:ring-transparent focus:checked:bg-indigo-600"
        ></input>
        <label htmlFor={id} className="select-none whitespace-nowrap hover:cursor-pointer">
          {label}
        </label>
      </div>
    </>
  )
}
