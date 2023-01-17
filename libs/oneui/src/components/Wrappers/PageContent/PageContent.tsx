import { createContext, FunctionComponent, ReactNode, useState } from 'react';

type PageContentProps = {
  header: JSX.Element;
  sidebar: JSX.Element;
  main: JSX.Element;
  children?: ReactNode | ReactNode[];
  footer?: JSX.Element;
};

type AsideContextState = {
  isCollapsed: boolean;
  setIsCollapsed: (state: boolean) => void;
};

export const AsideContext = createContext({} as AsideContextState);

export const PageContent: FunctionComponent<PageContentProps> = ({
  main,
  header,
  sidebar,
  children,
  footer,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AsideContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex w-screen h-screen overflow-x-hidden bg-slate-100">
        {sidebar}
        <div className="flex flex-col w-full">
          {header}
          {main}
          {children}
          {footer}
        </div>
      </div>
    </AsideContext.Provider>
  );
};
