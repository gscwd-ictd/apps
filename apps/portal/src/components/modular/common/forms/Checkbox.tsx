import { Dispatch, FunctionComponent, InputHTMLAttributes, SetStateAction, useState } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({ label, isChecked, setIsChecked, ...props }) => {
  return (
    <div>
      <input
        {...props}
        type="checkbox"
        id="remember-me"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        className="cursor-pointer rounded-sm border-2 border-gray-300 transition-colors checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500"
      ></input>
      <label className="border-gray ml-2 cursor-pointer select-none text-sm text-gray-800" htmlFor="remember-me">
        {label}
      </label>
    </div>
  );
};
