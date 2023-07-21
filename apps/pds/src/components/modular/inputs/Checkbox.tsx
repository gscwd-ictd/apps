import React, { useRef } from 'react';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  className = '',
  children,
  ...props
}): JSX.Element => {
  const checkboxRef = useRef(null);
  return (
    <>
      <div
        className={`${className} flex items-center gap-1 transition-all ${
          props.disabled ? 'invisible' : 'visible'
        }`}
      >
        <input
          type="checkbox"
          id={id}
          {...props}
          ref={checkboxRef}
          className={`cursor-pointer rounded-sm border border-gray-300 ${
            props.disabled
              ? 'checked:bg-gray-500 hover:cursor-not-allowed checked:hover:bg-gray-500 focus:ring-transparent focus:checked:bg-gray-500 '
              : 'checked:bg-indigo-500 hover:cursor-pointer checked:hover:bg-indigo-600 focus:ring-transparent focus:checked:bg-indigo-600'
          } `}
        ></input>
        <label
          htmlFor={id}
          className={`select-none whitespace-nowrap ${
            props.disabled ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'
          }`}
        >
          {label}
        </label>
      </div>
    </>
  );
};
