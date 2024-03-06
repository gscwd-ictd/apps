/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { useContext } from 'react';
import { AuthmiddlewareContext } from '../../pages/_app';

const actionItems = ['Logout'];

export const ProfileMenu: FunctionComponent = () => {
  const { userProfile } = useContext(AuthmiddlewareContext);

  return (
    <>
      <Popover.Root>
        <Popover.Trigger
          className="w-2 h-2 sm:hidden lg:block"
          // className="h-full  select-none border border-gray-200 whitespace-nowrap rounded bg-slate-500 px-3 py-[0.2rem] transition-colors ease-in-out hover:bg-slate-400 active:bg-slate-600"
          asChild
          tabIndex={-1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-full h-full"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </Popover.Trigger>

        <Popover.Content className="shadow-2xl PopoverContent" sideOffset={5} collisionPadding={20} avoidCollisions>
          {actionItems.map((item: string, idx: number) => (
            <div className="z-50 flex w-full bg-white outline-none ring-0" key={idx}>
              <a
                rel="noreferrer"
                target="_blank"
                // href={`/employees/${employee.id}/${'leave-ledger'}`}
                href=""
                className={`active:bg-cyan-600 focus:bg-slate-300 hover:bg-slate-600 hover:text-white group text-xs flex w-full items-center py-3 px-4 z-50`}
              >
                {item}
              </a>
            </div>
          ))}
        </Popover.Content>
      </Popover.Root>
    </>
  );
};
