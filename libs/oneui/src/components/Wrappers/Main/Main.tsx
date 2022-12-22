import { FunctionComponent, ReactNode } from 'react';

type MainProps = {
  children: ReactNode | ReactNode[];
  className?: string;
};

export const Main: FunctionComponent<MainProps> = ({ children, className }) => {
  return <main className={`${className} h-full w-full flex-1 overflow-y-auto bg-transparent`}>{children}</main>;
};
