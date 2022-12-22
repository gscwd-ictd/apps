import cls from 'classnames';

export const sidebarClass = (classnames: string | undefined, background: string | undefined) => {
  return cls(classnames, background, 'h-full w-full flex flex-col');
};

export const itemClass = (classnames: string | undefined, selected: boolean | undefined) => {
  return cls(classnames, 'w-full hover:bg-slate-700/50 border-l-4 duration-100 ease-in-out transition-all', {
    'border-l-transparent': !selected,
    'border-l-green-500 bg-slate-700/50': selected,
  });
};

export const linkClass = (collapsed: boolean, selected: boolean | undefined) => {
  return cls('flex items-center hover:text-slate-50 font-medium py-3 duration-100 ease-in-out transition-all', {
    'justify-center': collapsed,

    'pl-4 gap-5': !collapsed,

    'text-slate-300/70': !selected,

    'text-slate-200': selected,
  });
};
