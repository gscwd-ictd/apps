import { ReactNode } from 'react';

type CardContainerProps = {
  bgColor: string;
  className: string;
  titleClassName: string;
  title: string;
  icon: any;
  remarks: string;
  subtitle: string;
  subtitleClassName: string;
  children: ReactNode;
};

export const CardContainer = ({
  bgColor,
  className,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  icon,
  remarks,
  children,
}: CardContainerProps) => {
  return (
    <>
      <div className={` mt-3 rounded-xl bg-${bgColor} pt-2 pb-10 shadow-md ${className} `}>
        <header>
          <div className="justify-between grid-cols-2 xs:grid sm:grid md:flex lg:flex">
            <h3 className={`${titleClassName} col-span-1 flex select-none items-end hover:text-indigo-800`}>
              {title}
              {icon}
            </h3>
            <div className="pt-2 mx-5 mt-3 italic lg:text-md md:text-md xs:text-xs sm:text-xs ">{remarks}</div>
          </div>

          <span className={`${subtitleClassName} col-span-1 select-none hover:text-indigo-800`}>{subtitle}</span>
        </header>
        <main>{children}</main>
      </div>
    </>
  );
};
