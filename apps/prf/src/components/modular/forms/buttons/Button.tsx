import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import { CircularSpinner } from '../../spinners/CircularSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnLabel: string;
  shadow?: boolean;
  uppercase?: boolean;
  strong?: boolean;
  isLoading?: boolean;
  fluid?: boolean;
  isDisabled?: boolean;
  variant?: 'white' | 'primary' | 'warning' | 'danger';
  noWrap?: boolean;
}

type ButtonLabelProps = {
  strong: boolean;
  uppercase: boolean;
  btnLabel: string;
  variant: 'white' | 'primary' | 'warning' | 'danger';
};

const disabledClass = {
  white: 'border bg-slate-100 cursor-not-allowed',
  primary: 'bg-indigo-300 focus:ring-0 cursor-not-allowed',
  warning: 'bg-amber-500 bg-opacity-50 hover:bg-opacity-50 active:bg-opacity-50 focus:ring-0 cursor-not-allowed',
  danger: 'bg-red-300 focus:ring-0 cursor-not-allowed',
};

const shadowClass = {
  white: 'shadow-slate-200 hover:shadow-slate-200',
  primary: 'shadow-indigo-200 hover:shadow-indigo-200',
  warning: 'shadow-amber-200 hover:shadow-amber-200',
  danger: 'shadow-red-200 hover:shadow-red-200',
};

const variantClass = (loading: boolean) => {
  return {
    white: `${
      loading
        ? 'border bg-slate-100 focus:ring-0 cursor-default'
        : 'border bg-white hover:bg-slate-50 active:bg-slate-100 focus:ring-slate-100 text-gray-500 transition-all active:scale-95'
    }`,
    primary: `${
      loading
        ? 'bg-indigo-400 focus:ring-0 cursor-default'
        : 'bg-indigo-500 focus:ring-indigo-200 hover:bg-indigo-600 active:bg-indigo-700 transition-all active:scale-95'
    }`,
    warning: `${
      loading
        ? 'bg-amber-500 bg-opacity-60 hover:bg-opacity-60 active:bg-opacity-60 focus:ring-0 cursor-default'
        : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 focus:ring-4 focus:ring-orange-200 text-white transition-all active:scale-95'
    }`,
    danger: `${
      loading
        ? 'bg-red-400 focus:ring-0 cursor-default'
        : 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-4 focus:ring-red-200 text-white transition-all active:scale-95'
    }`,
  };
};

export const Button: FunctionComponent<ButtonProps> = ({
  btnLabel,
  shadow = false,
  uppercase = false,
  strong = false,
  isLoading = false,
  fluid = false,
  isDisabled = false,
  variant = 'primary',
  noWrap = false,
  ...props
}) => {
  return (
    <>
      <button
        {...props}
        disabled={isDisabled}
        className={`${noWrap ? 'whitespace-nowrap' : ''} ${
          isDisabled ? disabledClass[variant] : variantClass(isLoading)[variant]
        } ${shadow ? `${shadowClass[variant]} shadow-lg hover:shadow-xl` : ''} ${
          fluid ? 'w-full' : 'px-3'
        } tracking-wide text-sm py-2 text-white rounded focus:outline-none focus:ring-4`}
      >
        <span className="flex items-center justify-center gap-4 px-1">
          <ButtonLabel strong={strong} uppercase={uppercase} btnLabel={btnLabel} variant={variant} />
          {isLoading && <CircularSpinner color={`${variant === 'white' ? 'dark' : 'light'}`} size="sm" />}
        </span>
      </button>
    </>
  );
};

const ButtonLabel: FunctionComponent<ButtonLabelProps> = ({ strong, uppercase, variant, btnLabel }) => {
  return (
    <>
      <p
        className={`${strong ? 'font-semibold' : 'font-medium'} ${uppercase ? 'uppercase' : ''} ${
          variant === 'white' ? 'text-gray-600' : ''
        } text-sm`}
      >
        {btnLabel}
      </p>
    </>
  );
};
