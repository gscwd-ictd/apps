import { ReactChild, ReactChildren, ReactNode } from 'react';

const background = {
  default: 'bg-inherit',
  primary: 'bg-white',
  secondary: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-rose-50',
  light: 'bg-white',
  simple: 'bg-gray-50',
};

const border = {
  default: 'rounded-xl ',
  primary: 'rounded-xl border border-gray-200',
  secondary: 'rounded-xl border border-emerald-700',
  warning: 'rounded-xl border border-orange-600',
  danger: 'rounded-xl border border-rose-600',
  light: 'rounded-xl border border-indigo-200',
  simple: 'rounded-xl border border-gray-100 ',
};

type MyRadioGroupVariant = 'default' | 'primary' | 'secondary' | 'warning' | 'danger' | 'light' | 'simple';

interface MyRadioGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  groupName: string;
  className: string;
  muted?: boolean;
  isError?: boolean;
  focusOutline?: boolean;
  isFlex?: boolean;
  variant?: MyRadioGroupVariant;
  children?: ReactNode | ReactNode[];
}

const RadioGroup: React.FC<MyRadioGroupProps> = ({
  groupName,
  isError = false,
  className = '',
  variant = 'default',
  focusOutline = false,
  muted = false,
  isFlex = false,
  children,
  ...props
}): JSX.Element => {
  return (
    <>
      <div
        className={`${className} ${isFlex ? 'flex' : ''}  ${background[variant]}
        ${isError ? border['danger'] : border[variant]}
         select-none gap-4 ${
           focusOutline && !muted ? 'focus-within:border focus-within:border-indigo-600' : focusOutline && muted && 'focus-within:border-gray-200'
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
