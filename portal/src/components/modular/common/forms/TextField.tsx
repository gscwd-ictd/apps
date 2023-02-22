import { FunctionComponent, InputHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  errorMessage?: string;
  controller?: UseFormRegisterReturn;
}

export const TextField: FunctionComponent<TextFieldProps> = ({ isError = false, errorMessage, controller, ...props }) => {
  return (
    <div>
      <input
        {...props}
        {...controller}
        className={`${
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
