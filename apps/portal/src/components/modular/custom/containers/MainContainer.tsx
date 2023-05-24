/* eslint-disable @nx/enforce-module-boundaries */
import { ReactNode } from 'react';

type MainContentProps = {
  children: ReactNode;
};

export const MainContainer: React.FC<MainContentProps> = ({
  children,
}): JSX.Element => {
  return (
    <>
      <div
        className={`pt-20 lg:pl-24 lg:pt-12
        h-screen overflow-y-auto`}
      >
        {children}
      </div>
    </>
  );
};
