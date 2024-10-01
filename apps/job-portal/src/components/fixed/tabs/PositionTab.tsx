/* eslint-disable @nx/enforce-module-boundaries */
import { useJobOpeningsStore } from 'apps/job-portal/src/store/job-openings.store';
import { forwardRef, HTMLAttributes } from 'react';

type PositionTabProps = {
  title: string;
  index: number;
};

export const PositionTab = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement> & PositionTabProps>(
  ({ title, index, className, ...props }, ref) => {
    const { positionTab, setPositionTab } = useJobOpeningsStore((state) => ({
      setPositionTab: state.setPositionTab,
      positionTab: state.positionTab,
    }));

    const onSelectPositionTab = (index: number) => {
      setPositionTab(index);
    };

    return (
      <button
        type="button"
        onClick={() => onSelectPositionTab(index)}
        className={`${
          positionTab === index
            ? 'border-b-4 border-indigo-500 bg-slate-600 font-medium text-white '
            : ' text-gray-700 hover:bg-slate-200 hover:border-b-4 hover:border-slate-300 hover:text-gray-400'
        } flex w-full h-[4rem] rounded cursor-pointer items-center  

 transition-all bg-slate-100 ease-in-out ${className}`}
      >
        <div className="flex items-center justify-center w-full text-center select-none sm:text-xs md:text-xs lg:text-sm">
          {title}
        </div>
      </button>
    );
  }
);
