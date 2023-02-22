import { FunctionComponent, InputHTMLAttributes, MutableRefObject } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  fluid?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  errorMessage?: string;
  controller?: UseFormRegisterReturn;
  value?: string;
}

export const TextField: FunctionComponent<TextFieldProps> = ({
  value = '',
  fluid = false,
  isDisabled = false,
  isError = false,
  errorMessage,
  controller,
  ...props
}) => {
  return (
    <div>
      <input
        {...props}
        {...controller}
        value={value}
        autoComplete="on"
        disabled={isDisabled}
        className={`${fluid ? 'w-full' : ''} ${
          isDisabled ? 'bg-slate-100 border-slate-200 border-2 text-gray-600 cursor-not-allowed' : ''
        } ${
          isError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-indigo-100'
        } rounded focus:ring-4 w-full`}
      />
      {isError && (
        <div className="pl-1 my-1">
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
