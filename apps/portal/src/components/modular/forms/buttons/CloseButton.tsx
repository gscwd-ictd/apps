import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import { HiOutlineX } from 'react-icons/hi';

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnSize?: 'sm' | 'md';
}

export const CloseButton: FunctionComponent<CloseButtonProps> = ({ btnSize = 'md', ...props }) => {
  return (
    <>
      <button
        {...props}
        className={`${
          btnSize === 'md' ? 'h-8 w-8' : 'h-5 w-5'
        } flex cursor-pointer items-center justify-center focus:outline-none focus:border focus:border-gray-200 focus:ring-4 focus:ring-slate-100 rounded-full text-gray-500 transition-colors ease-in-out bg-white hover:bg-gray-100 active:bg-gray-200`}
      >
        <HiOutlineX className={`${btnSize === 'md' ? 'h-4 w-4' : 'h-3 w-3'}`} />
      </button>
    </>
  );
};
