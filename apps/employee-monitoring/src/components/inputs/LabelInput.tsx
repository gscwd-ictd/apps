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
};

export const LabelInput: FunctionComponent<
  LabelInputProps & InputHTMLAttributes<HTMLInputElement>
> = ({
  id,
  label,
  placeholder = '',
  className,
  isError = false,
  errorMessage,
  controller,
  disabled = false,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>
        <span className="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-800">
          {label}
        </span>
      </label>
      <input
        {...props}
        id={id}
        readOnly={disabled}
        disabled={disabled}
        {...controller}
        className={`rounded-lg disabled:hover:cursor-not-allowed w-full outline-none sm:text-xs text-sm text-gray-900 h-[2.5rem]  ${className}
        block p-2.5
        bg-gray-50 border ${
          isError
            ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
            : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
        placeholder={placeholder}
      />

      {isError ? (
        <div className="text-xs text-red-400">{errorMessage}</div>
      ) : null}
    </div>
  );
};
