import { useEffect, useState } from 'react';

interface Props {
  isShow: boolean;
  bgColor: string;
  message: string;
}
export const FloatingMessagePanel: React.FC<Props> = ({ isShow, message, bgColor = 'bg-rose-600' }) => {
  const [error, setError] = useState<boolean>(false);
  const [fade, setFade] = useState<boolean>(false);

  //make error message box appear and fade
  useEffect(() => {
    setError(isShow);
    setFade(true);
    if (fade) {
      const timeOut = setTimeout(() => {
        setError(false);
        setFade(false);
      }, 2500);
      return () => clearTimeout(timeOut);
    }
  }, [isShow]);

  return (
    <div
      className={`${
        error ? fade && `animate-fade top-2 right-2 w-44 h-auto rounded absolute p-2 shadow text-white z-20 ${bgColor}` : 'opacity-0 hidden'
      }  `}
      onAnimationEnd={() => setError(false)}
    >
      {message}
    </div>
  );
};
