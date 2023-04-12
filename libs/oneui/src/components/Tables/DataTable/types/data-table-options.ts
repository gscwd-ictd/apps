import { ColumnDef } from '@tanstack/react-table';

export type DataTableOptions<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  enableRowSelection?: boolean;
};
