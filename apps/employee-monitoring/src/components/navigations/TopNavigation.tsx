import { PageContentContext, Nav } from '@gscwd-apps/oneui';
import { useContext, useEffect } from 'react';

export const TopNavigation = () => {
  const {
    aside: { isCollapsed, setIsCollapsed },
  } = useContext(PageContentContext);

  return (
    <header
      id="page-topbar"
      // className="flex max-w-full py-4 pl-5 text-center pr-14"
      className={`fixed top-0 right-0 z-50 h-16 text-center left-16 bg-white shadow-xl  ${
        isCollapsed
          ? 'sm:left-16 md:left-16 lg:left-16'
          : 'sm:left-16 md:left-64 lg:left-64'
      }  shadow-slate-200/30 transition-all`}
    >
      <div className="flex justify-between h-16 pr-3 mx-2 my-auto text-center ">
        <section className="w-[30%] flex text-left">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </section>
        <section className="w-[50%]"></section>
        <section className="w-[20%]  flex justify-end hover:cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 animate-wiggle"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </div>
            <div className="flex items-center gap-2 shrink-0 ">
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
              <div className="hidden sm:hidden md:hidden lg:block">
                <span className="text-xs text-gray-600 select-none ">
                  user-example@gscwd.com
                </span>
              </div>
              <div className="w-2 h-2 sm:hidden lg:block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </div>
    </header>
  );
};
