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
        <span className="text-xs text-gray-700">{label}</span>
      </label>
      <input
        {...props}
        id={id}
        readOnly={disabled}
        disabled={disabled}
        {...controller}
        className={`rounded border disabled:hover:cursor-not-allowed focus:border-blue-500 border-gray-300 w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4 ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
};
