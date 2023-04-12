import { Row, Table } from '@tanstack/react-table';

export type DataTableProps = {
  hydrating?: boolean;
  width?: 'fixed' | 'auto';
  model?: Table<any>;
  onRowClick?: (row: Row<any>) => void;
};
