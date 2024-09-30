import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { HiPencilSquare } from 'react-icons/hi2';

interface EditButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  action: () => void;
}

export const EditButton = ({ action, ...props }: EditButtonProps): JSX.Element => {
  return (
    <>
      <button
        className="cursor-pointer rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-900 hover:text-gray-400 focus:outline-none disabled:cursor-not-allowed"
        onClick={action}
        type="button"
        {...props}
      >
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="sm:h-6 sm:w-6 lg:h-full lg:w-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg> */}
        <HiPencilSquare className="sm:h-4 sm:w-4 lg:h-full lg:w-full" />
      </button>
    </>
  );
};
