import cls from 'classnames';

export const asideClass = (collapse: boolean) => {
  return cls(
    'fixed shrink-0 h-screen overflow-x-hidden overflow-y-auto  transition-all duration-300 ease-in-out',
    {
      'w-16 xs:w-16 sm:w-16 md:w-16 lg:w-16': collapse,
      'w-64 xs:w-16 sm:w-16 md:w-64 lg:w-64': !collapse,
    }
  );
};
