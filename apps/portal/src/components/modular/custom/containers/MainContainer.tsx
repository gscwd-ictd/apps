import { ReactNode } from 'react';

type MainContentProps = {
  children: ReactNode;
};

export const MainContainer: React.FC<MainContentProps> = ({
  children,
}): JSX.Element => {
  return (
    <>
      <div className="h-screen pl-24 overflow-y-auto pt-14">{children}</div>
    </>
  );
};
