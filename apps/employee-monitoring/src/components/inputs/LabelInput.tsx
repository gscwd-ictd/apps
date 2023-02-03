import { FunctionComponent, InputHTMLAttributes } from 'react';

type LabelInputProps = {
  id: string;
  label: string;
  placeholder?: string;
};

export const LabelInput: FunctionComponent<
  LabelInputProps & InputHTMLAttributes<HTMLInputElement>
> = ({ id, label, placeholder = '', ...props }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>
        <span className="text-xs text-gray-700">{label}</span>
      </label>
      <input
        {...props}
        id={id}
        className="rounded border border-gray-300 w-full outline-none text-xs text-gray-600 h-[2.25rem] px-4"
        placeholder={placeholder}
      />
    </div>
  );
};
