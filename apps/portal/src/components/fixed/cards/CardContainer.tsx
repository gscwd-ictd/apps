const size = {
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
  xxl: 'text-2xl',
  xxxl: 'text-3xl',
};

type CardContainerProps = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
  titleClassName?: string;
  className?: string;
  isArray?: boolean;
  cols?: number;
  titleSize?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
};

export const CardContainer = ({
  title,
  titleSize = 'xxl',
  className,
  titleClassName = '',
  isArray = false,
  cols = 1,
  children,
}: CardContainerProps): JSX.Element => {
  return (
    <>
      <div className={`${className}`}>
        <h1
          className={`${titleClassName} flex hover:text-indigo-800 ${
            isArray ? 'mx-[5%] mt-5 justify-start uppercase' : 'justify-center'
          } ${size[titleSize]} `}
        >
          {title}
        </h1>
        {isArray ? (
          <div
            className={`${className}  grid grid-cols-1 gap-2 text-left font-light lg:grid  `}
          >
            {children}
          </div>
        ) : (
          <div
            className={` grid grid-cols-${cols} ${
              cols > 1 ? 'justify-between' : ''
            } gap-2 text-left font-light`}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
};
