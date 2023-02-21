import { FunctionComponent } from 'react';

type NoticeProps = {
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const alertType = {
  success: 'bg-emerald-100 border-emerald-300 text-emerald-800 bg-opacity-60',
  info: 'bg-indigo-100 border-indigo-300 text-indigo-700',
  warning: 'bg-orange-100 border-orange-300 text-orange-700',
  error: 'bg-red-100 border-rose-300 text-rose-700',
};

export const Notice: FunctionComponent<NoticeProps> = ({ type, animate, title, message, size = 'sm' }) => {
  return (
    <>
      <div className={`${animate ? 'animate-shake' : null} ${alertType[type]} border-l-4 p-3`}>
        {title && <h3 className="uppercase font-semibold">{title}</h3>}
        <p className={`${size === 'sm' ? 'text-xs' : size === 'md' ? null : 'text-xl'}`}>{message}</p>
      </div>
    </>
  );
};
