import { InputHTMLAttributes, forwardRef } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ ...restProps }, forwardedRef) => {
    return (
      <input
        ref={forwardedRef}
        {...restProps}
        type="checkbox"
        className="border-2 border-gray-200 rounded-sm hover:border-indigo-500 checked:bg-indigo-500 hover:checked:bg-indigo-500 focus:ring-indigo-500 focus:checked:bg-indigo-500 transition-colors cursor-pointer"
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';
