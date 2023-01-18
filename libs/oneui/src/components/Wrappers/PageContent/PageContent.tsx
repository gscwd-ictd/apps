import { createContext, FunctionComponent, ReactNode, useState } from 'react';

type PageContentProps = {
  children?: ReactNode | ReactNode[];
};

type PageContentContextState = {
  //main : {},
  aside: { isCollapsed: boolean; setIsCollapsed: (state: boolean) => void };
  // header: {},
  // footer: {},
};

type AsideContextState = {
  isCollapsed: boolean;
  setIsCollapsed: (state: boolean) => void;
};

export const AsideContext = createContext({} as AsideContextState);

export const PageContentContext = createContext({} as PageContentContextState);

export const PageContent: FunctionComponent<PageContentProps> = ({
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <PageContentContext.Provider
      value={{ aside: { isCollapsed, setIsCollapsed } }}
    >
      <div className="flex w-screen h-screen overflow-x-hidden bg-slate-100">
        {children}
      </div>
    </PageContentContext.Provider>
  );
};
