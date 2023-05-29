import { ReactChild, ReactChildren } from 'react';

const background = {
  default: '',
  primary: 'bg-white',
  secondary: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-rose-50',
  light: 'bg-white',
  simple: 'bg-gray-50',
};

const border = {
  default: 'rounded border border-gray-200',
  primary: 'rounded',
  secondary: 'rounded border border-emerald-700',
  warning: 'rounded border border-orange-600',
  danger: 'rounded border border-rose-600',
  light: 'rounded border border-indigo-200',
  simple: 'rounded border border-gray-100 ',
};

type MyRadioGroupVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'danger'
  | 'light'
  | 'simple';

interface MyRadioGroupProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  groupName: string;
  className: string;
  muted?: boolean;
  isError?: boolean;
  focusOutline?: boolean;
  isFlex?: boolean;
  variant?: MyRadioGroupVariant;
  children?: React.ReactNode | React.ReactNode[];
}

const RadioGroup: React.FC<MyRadioGroupProps> = ({
  groupName,
  isError = false,
  className = '',
  variant = 'primary',
  focusOutline = false,
  muted = false,
  isFlex = false,
  children,
  ...props
}): JSX.Element => {
  return (
    <>
      <div
        className={`${className} ${isFlex ? 'flex' : ''} ${
          isError ? background['danger'] : background[variant]
        }
        ${isError ? border['danger'] : border[variant]}
         select-none gap-4  ${
           focusOutline && 'focus-within:border focus-within:border-indigo-600'
         } `}
        id={groupName}
        name={groupName}
        disabled={muted}
        {...props}
      >
        <div className="peer">{children}</div>
      </div>
    </>
  );
};
export default RadioGroup;
