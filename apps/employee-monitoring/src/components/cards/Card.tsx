import { FunctionComponent } from 'react';

type CardProps = {
  title?: string;
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
    <div
      className={`flex w-full h-full ${bgColor} ${className} overflow-hidden `}
    >
      <section className="w-full px-5 py-3 ">
        <div className="w-full pb-5 font-medium text-left text-gray-700">
          {title}
        </div>
        {children}
      </section>
    </div>
  );
};
