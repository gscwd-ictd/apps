import cx from 'classnames';

export const tableHeaderStyles = (sortable: boolean) => {
  return cx({
    'cursor-pointer select-none flex items-center gap-2 text-xs text-black':
      sortable,
  });
};
