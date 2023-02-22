import { useState } from 'react';

interface AlertProps {
  message: string;
}

export const Alert = ({ message }: AlertProps): JSX.Element => {
  const [animate, setAnimate] = useState(false);

  return (
    <>
      <section className="mb-3">
        <div onAnimationEnd={() => setAnimate(false)} className={`${animate ? 'animate-shake' : null} flex items-center gap-1 border-l-4 border-rose-300 bg-red-100 p-3`}>
          <p className="text-xs text-rose-700">{message}</p>
        </div>
      </section>
    </>
  );
};
