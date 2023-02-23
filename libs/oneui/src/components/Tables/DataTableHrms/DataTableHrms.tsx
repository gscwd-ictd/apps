import { FunctionComponent, useState, useMemo, useEffect } from 'react';
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
  FilterFn,
} from '@tanstack/react-table';
import React from 'react';
// import { Pagination } from '../Pagination';

export type TablePropsHrms<T> = {
  data: Array<T>;
  columns: Array<ColumnDef<T, unknown>>;
  paginate?: boolean;
  columnVisibility?: Record<string, boolean>;
  onRowClick?: (row: Row<T>) => void;
};

export const DataTableHrms = <T extends object>({
  data,
  columns,
  paginate,
  columnVisibility,
  onRowClick,
}: TablePropsHrms<T>) => {
  // set state for sorting the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // set table columns
  const tableColumns = useMemo(() => columns, [columns]);

  // set table data
  const tableData = useMemo(() => data, [data]);

  // initialize table settings
  const table = useReactTable({
    columns: tableColumns,
    data: tableData,
    // filterFns: {
    //   fuzzy: fuzzyFilter,
    // },
    state: { sorting, columnVisibility, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: fuzzyFilter,
  });

  function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value);
      }, debounce);

      return () => clearTimeout(timeout);
    }, [value]);

    return (
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }

  return (
    <React.Fragment>
      <div className="search-box-wrapper order-1 w-1/2">
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 focus-visible:outline-none w-60"
          placeholder="Search all columns..."
        />
      </div>

      <div className="bg-white rounded-md overflow-y-auto h-full w-full flex flex-col order-3">
        <table className="w-full text-left table-auto whitespace-no-wrap bg-white flex-1">
          <thead className="text-sm text-gray-600 sticky top-0 bg-white border-b z-30">
            {table.getHeaderGroups().map((group) => {
              return (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border-blueGray-100 py-3 border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                      >
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
                            {header.column.getCanSort() && (
                              <SortableColumnSvg />
                            )}
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
                        <td
                          key={cell.id}
                          className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                        >
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
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center text-xs">
                  No records found
                </td>
              </tr>
            </tbody>
          )}
        </table>

        {paginate ? (
          <div className="flex items-center justify-end border-t border-gray-200 bg-white px-4 py-3 sm:px-6 space-x-3">
            {/* Next and Previous button */}
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                // onClick={() => previousPage()}
                // disabled={!canPreviousPage}
              >
                {'Previous'}
              </button>
              <button
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                // onClick={() => nextPage()}
                // disabled={!canNextPage}
              >
                {'Next'}
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <i className="bx bxs-chevron-left"></i>
                    {'Previous'}
                  </button>
                  <button
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {'Next'}
                    <i className="bx bxs-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>

            {/* Page number */}
            <div className="hidden sm:flex text-xs text-gray-700">
              <span className="pr-1">Page</span>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>{' '}
            </div>

            {/* Paginate size */}
            <div className="hidden sm:flex text-gray-700">
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="rounded-md border border-gray-300 font-medium text-gray-500 text-xs"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}
      </div>
    </React.Fragment>
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
