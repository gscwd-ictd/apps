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
  titleSize = 'xxxl',
  className,
  titleClassName = '',
  isArray = false,
  cols = 1,
  children,
}: CardContainerProps): JSX.Element => {
  return (
    <>
      <div className={`${className}  ${isArray ? '' : 'sm:mx-0 mx-[5%]'}`}>
        <h1
          className={`${titleClassName} flex justify-center text-center hover:text-indigo-800 ${
            isArray ? 'mx-[5%] mt-5 uppercase' : ''
          } ${size[titleSize]} `}
        >
          {title}
        </h1>
        {isArray ? (
          <div className={`${className}  grid grid-cols-1 gap-2 text-left font-light lg:grid  `}>{children}</div>
        ) : (
          <div
            className={`mx-2 grid grid-cols-${cols} ${
              cols > 1 ? 'justify-between' : 'xs:mx-0 sm:mx-0 md:mx-0 lg:mx-[10%] xl:mx-[10%]'
            } gap-2 text-left font-light`}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
};
