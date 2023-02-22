import { ReactNode } from 'react';

type ToastProps = {
  variant: 'success' | 'error' | 'warning' | 'info' | 'undo';
  children?: ReactNode;
  dismissAction?: () => void;
};

const background = {
  success: 'bg-green-300',
  error: 'bg-red-400',
  warning: 'bg-orange-400',
  info: 'bg-sky-200',
  undo: 'bg-gray-300',
};

export const Toast = ({ variant = 'success', dismissAction, children }: ToastProps): JSX.Element => {
  return (
    <>
      <div className="h-auto w-[18rem] select-none rounded-xl">
        <div className={`rounded ${background[variant]} p-2  text-gray-700`}>
          <div className="flex w-full grid-cols-3 items-center">
            <div className="col-span-1 w-[15%]">
              {variant === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {variant === 'info' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="h-6 w-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              )}
              {variant === 'warning' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
              {variant === 'error' && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            <div className="col-span-1 w-[75%] items-start text-left text-black ">
              <div className="flex flex-col">
                <div className="font-medium">
                  {variant === 'success' && 'Success'}
                  {variant === 'info' && 'Info'}
                  {variant === 'warning' && 'Warning'}
                  {variant === 'error' && 'Error'}
                </div>
                <div className="text-xs">{children}</div>
              </div>
            </div>

            <div className="col-span-1 w-[10%] items-center ">
              <div className="flex  place-items-center justify-center">
                <button onClick={dismissAction} className="absolute h-full w-full shrink-0 rounded-full text-black">
                  x
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
