import { FunctionComponent } from 'react';

type CardMiniStatsProps = {
  title: string | JSX.Element;
  icon: JSX.Element;
  value: string | number | JSX.Element;
  bgColor?: string;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
};

export const CardMiniStats: FunctionComponent<CardMiniStatsProps> = ({
  icon,
  title,
  value,
  className,
  bgColor = 'bg-white',
  titleClassName = 'text-gray-500',
  valueClassName = 'text-gray-600',
}) => {
  return (
    <div className={`flex w-full h-full ${bgColor} ${className}`}>
      <div className="flex w-full">
        <section className="flex flex-col px-5 h-full justify-evenly text-left w-[70%]">
          <div
            className={`font-light ${titleClassName}  sm:text-xs md:text-sm lg:text-sm`}
          >
            {title}
          </div>
          <div className={`text-xl font-medium ${valueClassName} `}>
            {value}
          </div>
        </section>
        <section className="w-[30%] h-full shrink-0 flex items-center justify-center">
          {icon}
        </section>
      </div>
    </div>
  );
};
