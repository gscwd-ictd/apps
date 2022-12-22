import { useFloating, offset, flip, shift } from '@floating-ui/react-dom-interactions';
import { AnimatePresence, m, LazyMotion, domAnimation } from 'framer-motion';
import { forwardRef, FunctionComponent, useEffect, useState } from 'react';
import { TextFieldProps } from '../TextField';
import { inputClass, spanClass } from './PasswordField.styles';

export type PasswordFieldProps = Omit<TextFieldProps, 'inputType'> & {
  passwordToggle?: boolean;
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>((props, ref) => {
  // set state for showing or hiding password
  const [showPassword, setShowPassword] = useState(false);

  // set state for listening to toggle button hover state
  const [hovering, setHovering] = useState(false);

  // set state to control tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);

  const { x, y, reference, floating, strategy } = useFloating({
    middleware: [offset(5), flip(), shift({ padding: 5 })],
  });

  // deconstruct props and extract the rest of the props
  const { className, variant, helper, icon, passwordToggle, ...rest } = props;

  // control the password visibility
  const togglePasswordVisiblity = () => setShowPassword(!showPassword);

  useEffect(() => {
    // initialize a timer
    let timer: NodeJS.Timer;

    // check if user is hovering over the show/hide password toggle button
    if (hovering) timer = setTimeout(() => setShowTooltip(true), 500);

    // clean up function
    return () => {
      // clear the timer
      clearTimeout(timer);

      // hide the tooltip
      setShowTooltip(false);
    };
  }, [hovering, setHovering]);

  return (
    <div>
      <div className="relative">
        <input {...rest} ref={ref} type={showPassword ? 'text' : 'password'} className={inputClass(props)} />
        {icon && <i className="absolute h-4 w-4 top-[50%] -mt-[0.5rem] left-3">{icon}</i>}
        {passwordToggle ? (
          <>
            <button
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              ref={reference}
              type="button"
              onClick={togglePasswordVisiblity}
              className="absolute h-5 w-5 p-[2px] top-[50%] -mt-[10px] right-3 hover:bg-gray-100 rounded transition-colors"
            >
              {!showPassword ? <Eye /> : <EyeSlash />}
            </button>

            <LazyMotion features={domAnimation}>
              <AnimatePresence>
                {showTooltip && (
                  <m.div
                    ref={floating}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="bg-slate-700 bg-opacity-75 text-white text-center w-32 px-3 py-1 rounded z-50"
                    style={{
                      position: strategy,
                      top: y ?? 0,
                      left: x ?? 0,
                    }}
                  >
                    <span className="text-xs py-1">{!showPassword ? 'Show password' : 'Hide password'}</span>
                  </m.div>
                )}
              </AnimatePresence>
            </LazyMotion>
          </>
        ) : null}
      </div>
      <span className={spanClass(variant)}>{helper}</span>
    </div>
  );
});

const EyeSlash: FunctionComponent = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-full h-full text-gray-500"
    >
      <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
    </svg>
  );
};

const Eye: FunctionComponent = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-full h-full text-gray-500"
    >
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path
        fillRule="evenodd"
        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
        clipRule="evenodd"
      />
    </svg>
  );
};

PasswordField.defaultProps = {
  variant: 'primary',
  passwordToggle: true,
};
