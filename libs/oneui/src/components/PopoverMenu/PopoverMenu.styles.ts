import cls from 'classnames';

export const popoverClass = (size: 'sm' | 'md' | 'lg' | undefined) => {
  return cls('flex flex-col border border-100 rounded-md overflow-clip shadow-xl shadow-slate-200 max-h-96', {
    'max-w-sm': size === 'sm',
    'max-w-md': size === 'md',
    'max-w-lg': size === 'lg',
  });
};
