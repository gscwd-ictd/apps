/* eslint-disable @nx/enforce-module-boundaries */
import { useJobOpeningsStore } from 'apps/job-portal/src/store/job-openings.store';

type PositionTabProps = {
  title: string;
  index: number;
};

export const PositionTab = ({ title, index }: PositionTabProps) => {
  const { positionTab, setPositionTab } = useJobOpeningsStore((state) => ({
    setPositionTab: state.setPositionTab,
    positionTab: state.positionTab,
  }));

  const onSelectPositionTab = (index: number) => {
    setPositionTab(index);
  };

  return (
    <a
      target="_blank"
      rel="noreferrer"
      onClick={() => onSelectPositionTab(index)}
      className={`${
        positionTab === index
          ? 'border-b-4 border-indigo-500 bg-slate-600 font-medium text-white'
          : ' text-gray-700 hover:bg-slate-200 hover:border-b-4 hover:border-slate-300 hover:text-gray-400'
      } flex h-[4rem] rounded cursor-pointer items-center  

 transition-all bg-slate-100 ease-in-out `}
    >
      <div className="flex items-center justify-center w-full px-2 text-center select-none sm:text-xs md:text-xs lg:text-sm">
        {title}
      </div>
    </a>
  );
};
