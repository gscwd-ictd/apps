import { FunctionComponent, InputHTMLAttributes } from 'react';

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
  radiusClassName?: string;
  isDirty?: boolean;
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
  radiusClassName = 'rounded-lg',
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>
        <div className="flex justify-between gap-2 mb-1 text-xs font-medium text-gray-900 dark:text-gray-800">
          <span>{label}</span>
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
          className={`rounded-lg disabled:hover:cursor-not-allowed w-full outline-none sm:text-xs text-sm  text-gray-900 ${className} block p-2.5 bg-gray-50 border ${
            isError
              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
              : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          placeholder={placeholder}
        ></textarea>
      ) : (
        <input
          {...props}
          id={id}
          readOnly={disabled}
          disabled={disabled}
          type={type}
          {...controller}
          className={`${radiusClassName} disabled:hover:cursor-not-allowed w-full outline-none sm:text-xs text-sm text-gray-900 h-[2.5rem] ${className} block p-2.5 bg-gray-50 border ${
            isError
              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
              : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          placeholder={placeholder}
        />
      )}

      {isError ? (
        <div className="mt-1 text-xs text-red-400">{errorMessage}</div>
      ) : null}
    </div>
  );
};
