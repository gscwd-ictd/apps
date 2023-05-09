type PageProps = {
  title: string;
  subtitle: any;
  children: React.ReactNode | React.ReactNode[];
  pageClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export const Page = ({
  title = 'This is the Page Title',
  subtitle = 'This is the Page Subtitle',
  children,
  pageClassName = '',
  titleClassName = 'w-full text-3xl text-center',
  subtitleClassName = 'w-full text-3xl ',
}: PageProps) => {
  return (
    <>
      <div
        className={`${pageClassName} xs:mx-[1%] mt-16 mb-10 h-auto w-full select-none sm:mx-[1%] md:mx-[6%] lg:mx-[6%]`}
      >
        <div className={`${titleClassName} select-none hover:text-indigo-800`}>
          {title}
        </div>
        <div
          className={`${subtitleClassName} select-none hover:text-indigo-800`}
        >
          {subtitle}
        </div>
        {children}
      </div>
    </>
  );
};
