import React from 'react';

type CardProps = {
  title: string;
  icon?: any;
  subtitle: string;
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  remarks?: JSX.Element | string;
  bgColor?: string;
};

export const Card = ({
  title = 'Title Here',
  subtitle = 'Subtitle Here',
  icon,
  bgColor = 'white',
  children,
  className = 'px-[3%] mx-[10%]',
  titleClassName = 'w-full mt-5 text-2xl',
  subtitleClassName = 'mt-5 w-full font-extralight',
  remarks,
}: CardProps): JSX.Element => {
  return (
    <>
      <div
        className={` mt-3 rounded-xl border bg-${bgColor} pt-2 pb-10 shadow-md ${className} `}
      >
        <header>
          <div className="xs:grid grid-cols-2 justify-between sm:grid md:flex lg:flex">
            <div className="col-span-1">
              <h3
                className={`${titleClassName}  flex select-none items-end hover:text-indigo-800`}
              >
                {title}
                {icon}
              </h3>
              <span
                className={`${subtitleClassName} select-none hover:text-indigo-800`}
              >
                {subtitle}
              </span>
            </div>

            <div className=" lg:text-md md:text-md xs:text-xs col-span-1 pt-2 italic sm:text-xs ">
              {remarks}
            </div>
          </div>
        </header>
        <main className="mt-10">{children}</main>
      </div>
    </>
  );
};
