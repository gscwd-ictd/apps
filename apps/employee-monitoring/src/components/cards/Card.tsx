import { FunctionComponent } from 'react';

type CardProps = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  bgColor?: string;
};

export const Card: FunctionComponent<CardProps> = ({
  title,
  children,
  className,
  bgColor = 'bg-white',
}) => {
  return (
    <div className={`flex w-full h-full ${bgColor} ${className}`}>
      <section className="flex flex-col w-full m-5">
        <div className="w-full pb-5 font-medium text-left text-gray-600">
          {title}
        </div>
        {children}
      </section>
    </div>
  );
};
