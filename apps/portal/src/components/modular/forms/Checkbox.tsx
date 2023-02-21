import { FunctionComponent, InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
  checkboxId: string;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({ label, checkboxId, ...props }) => {
  return (
    <div>
      <input
        {...props}
        type="checkbox"
        id={checkboxId}
        className="cursor-pointer rounded-sm border-2 border-gray-300 transition-colors checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500"
      ></input>
      <label className="border-gray ml-2 cursor-pointer select-none text-sm text-gray-800" htmlFor={checkboxId}>
        {label}
      </label>
    </div>
  );
};
