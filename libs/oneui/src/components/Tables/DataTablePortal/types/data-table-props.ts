/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import { Row, Table } from '@tanstack/react-table';

export type DataTableProps = {
  hydrating?: boolean;
  width?: 'fixed' | 'auto';
  model: Table<any>;
  onRowClick?: (row: Row<any>) => void;
  showGlobalFilter?: boolean;
  showColumnFilter?: boolean;
  paginate?: boolean;
};

export type DataTablePortalProps<T extends unknown> = {
  textSize?: 'text-xs' | 'text-md' | 'text-lg' | 'text-xl';
  hydrating?: boolean;
  width?: 'fixed' | 'auto';
  model: Table<any>;
  onRowClick?: (row: Row<T>) => void;
  showGlobalFilter?: boolean;
  showColumnFilter?: boolean;
  paginate?: boolean;
};
