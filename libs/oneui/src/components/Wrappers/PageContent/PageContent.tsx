import { createContext, FunctionComponent, ReactNode, useState } from 'react';

type PageContentProps = {
  children: ReactNode | ReactNode[];
};

type AsideContextState = {
  isCollapsed: boolean;
  setIsCollapsed: (state: boolean) => void;
};

export const AsideContext = createContext({} as AsideContextState);

export const PageContent: FunctionComponent<PageContentProps> = ({
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AsideContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex w-screen h-screen overflow-x-hidden bg-slate-100">
        {children}
      </div>
    </AsideContext.Provider>
  );
};
