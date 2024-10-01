import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { HiTrash } from 'react-icons/hi2';

interface DeleteButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  action: () => void;
}

export const DeleteButton = ({ action, ...props }: DeleteButtonProps): JSX.Element => {
  return (
    <>
      <button
        className={`cursor-pointer rounded-md bg-red-600 p-2 text-white ${
          props.disabled
            ? 'hover:cursor-not-allowed hover:bg-red-900 hover:text-gray-400'
            : 'hover:bg-red-900 hover:text-gray-400'
        } focus:outline-none`}
        {...props}
        onClick={() => action()}
        type="button"
      >
        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg> */}
        <HiTrash className="sm:h-4 sm:w-4 lg:h-full lg:w-full" />
      </button>
    </>
  );
};
