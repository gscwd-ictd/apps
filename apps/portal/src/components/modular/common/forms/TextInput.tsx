interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  muted?: boolean;
  fluid?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
  inputType?: 'text' | 'email' | 'password' | 'date';
  variant?: 'default' | 'error';
}

// set border color and focus color classes based on props
const border = {
  default: 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100',
  error: 'border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-100',
};

// set input size based on props
const size = {
  sm: 'py-1 px-2 text-sm',
  md: 'px-3 py-2',
  lg: 'px-4 py-3 text-lg',
};

export const TextInput = ({
  className = '',
  inputType = 'text',
  inputSize = 'md',
  variant = 'default',
  muted = false,
  fluid = false,

  ...props
}: TextInputProps): JSX.Element => {
  return (
    <>
      <input
        {...props}
        readOnly={muted}
        tabIndex={muted ? -1 : 0}
        type={inputType}
        className={`${className} ${border[variant]} ${size[inputSize]} ${fluid ? 'w-full' : null} ${
          muted ? 'cursor-not-allowed bg-gray-50 focus:border-gray-200 focus:ring-0' : null
        } rounded-md border-2 transition-colors`}
      ></input>
    </>
  );
};
