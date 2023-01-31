import {
  createContext,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from 'react';

type PageContentProps = {
  children?: ReactNode | ReactNode[];
};

type PageContentContextState = {
  //main : {},
  aside: {
    isCollapsed: boolean;
    setIsCollapsed: (state: boolean) => void;
    previousState: boolean;
    setPreviousState: (state: boolean) => void;
  };
  // header: {},
  // footer: {},
};

export const PageContentContext = createContext({} as PageContentContextState);

export const PageContent: FunctionComponent<PageContentProps> = ({
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [previousState, setPreviousState] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 1080) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
    else if (!isMobile) setIsCollapsed(false);
  }, [isMobile, setIsCollapsed]);

  // create an event listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <PageContentContext.Provider
      value={{
        aside: { isCollapsed, setIsCollapsed, previousState, setPreviousState },
      }}
    >
      <div className="flex w-screen h-screen overflow-x-hidden bg-slate-100">
        {children}
      </div>
    </PageContentContext.Provider>
  );
};
