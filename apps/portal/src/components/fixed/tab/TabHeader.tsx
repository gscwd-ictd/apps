/* eslint-disable @nx/enforce-module-boundaries */
import { FC, MouseEventHandler } from 'react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

type TabHeaderProps = {
  tab: number;
  tabIndex: number;
  onClick?: MouseEventHandler<HTMLLIElement | HTMLAnchorElement>;
  href?: string;
  title: string;
  subtitle: string;
  icon?: any;
  notificationCount?: number;
  className?: string;
};

export const TabHeader: FC<TabHeaderProps> = ({
  tab,
  title,
  href,
  tabIndex,
  subtitle,
  icon,
  notificationCount,
  className,
  onClick,
}) => {
  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <a
        target="_blank"
        href={href}
        onClick={onClick}
        className={`${
          tab === tabIndex && 'bg-slate-200'
        } hover:bg-slate-100 border-b border-gray-200 cursor-pointer rounded-xl rounded-tr-none rounded-bl-none pt-1 hover:drop-shadow-lg  transition-all ease-in-out hover:scale-105 h-[5rem]  items-center flex justify-start mr-6`}
        rel="noreferrer"
      >
        {windowWidth > 1024 ? (
          <>
            <div
              className={`${
                icon ? 'visible' : 'invisible'
              } flex justify-center w-[10%]`}
            >
              {icon}
            </div>
          </>
        ) : null}

        <div className="flex flex-col w-full pl-4">
          <p
            className={` ${
              windowWidth > 1024 ? 'text-xl' : 'text-lg'
            } font-normal text-black transition-colors ease-in-out select-none`}
          >
            {title}
          </p>
          <p
            className={`${
              windowWidth > 1024 ? '' : 'hidden'
            } text-sm font-normal transition-colors ease-in-out select-none `}
          >
            {subtitle}
          </p>
        </div>
        <div className="w-[10%] pl-2 pr-10">
          <div
            className={`rounded-md min-w-[1.5rem] max-w-full flex ${className} ${
              notificationCount === 0 ? 'invisible' : 'visible'
            } select-none flex-grow-0 text-white justify-center text-sm`}
          >
            {notificationCount}
          </div>
        </div>
      </a>
    </>
  );
};
