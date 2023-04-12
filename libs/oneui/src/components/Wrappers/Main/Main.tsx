import { FunctionComponent, ReactNode } from 'react';

type MainProps = {
  children: ReactNode | ReactNode[];
  className?: string;
};

export const Main: FunctionComponent<MainProps> = ({ children, className }) => {
  return (
    <main
      className={`${className}  h-full w-full overflow-x-hidden bg-transparent`}
    >
      {children}
    </main>
  );
};
