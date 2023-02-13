import { FunctionComponent, InputHTMLAttributes } from 'react';

type LabelInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  className?: string;
  isError?: boolean;
  errorMessage?: string;
  controller?: object;
  muted?: boolean;
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
  muted = false,
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
        readOnly={muted}
        disabled={muted}
        {...controller}
        className={`rounded border  focus:border-blue-500 border-gray-300 w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4 ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
};
