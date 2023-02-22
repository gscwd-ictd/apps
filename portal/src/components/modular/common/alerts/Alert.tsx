import { FunctionComponent } from 'react';

type AlertProps = {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  animate?: boolean;
};

const alertType = {
  success: 'bg-emerald-100 border-emerald-300 text-emerald-800 bg-opacity-60',
  info: 'bg-indigo-100 border-indigo-300 text-indigo-700',
  warning: 'bg-orange-100 border-orange-300 text-orange-700',
  error: 'bg-red-100 border-rose-300 text-rose-700',
};

export const Alert: FunctionComponent<AlertProps> = ({ type, animate, message }) => {
  return (
    <>
      <div className={`${animate ? 'animate-shake' : null} ${alertType[type]} flex items-center gap-1 border-l-4 p-3`}>
        <p className="text-xs">{message}</p>
      </div>
    </>
  );
};
