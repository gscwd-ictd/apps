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
  isTable?: boolean;
};

export const Card = ({
  title = 'Title Here',
  subtitle = 'Subtitle Here',
  icon,
  bgColor = 'white',
  children,
  className = 'sm:mx-0 lg:mx-[10%]',
  titleClassName = 'w-full text-2xl',
  subtitleClassName = 'text-sm w-full font-extralight',
  remarks,
  isTable = false,
}: CardProps): JSX.Element => {
  return (
    <>
      <div className={` mt-3 rounded border pt-2 pb-10 bg-${bgColor} shadow-md ${className} `}>
        <header className="">
          <div className="w-full grid grid-cols-2 py-4 px-[3%]">
            <div className="col-span-1 ">
              <h3 className={`${titleClassName}  flex select-none items-end hover:text-indigo-800`}>
                {title}
                {icon}
              </h3>
              <div className={`${subtitleClassName} select-none hover:text-indigo-800`}>{subtitle}</div>
            </div>

            <div className="lg:text-md md:text-md xs:text-xs col-span-1 w-full flex justify-end">{remarks}</div>
          </div>
        </header>

        <main className={` ${!isTable && 'px-[3%]'}`}>{children}</main>
      </div>
    </>
  );
};
