import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import { SpinnerCircular } from 'spinners-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnLabel: string;
  shadow?: boolean;
  uppercase?: boolean;
  strong?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  fluid?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
  btnLabel,
  shadow = false,
  uppercase = false,
  strong = false,
  isLoading = false,
  loadingLabel,
  fluid = false,
  ...props
}) => {
  return (
    <>
      <button
        {...props}
        disabled={isLoading}
        className={`${isLoading
            ? 'bg-indigo-400 cursor-default hover:bg-indigo-400 active:bg-indigo-400 focus:ring-0'
            : 'bg-indigo-500 focus:ring-indigo-200 hover:bg-indigo-600 active:bg-indigo-700'
          } ${shadow ? 'shadow-lg shadow-indigo-200 hover:shadow-indigo-200 hover:shadow-xl' : ''} ${fluid ? 'w-full' : 'px-3'
          } tracking-wide text-sm py-2 text-white rounded focus:outline-none focus:ring-4 transition-colors`}
      >
        <span className="flex items-center justify-center gap-2">
          <p className={`${strong ? 'font-semibold' : 'font-medium'} ${uppercase ? 'uppercase' : ''} text-sm`}>
            {isLoading ? `${loadingLabel}` : `${btnLabel}`}
          </p>
          {isLoading && <SpinnerCircular size="5%" thickness={350} color="rgb(165 180 252)" secondaryColor="rgb(129 140 248)" />}
        </span>
      </button>
    </>
  );
};
