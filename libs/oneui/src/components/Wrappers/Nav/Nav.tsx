import { FunctionComponent, ReactNode } from 'react';

type NavProps = {
  children: ReactNode | ReactNode[];
};

export const Nav: FunctionComponent<NavProps> = ({ children }) => {
  return (
    <nav className="h-16 bg-white shadow-xl shadow-slate-200/30">
      {children}
    </nav>
  );
};
