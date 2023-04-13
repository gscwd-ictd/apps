import { FunctionComponent, ReactNode, useContext } from 'react';
import { PageContentContext } from '../PageContent';

type MainProps = {
  children: ReactNode | ReactNode[];
};

export const Main: FunctionComponent<MainProps> = ({ children }) => {
  const {
    aside: { isCollapsed },
  } = useContext(PageContentContext);

  return (
    <main
      className={`h-full overflow-x-hidden bg-transparent pt-14 lg:pt-16  ${
        isCollapsed
          ? ' sm:ml-16 md:ml-16 lg:ml-16 sm:left-16 md:left-16 lg:left-16'
          : ' sm:ml-16 md:ml-64 lg:ml-64 sm:left-16 md:left-16 lg:left-64'
      }`}
    >
      {children}
    </main>
  );
};
