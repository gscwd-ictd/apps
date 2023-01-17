import { FunctionComponent, ReactNode, useContext } from 'react';
import { AsideContext } from '../PageContent';
import { asideClass } from './Aside.styles';

type AsideProps = {
  children: ReactNode | ReactNode[];
};

export const Aside: FunctionComponent<AsideProps> = ({ children }) => {
  const { isCollapsed } = useContext(AsideContext);

  return <aside className={asideClass(isCollapsed)}>{children}</aside>;
};
