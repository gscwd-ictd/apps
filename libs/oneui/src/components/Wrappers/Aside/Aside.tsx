import { FunctionComponent, ReactNode, useContext } from 'react';
import { PageContentContext } from '../PageContent';
import { asideClass } from './Aside.styles';

type AsideProps = {
  children: ReactNode | ReactNode[];
};

export const Aside: FunctionComponent<AsideProps> = ({ children }) => {
  const {
    aside: { isCollapsed },
  } = useContext(PageContentContext);

  return <aside className={asideClass(isCollapsed)}>{children}</aside>;
};
