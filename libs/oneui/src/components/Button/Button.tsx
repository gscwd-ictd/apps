import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { buttonClass } from './Button.styles';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode | ReactNode[];
  className?: string;
  variant?: 'primary' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, className, variant, size, loading, ...rest } = props;

  return (
    <button ref={ref} {...rest} className={buttonClass(props)} aria-disabled={props.disabled ? 'true' : undefined}>
      {children}
    </button>
  );
});

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  loading: false,
};
