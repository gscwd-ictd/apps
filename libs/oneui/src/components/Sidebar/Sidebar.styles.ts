import cls from 'classnames';

export const sidebarClass = (
  classnames: string | undefined,
  background: string | undefined
) => {
  return cls(classnames, background, 'h-full w-full flex flex-col');
};

export const itemClass = (
  classnames: string | undefined,
  selected: boolean | undefined,
  hasSubItem: boolean | undefined
) => {
  return cls(
    classnames,
    'border-l-4 border-transparent w-full truncate  duration-100 ease-in-out transition-all',
    {
      'bg-sky-400/40': selected && !hasSubItem,
      'bg-sky-800/40': selected && hasSubItem,
    }
  );
};

export const linkClass = (
  collapsed: boolean,
  selected: boolean | undefined,
  isDarkMode: boolean | undefined
) => {
  return cls(
    'flex items-center font-light py-3 duration-100 ease-in-out transition-all',
    {
      'justify-center hover:pl-1': collapsed,

      'pl-4 gap-5': !collapsed,

      'text-slate-300/70 hover:text-slate-50': !selected && isDarkMode,

      'text-slate-200 hover:text-slate-50': selected && isDarkMode,

      'text-slate-800 hover:text-slate-900': !selected && !isDarkMode,

      'text-slate-600 hover:text-slate-900': selected && !isDarkMode,
    }
  );
};
