import cls from 'classnames';

export const asideClass = (collapse: boolean) => {
  return cls(
    'shrink-0 h-screen overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out',
    {
      'w-16': collapse,
      'w-64': !collapse,
    }
  );
};
