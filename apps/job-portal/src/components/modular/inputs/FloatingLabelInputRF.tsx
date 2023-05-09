import { MutableRefObject } from 'react';

type MyTextFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'search'
  | 'url'
  | 'tel'
  | 'date'
  | 'textarea';

type MyTextFieldComponentVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'danger'
  | 'light'
  | 'simple';

const size = {
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-xl',
  lg: 'rounded-xl',
  xl: 'rounded-xl',
};

const shadowSize = {
  none: 'shadow-none',
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};

const background = {
  default: '',
  primary: 'bg-white',
  secondary: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-transparent',
  light: 'bg-white',
  simple: 'bg-slate-100',
};

const focusWithin = {
  default:
    'focus-within:ring-2 focus:ring-1 focus-within:border focus-within:border-gray-500 focus-within:ring-gray-100',
  primary:
    'focus-within:ring-2 focus:ring-1   focus-within:border focus-within:border-indigo-700 focus-within:ring-indigo-100',
  secondary:
    'focus-within:ring-2 focus:ring-1  focus-within:border focus-within:border-emerald-600 focus-within:ring-green-100',
  warning:
    'focus-within:ring-2 focus:ring-1 focus-within:border focus-within:border-orange-500 focus-within:ring-orange-100',
  danger:
    'focus-within:ring-2 focus:ring-1  focus-within:border focus-within:border-rose-600 focus-within:ring-rose-100',
  light:
    'focus-within:ring-2 focus:ring-1  focus-within:border focus-within:border-indigo-500 focus-within:ring-indigo-100',
  simple: '',
};

const border = {
  default: 'rounded-xl border border-gray-200',
  primary: 'rounded-xl border border-gray-200',
  secondary: 'rounded-xl border border-emerald-700',
  warning: 'rounded-xl border border-orange-600',
  danger: 'rounded-xl border border-rose-600',
  light: 'rounded-xl border border-indigo-200',
  simple: 'rounded-xl ',
};
interface MyFloatingLabelTextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  isError?: boolean;
  isRequired?: boolean;
  className?: string;
  innerRef?: MutableRefObject<any>;
  type?: MyTextFieldType;
  variant?: MyTextFieldComponentVariant;
  fluid?: boolean;
  muted?: boolean;
  controller: any;
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  roundedSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  errorMessage?: string | any;
  showErrorMessage?: boolean;
}

export const FloatingLabelInputRF: React.FC<MyFloatingLabelTextFieldProps> = ({
  id,
  innerRef,
  errorMessage,
  placeholder,
  className = '',
  isError = false,
  controller,
  type = 'text',
  variant = 'primary',
  fluid = true,
  muted = false,
  roundedSize = 'md',
  shadow = 'none',
  isRequired = false,
  showErrorMessage = true,
  ...props
}) => {
  return (
    <>
      <div
        className={`${className} ${fluid ? 'w-full' : ''} ${
          muted && `cursor-not-allowed select-none focus-within:ring-0`
        } 
        ${isError ? background['danger'] : background[variant]}
        ${isError ? focusWithin['danger'] : focusWithin[variant]} ${
          isError ? border['danger'] : border[variant]
        } ${props.hidden ? 'hidden' : ''}   select-none ${
          size[roundedSize]
        }  px-4 pt-[0.9rem] pb-0    ${
          shadow ? `${shadowSize[shadow]}` : 'shadow-none'
        } shadow-slate-300 transition-all`}
      >
        <div className="relative">
          <input
            {...props}
            // ref={controller}
            {...controller}
            tabIndex={muted ? -1 : 0}
            id={id}
            // ref={innerRef}
            type={type}
            placeholder="placeholder"
            autoComplete="off"
            readOnly={muted}
            disabled={muted}
            className={`${
              muted && 'cursor-not-allowed select-none text-gray-400'
            }  ${
              isError ? background['danger'] : background[variant]
            } peer w-full border-0 px-1 pt-1 pb-[0.9rem] font-normal text-gray-600 placeholder:select-none placeholder:text-transparent focus:outline-none focus:ring-0`}
          />
          <label
            htmlFor={id}
            className={`peer-focus:font-sm  absolute -top-10 left-0 mt-4  h-fit cursor-text bg-white
          px-1  text-xs font-normal ${
            isError ? 'text-red-700' : 'text-gray-600'
          } transition-all peer-placeholder-shown:-inset-y-[0.85rem] peer-placeholder-shown:left-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-1 peer-placeholder-shown:text-sm
          peer-focus:-top-10 peer-focus:left-0  peer-focus:h-fit peer-focus:bg-white peer-focus:px-1 peer-focus:text-xs
          ${
            muted
              ? 'peer-placeholder-shown:text-gray-400'
              : 'peer-placeholder-shown:text-gray-600'
          }
          ${isError ? 'peer-focus:text-red-700' : 'peer-focus:text-indigo-900'}
          
              `}
          >
            {placeholder}
            {isRequired ? (
              <>
                <span className="text-red-700">*</span>
              </>
            ) : (
              <></>
            )}
          </label>
        </div>
      </div>
      {showErrorMessage
        ? errorMessage && (
            <span className="text-xs text-red-600 ">{errorMessage}</span>
          )
        : null}
    </>
  );
};
