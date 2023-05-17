import React from 'react';

type CardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export const CardPreview = ({
  title = 'Title Here',
  subtitle = 'Subtitle Here',
  children,
  className = 'px-[5%] py-[2%]',
  titleClassName = 'w-full ',
  subtitleClassName = ' w-full font-extralight',
}: CardProps): JSX.Element => {
  return (
    <>
      <div
        className={`${className} col-span-1 mt-3 justify-between rounded border bg-white py-[5%] text-justify shadow-sm  shadow-slate-200  hover:bg-indigo-50  `}
      >
        <div
          className={`${titleClassName} select-none text-xl font-medium uppercase hover:text-indigo-800 `}
        >
          {title}
        </div>
        <div className={`${subtitleClassName} select-none`}>{subtitle}</div>
        <main>{children}</main>
      </div>
    </>
  );
};
