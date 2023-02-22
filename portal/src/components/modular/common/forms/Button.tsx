import { SpinnerCircular } from 'spinners-react';

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  type?: 'submit' | 'button' | 'reset' | undefined;
  isDisabled?: boolean;
  fluid?: boolean;
  shadow?: boolean;
  light?: boolean;
  strong?: boolean;
  btnLabel: string;
  uppercase?: boolean;
  isLoading?: boolean;
  icon?: any;
  iconPlacement?: 'start' | 'end';
  loadingLabel?: string;
  btnSize?: 'sm' | 'md' | 'lg';
  btnVariant?: 'default' | 'primary' | 'warning' | 'danger' | 'white';
  formId?: string;
}

const variant = {
  default: 'bg-slate-500 hover:bg-slate-600 active:bg-slate-700 focus:ring-4 focus:ring-slate-200 text-white',
  primary: 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 text-white',
  warning: 'bg-orange-400 hover:bg-orange-500 active:bg-orange-600 focus:ring-4 focus:ring-orange-200 text-white',
  danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-4 focus:ring-red-200 text-white',
  white: 'text-gray-700 border border-gray-300 bg-white hover:bg-slate-100 active:bg-slate-200 focus:ring-4 focus:ring-slate-100',
};

const lightVariant = {
  default: 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 focus:ring focus:ring-slate-200',
  primary: 'bg-indigo-100 hover:bg-indigo-200 active:bg-indigo-300 text-indigo-800 focus:ring focus:ring-indigo-200',
  warning: 'bg-orange-100 hover:bg-orange-200 active:bg-orange-300 text-orange-800 focus:ring focus:ring-orange-200',
  danger: 'bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-800 focus:ring focus:ring-red-200',
  white: 'text-gray-700 border border-gray-300 bg-white hover:bg-slate-100 active:bg-slate-200 focus:ring-4 focus:ring-slate-100',
};

const withShadow = {
  default: 'shadow-lg shadow-slate-300',
  primary: 'shadow-lg shadow-indigo-200',
  warning: 'shadow-lg shadow-orange-100',
  danger: 'shadow-lg shadow-red-200',
  white: 'shadow-lg shadow-slate-200',
};

const size = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 font-medium',
  lg: 'px-6 py-3 text-lg font-medium',
};

const disabledState = {
  default: '',
  primary: 'bg-opacity-90 cursor-not-allowed hover:bg-indigo-300 active:bg-indigo-300 focus:ring-0 text-white',
  warning: '',
  danger: '',
  white: '',
};

export const Button = ({
  className = '',
  isDisabled = false,
  uppercase = false,
  shadow = false,
  light = false,
  fluid = false,
  btnSize = 'md',
  strong = false,
  isLoading = false,
  loadingLabel,
  icon,
  iconPlacement = 'end',
  btnVariant = 'primary',
  btnLabel,
  type = 'button',
  formId,
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <>
      <button
        form={formId}
        type={type}
        disabled={isDisabled}
        {...props}
        className={`${className} ${size[btnSize]} ${uppercase ? 'uppercase' : null} ${isDisabled && disabledState[btnVariant]}
       ${variant[btnVariant]}
        ${fluid ? 'w-full' : null} ${shadow ? `${withShadow[btnVariant]}` : null} ${light ? lightVariant[btnVariant] : null
          } rounded transition-all focus:outline-none flex justify-center`}
      >
        <div className="flex gap-1 text-center place-items-center">
          {icon && iconPlacement === 'start' ? icon : null}
          <span className="flex items-center justify-center gap-2">
            <p className={`${strong ? 'font-semibold' : 'font-medium'} ${uppercase ? 'uppercase' : ''} text-sm`}>
              {isLoading ? `${loadingLabel}` : `${btnLabel}`}
            </p>
            {isLoading && <SpinnerCircular size="5%" thickness={350} color="rgb(165 180 252)" secondaryColor="rgb(129 140 248)" />}
          </span>
          {icon && iconPlacement === 'end' ? icon : null}
        </div>
      </button>
    </>
  );
};
