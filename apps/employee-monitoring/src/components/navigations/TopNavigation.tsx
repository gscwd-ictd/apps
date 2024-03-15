/* eslint-disable react-hooks/exhaustive-deps */
import { PageContentContext } from '@gscwd-apps/oneui';
import { useContext, useEffect, useState } from 'react';
import { AuthmiddlewareContext } from '../../pages/_app';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import * as Popover from '@radix-ui/react-popover';

type ActionItem = {
  action: string;
  icon: string;
  fontColor: string;
  url: string;
};

const actionItems = [
  {
    action: 'HRMS Modules',
    icon: 'bx-home',
    fontColor: 'green-600',
    url: `${process.env.NEXT_PUBLIC_HRMS_DOMAIN_FE}/module-dashboard`,
  },
  {
    action: 'Logout',
    icon: 'bx-power-off',
    fontColor: 'red-500',
    url: `${process.env.NEXT_PUBLIC_HRMS_DOMAIN_FE}/logout`,
  },
];

export const TopNavigation = () => {
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const {
    aside: { isCollapsed, setIsCollapsed, isMobile, setPreviousState },
  } = useContext(PageContentContext);

  const { userProfile } = useContext(AuthmiddlewareContext);

  // on click toggle
  const collapseOnClick = () => {
    setIsCollapsed(!isCollapsed);
    setIsToggled(true);
  };

  // preserve the value of isCollapsed
  useEffect(() => {
    if (isToggled) {
      setPreviousState(isCollapsed);
      setIsToggled(false);
    }
  }, [isCollapsed, isToggled]);

  return (
    <header
      id="page-topbar"
      className={`fixed top-0 right-0 z-50 h-16 text-center left-16 bg-white shadow-xl transition-all  ${
        isCollapsed ? 'sm:left-16 md:left-16 lg:left-16' : 'sm:left-16 md:left-64 lg:left-64'
      }  shadow-slate-200/30 transition-all`}
    >
      <div className="flex justify-between h-16 pr-3 mx-2 my-auto text-center ">
        <section className="w-[20%] flex text-left">
          <button
            onClick={collapseOnClick}
            disabled={isMobile}
            hidden={isMobile}
            className="text-gray-700 bg-transparent "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 "
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </section>

        <section className="w-[50%]"></section>

        <section className="w-[30%]  flex justify-end hover:cursor-pointer">
          <Popover.Root>
            <Popover.Trigger asChild tabIndex={-1}>
              <div className="flex items-center gap-2">
                {/* User photo */}
                <div className="flex items-center gap-2 shrink-0 ">
                  {/* Default user profile photo */}
                  {isEmpty(userProfile?.photoUrl) ? (
                    <div className="text-gray-500 ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-[2rem]">
                      <Image
                        src={userProfile?.photoUrl}
                        width={100}
                        height={100}
                        alt="employee-photo"
                        className="h-auto max-w-full align-middle rounded-full shadow border-solid border-2 border-[#e5e5e5]"
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div className="hidden sm:hidden md:hidden lg:block">
                    <span className="text-xs text-gray-600 select-none ">{userProfile?.email ?? 'SuperUserAdmin'}</span>
                  </div>
                </div>

                {/* Chevron icon */}
                <div className="w-2 h-2 sm:hidden lg:block">
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
                </div>
              </div>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                className="rounded p-1 w-[160px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)]
                focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)]
                will-change-[transform,opacity]
                data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade
                data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade PopoverContent"
                sideOffset={3}
                collisionPadding={20}
                avoidCollisions
              >
                {actionItems.map((item: ActionItem, idx: number) => (
                  <div className="z-50w-full bg-white outline-none ring-0  p-3" key={idx}>
                    <a
                      rel="noreferrer"
                      href={item.url}
                      className={`active:text-slate-600 focus:text-slate-600 hover:text-slate-600 group text-xs flex w-full items-center z-50 gap-2`}
                    >
                      <i className={`bx ${item.icon} text-sm text-${item.fontColor}`} />
                      {item.action}
                    </a>
                  </div>
                ))}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </section>
      </div>
    </header>
  );
};
