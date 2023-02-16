import { FC, MouseEventHandler } from 'react';

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

export const TabHeader: FC<TabHeaderProps> = ({ tab, title, href, tabIndex, subtitle, icon, notificationCount, className, onClick }) => {
  return (
    <>
      <a
        target="_blank"
        href={href}
        onClick={onClick}
        className={`${
          tab === tabIndex && 'bg-slate-200'
        } border-b border-gray-200 cursor-pointer rounded-xl rounded-tr-none rounded-bl-none pt-1 hover:drop-shadow-lg  transition-all ease-in-out hover:scale-105 h-[5rem] bg-white items-center flex justify-start mr-6`}
      >
        <div className={`${icon ? 'visible' : 'invisible'} flex justify-center w-[10%]`}>{icon}</div>
        <div className="flex flex-col w-[80%]">
          <p className="text-xl  font-normal transition-colors ease-in-out select-none text-black">{title}</p>
          <p className="text-sm  font-normal transition-colors ease-in-out select-none ">{subtitle}</p>
        </div>
        <div className="w-[10%] px-4">
          <div
            className={`rounded-md min-w-[1.2rem] max-w-full flex ${className} ${
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
