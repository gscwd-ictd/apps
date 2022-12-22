import { createContext, FunctionComponent, ReactNode, useState } from 'react';
import { asideClass } from './Aside.styles';

type AsideContextState = {
  collapsed: boolean;
  setCollapsed: (state: boolean) => void;
};

type AsideProps = {
  children: ReactNode | ReactNode[];
};

export const AsideContext = createContext({} as AsideContextState);

export const Aside: FunctionComponent<AsideProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <AsideContext.Provider value={{ collapsed, setCollapsed }}>
      <aside className={asideClass(collapsed)}>{children}</aside>
    </AsideContext.Provider>
  );
};
