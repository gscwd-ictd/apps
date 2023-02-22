import { FunctionComponent, SelectHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  fluid?: boolean;
  options: Array<any>;
  controller?: UseFormRegisterReturn;
}

export const Select: FunctionComponent<SelectProps> = ({ fluid = false, options, controller, ...props }) => {
  return (
    <>
      <select
        {...props}
        {...controller}
        className={`${fluid ? 'w-full' : ''} rounded border-gray-200 focus:ring-indigo-100 focus:ring-4 cursor-pointer`}
      >
        {options.map((option: any, index: number) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </>
  );
};
