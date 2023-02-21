import { FunctionComponent, useState, useMemo } from 'react';
import { tableHeaderStyles } from './DataTableHrms.styles';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
// import { Pagination } from '../Pagination';

export type TablePropsHrms<T> = {
  data: Array<T>;
  columns: Array<ColumnDef<T, unknown>>;
  paginate?: boolean;
  columnVisibility?: Record<string, boolean>;
  onRowClick?: (row: Row<T>) => void;
};

// export type VisibilityState = Record<string, boolean>

// export type VisibilityTableState = {
//   columnVisibility: VisibilityState
// }

export const DataTableHrms = <T extends object>({
  data,
  columns,
  paginate,
  columnVisibility,
  onRowClick,
}: TablePropsHrms<T>) => {
  // set state for sorting the table
  const [sorting, setSorting] = useState<SortingState>([]);
  // const [columnVisibility, setColumnVisibility] = useState({})

  // set table columns
  const tableColumns = useMemo(() => columns, [columns]);

  // set table data
  const tableData = useMemo(() => data, [data]);

  // initialize table settings
  const table = useReactTable({
    columns: tableColumns,
    data: tableData,
    state: { sorting, columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-white rounded-md overflow-y-auto h-full w-full flex flex-col">
      <table className="w-full text-left table-auto whitespace-no-wrap bg-white flex-1">
        <thead className="text-sm text-gray-600 sticky top-0 bg-white border-b z-30">
          {table.getHeaderGroups().map((group) => {
            return (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  return (
                    <th key={header.id} scope="col" className="py-4 px-6">
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: tableHeaderStyles(
                              header.column.getCanSort()
                            ),
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && <SortableColumnSvg />}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>

        {/* start of table body */}
        {data.length !== 0 ? (
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : () => null}
                  className="odd:bg-slate-50 hover:bg-slate-100 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="py-3 px-6 border-gray-100">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        ) : (
          <tbody></tbody>
        )}
      </table>

      {/* {paginate && <Pagination table={table} />} */}
    </div>
  );
};

// custom svg for sortable table
const SortableColumnSvg: FunctionComponent = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-[0.6rem] h-[0.6rem] text-gray-300"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 320 512"
    >
      <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
    </svg>
  );
};
