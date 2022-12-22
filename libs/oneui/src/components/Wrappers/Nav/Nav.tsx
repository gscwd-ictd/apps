import { FunctionComponent, ReactNode } from 'react';

type NavProps = {
  children: ReactNode | ReactNode[];
};

export const Nav: FunctionComponent<NavProps> = ({ children }) => {
  return <nav className="bg-white h-16 shadow-xl shadow-slate-200/30">{children}</nav>;
};
