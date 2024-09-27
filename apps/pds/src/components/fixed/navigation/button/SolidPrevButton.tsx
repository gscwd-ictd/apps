import { forwardRef } from 'react';
import { ButtonHTMLAttributes } from 'react';

// type SolidNextButtonProps = {
//   formId: string;
// };

interface SolidNextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  formId?: string;
}

export const SolidPrevButton = forwardRef<HTMLButtonElement, SolidNextButtonProps>(
  ({ formId, className, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={`${className} w-[6rem]  bg-inherit hover:brightness-75 active:brightness-90 rounded flex justify-center items-center text-indigo-700 text-sm`}
        form={formId}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 stroke-indigo-700"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Prev
      </button>
    );
  }
);

SolidPrevButton.displayName = 'SolidPrevButton';
