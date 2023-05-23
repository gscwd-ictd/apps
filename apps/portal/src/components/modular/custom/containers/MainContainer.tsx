/* eslint-disable @nx/enforce-module-boundaries */
import { ReactNode } from 'react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

type MainContentProps = {
  children: ReactNode;
};

export const MainContainer: React.FC<MainContentProps> = ({
  children,
}): JSX.Element => {
  const { windowWidth } = UseWindowDimensions(); //get screen width and height
  return (
    <>
      <div
        className={`${
          windowWidth < 1024 ? 'pl-0 pt-16' : 'pl-24 pt-12'
        }  h-screen overflow-y-auto `}
      >
        {children}
      </div>
    </>
  );
};
