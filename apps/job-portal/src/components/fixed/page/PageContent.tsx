import { createContext, FunctionComponent, ReactNode, useEffect, useState } from 'react';

type PageContentProps = {
  children?: ReactNode | ReactNode[];
};

type PageContentContextState = {
  //main : {},
  aside: {
    windowWidth: number;
    isCollapsed: boolean;
    setIsCollapsed: (state: boolean) => void;
    previousState: boolean;
    setPreviousState: (state: boolean) => void;
    isMobile: boolean;
    setIsMobile: (state: boolean) => void;
    isDarkMode: boolean;
    setIsDarkMode: (state: boolean) => void;
  };
  // header: {},
  // footer: {},
};

// hook
const useWidth = () => {
  const [width, setWidth] = useState(0);
  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);
  return width;
};

export const PageContentContext = createContext({} as PageContentContextState);

export const PageContent: FunctionComponent<PageContentProps> = ({ children }) => {
  const windowWidth = useWidth();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [previousState, setPreviousState] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (windowWidth < 1024) {
      setIsCollapsed(true);
      setIsMobile(true);
    } else if (windowWidth >= 1024) {
      setIsMobile(false);
    }
  }, [windowWidth]);

  // this use effect listens if the user clicked the (dark mode button)
  // useEffect(() => {
  //   setIsCollapsed(!isDarkMode);
  // }, [isDarkMode]);

  // this use effect listens if the user clicked the collapse button while the window width is greater that 1024
  useEffect(() => {
    if (!isMobile && !previousState) setIsCollapsed(false);
  }, [isMobile, previousState]);

  return (
    <PageContentContext.Provider
      value={{
        aside: {
          windowWidth,
          isCollapsed,
          setIsCollapsed,
          previousState,
          setPreviousState,
          isMobile,
          setIsMobile,
          isDarkMode,
          setIsDarkMode,
        },
      }}
    >
      <div className="flex flex-col flex-grow h-full w-full bg-slate-100 transition-all">{children}</div>
    </PageContentContext.Provider>
  );
};
