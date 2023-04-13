import { OfficeSVG } from '../svgs/Office';

export const CardEmployee = () => {
  return (
    <div className="static flex flex-col w-full h-[18rem] bg-white rounded">
      {/** TOP PART */}
      <section className="min-w-full h-[50%] bg-sky-300/80 rounded-t">
        <div className="flex flex-col m-5">
          <span className="font-medium text-sky-800">Welcome Back!</span>
          <span className="text-xs font-normal text-sky-800">
            Employee Monitoring Dashboard
          </span>
        </div>
        <div className="flex justify-end w-full h-full pl-[50%] -mt-20">
          <OfficeSVG />
        </div>
      </section>

      {/** BOTTOM PART */}
      <section className="w-full h-[50%] rounded-b">
        <span className="font-medium text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mx-5 bg-white border rounded-full sm:w-6 sm:h-6 md:w-10 md:h-10 lg:w-16 lg:h-16 sm:-mt-8 lg:-mt-8 fill-slate-700/90"
          >
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <div className="flex flex-col m-5 ">
          <span className="font-medium text-gray-700">Employee Name</span>
          <span className="text-sm font-light text-gray-500 ">
            Position Title
          </span>
        </div>
      </section>
    </div>
  );
};
