/* eslint-disable react/jsx-no-target-blank */
import { FC, MouseEventHandler } from 'react';
import { HiBadgeCheck } from 'react-icons/hi';

type TabHeaderProps = {
  tab: number;
  tabIndex: number;
  onClick?: MouseEventHandler<HTMLLIElement | HTMLAnchorElement>;
  href?: string;
  positionTitle: string;
  companyName: string;
  duration: string;
  icon?: any;
  notificationCount?: number;
  className?: string;
  selected?: boolean;
  invert?: boolean;
};

export const TabHeader: FC<TabHeaderProps> = ({
  tab,
  positionTitle,
  href,
  tabIndex,
  companyName,
  duration,
  icon,
  notificationCount,
  className,
  selected = false,
  invert = false,
  onClick,
}) => {
  return (
    <>
      <a
        target="_blank"
        href={href}
        onClick={onClick}
        //  ${tab === tabIndex ? 'bg-slate-700' : 'bg-slate-100'}
        className={`
        ${selected ? 'bg-slate-700' : 'bg-slate-100'}
         mr-6 flex h-auto min-h-[6rem] w-full cursor-pointer items-center justify-start rounded-xl ${
           invert ? 'rounded-b-none' : 'rounded-tr-none'
         } 

        border-b  border-gray-200 bg-white py-2 pt-1 transition-all ease-in-out  hover:drop-shadow-lg`}
      >
        <div
          className={`${
            icon ? 'visible' : 'invisible'
          } flex w-[10%] justify-center `}
        >
          <div
            className={`h-[1rem] w-[1rem] items-center rounded-full ${
              selected ? 'bg-green-600' : 'bg-slate-400'
            }`}
          >
            {icon}
          </div>
        </div>
        <div className="flex w-[80%] flex-col">
          <p
            className={`select-none  text-xl font-semibold ${
              tab === tabIndex ? 'text-white' : 'text-black'
            } transition-colors ease-in-out`}
          >
            {positionTitle}
          </p>
          <p
            className={`select-none  text-sm font-medium ${
              tab === tabIndex ? 'text-gray-200' : 'text-gray-600'
            } transition-colors ease-in-out`}
          >
            {companyName}
          </p>
          <p
            className={`select-none  text-sm font-light ${
              tab === tabIndex ? 'text-gray-200' : 'text-gray-600 '
            } transition-colors ease-in-out`}
          >
            {duration}
          </p>
        </div>
        <div className="w-[10%] px-4">
          <div
            className={`flex min-w-[1.2rem] max-w-full rounded-md ${className} ${
              selected ? 'visible' : 'invisible'
            } flex-grow-0 select-none justify-center text-sm text-white`}
          >
            {<HiBadgeCheck size={100} className="text-green-500 " />}
          </div>
        </div>
      </a>
    </>
  );
};
