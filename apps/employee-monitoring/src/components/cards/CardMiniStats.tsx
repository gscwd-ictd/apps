import { FunctionComponent } from 'react';

type CardMiniStatsProps = {
  title: string | JSX.Element;
  icon: JSX.Element;
  value: string | number | JSX.Element;
  bgColor?: string;
  className?: string;
};

export const CardMiniStats: FunctionComponent<CardMiniStatsProps> = ({
  icon,
  title,
  value,
  className,
  bgColor = 'bg-white',
}) => {
  return (
    <div className={`flex w-full h-full ${bgColor} ${className}`}>
      <div className="flex w-full">
        <section className="flex flex-col px-5 h-full justify-evenly text-left w-[70%]">
          <div className="text-sm font-light text-gray-500 ">{title}</div>
          <div className="text-xl font-medium text-gray-600">{value}</div>
        </section>
        <section className="w-[30%] h-full shrink-0 flex items-center justify-center">
          {icon}
        </section>
      </div>
    </div>
  );
};
