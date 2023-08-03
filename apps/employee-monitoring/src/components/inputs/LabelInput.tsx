import { isEmpty } from 'lodash';
import { FunctionComponent, InputHTMLAttributes, ReactNode } from 'react';

type LabelInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
  isError?: boolean;
  errorMessage?: string;
  controller?: object;
  disabled?: boolean;
  type?: string;
  rows?: number;
  cols?: number;
  isDirty?: boolean;
  helper?: ReactNode | ReactNode[];
  prefix?: string;
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
};

export const LabelInput: FunctionComponent<
  LabelInputProps & InputHTMLAttributes<HTMLInputElement>
> = ({
  id,
  label,
  placeholder = '',
  className = '',
  isError = false,
  errorMessage,
  controller,
  isDirty = false,
  disabled = false,
  type,
  rows,
  cols,
  helper,
  prefix,
  textSize = 'xs',
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>
        <div
          className={`flex justify-between gap-2 mb-1 text-${textSize} font-medium text-gray-900 dark:text-gray-800`}
        >
          <div className="flex gap-2">
            {label}
            {helper ? <>{helper}</> : null}
          </div>
          {isDirty ? (
            <span
              className={`font-light rounded ${
                isError ? 'bg-red-600' : 'bg-green-600'
              } px-1 text-white`}
            >
              {isError ? 'Invalid Change' : 'Valid Change'}
            </span>
          ) : null}
        </div>
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          readOnly={disabled}
          disabled={disabled}
          rows={rows}
          cols={cols}
          {...controller}
          className={`rounded-lg disabled:hover:cursor-not-allowed w-full outline-none sm:text-xs md:text-${textSize} lg:text-${textSize} text-gray-900 ${className} block p-2.5 bg-gray-50 border ${
            isError
              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
              : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          placeholder={placeholder}
        ></textarea>
      ) : (
        <div className="flex">
          {!isEmpty(prefix) ? (
            <span
              className={`inline-flex items-center rounded-tl-lg rounded-bl-lg px-3 disabled:hover:cursor-not-allowed outline-none sm:text-xs text-sm text-gray-900 h-[2.5rem] bg-gray-300 border
            ${
              isError
                ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
            >
              {prefix}
            </span>
          ) : null}

          <input
            {...props}
            id={id}
            readOnly={disabled}
            disabled={disabled}
            type={type}
            {...controller}
            className={`${className} text-${textSize} rounded-lg disabled:hover:cursor-not-allowed w-full outline-none text-gray-900 h-[2.5rem]  block p-2.5 bg-gray-50 border
          ${textSize === 'xs' ? 'h-[2.5rem]' : 'h-[3rem]'}
          ${
            isError
              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
              : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          ${!isEmpty(prefix) ? 'rounded-tr-lg rounded-br-lg' : 'rounded-lg '}
          `}
            placeholder={placeholder}
          />
        </div>
      )}

      {isError ? (
        <div className="mt-1 text-xs text-red-400">{errorMessage}</div>
      ) : null}
    </div>
  );
};
