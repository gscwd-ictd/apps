import { FunctionComponent } from 'react';

type LoadingProgressBarProps = {
  value: React.ReactNode | React.ReactNode[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export const LoadingProgressBar: FunctionComponent<LoadingProgressBarProps> = ({ value, size }) => {
  return (
    <>
      <div className={size ? `w-${size}` : `w-full` + `items-start text-gray-600`}>
        <div className="font-semibold text-black pl-3">{value}</div>
      </div>

      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className={`bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full
              w-[${value}%]`}
        >
          {value}
        </div>
      </div>
    </>
  );
};
