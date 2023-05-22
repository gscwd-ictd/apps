import { ReactNode } from 'react';
import useWindowDimensions from '../../../fixed/window-size/useWindowDimensions';

type MainContentProps = {
  children: ReactNode;
};

export const MainContainer: React.FC<MainContentProps> = ({
  children,
}): JSX.Element => {
  const { windowWidth } = useWindowDimensions(); //get screen width and height
  return (
    <>
      <div
        className={`${
          windowWidth < 1024 ? 'pl-0' : 'pl-24'
        }  h-screen overflow-y-auto pt-14`}
      >
        {children}
      </div>
    </>
  );
};
