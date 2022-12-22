import { FunctionComponent, ReactNode } from 'react';

type PageContentProps = {
  children: ReactNode | ReactNode[];
};

export const PageContent: FunctionComponent<PageContentProps> = ({ children }) => {
  return <div className="h-screen w-screen overflow-x-hidden bg-slate-100 flex">{children}</div>;
};
