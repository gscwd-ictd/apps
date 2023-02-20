import { forwardRef, InputHTMLAttributes } from 'react';
import { inputClass, spanClass } from './TextField.styles';
import PropTypes from 'prop-types';

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  inputType?: 'text';
  className?: string;
  variant?: 'primary' | 'error';
  helper?: string;
  icon?: JSX.Element;
};

// eslint-disable-next-line react/display-name
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { inputType, className, variant, helper, icon, ...rest } = props;

  return (
    <>
      <div className="relative">
        <input type={inputType} {...rest} ref={ref} className={inputClass(props)} />
        {icon && <i className="absolute h-4 w-4 top-[50%] -mt-[0.5rem] left-3">{icon}</i>}
      </div>
      <span className={spanClass(variant)}>{helper}</span>
    </>
  );
});

TextField.defaultProps = {
  inputType: 'text',
  variant: 'primary',
};
