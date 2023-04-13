/* eslint-disable @typescript-eslint/ban-types */
import { FunctionComponent, useState, useMemo, useEffect } from 'react';
import { tableHeaderStyles } from './DataTableHrms.styles';
import { rankItem, rankings } from '@tanstack/match-sorter-utils';
import type { RankingInfo } from '@tanstack/match-sorter-utils';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  AccessorFn,
  SortingState,
  useReactTable,
  FilterFn,
} from '@tanstack/react-table';
import React from 'react';
// import { Pagination } from '../Pagination';

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue);

  // setValue if any initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // onChange(value);
  }, [value, onChange, debounce]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
};

// most of table work acceptably well with this function
const fuzzy = <TData extends Record<string, any> = {}>(
  row: Row<TData>,
  columnId: string,
  filterValue: string | number,
  addMeta: (item: RankingInfo) => void
) => {
  const itemRank = rankItem(row.getValue(columnId), filterValue as string, {
    threshold: rankings.MATCHES,
  });
  addMeta(itemRank);
  return itemRank.passed;
};

//  if the value is falsy, then the columnFilters state entry for that filter will removed from that array.
// https://github.com/KevinVandy/material-react-table/discussions/223#discussioncomment-4249221
fuzzy.autoRemove = (val: any) => !val;

// eslint-disable-next-line @typescript-eslint/ban-types
const contains = <TData extends Record<string, any> = {}>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
  row
    .getValue<string | number>(id)
    .toString()
    .toLowerCase()
    .trim()
    .includes(filterValue.toString().toLowerCase().trim());

contains.autoRemove = (val: any) => !val;

const startsWith = <TData extends Record<string, any> = {}>(
  row: Row<TData>,
  id: string,
  filterValue: string | number
) =>
  row
    .getValue<string | number>(id)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue.toString().toLowerCase().trim());

startsWith.autoRemove = (val: any) => !val;

export const filterFns = {
  fuzzy,
  contains,
  startsWith,
};

export type TablePropsHrms<T extends object> = {
  data: Array<T>;
  columns: Array<ColumnDef<T, unknown>>;
  paginate?: boolean;
  columnVisibility?: Record<string, boolean>;
  onRowClick?: (row: Row<T>) => void;
  showGlobalFilter?: boolean;
  filterFn?: FilterFn<T>;
  accessorFn?: AccessorFn<T>;
  isSelectable?: boolean;
  isDeletable?: boolean;
};

export const DataTableHrms = <T extends object>({
  data,
  columns,
  paginate,
  showGlobalFilter = false,
  columnVisibility,
  filterFn = filterFns.fuzzy,
  accessorFn,
  isDeletable,
  isSelectable,
  onRowClick,
}: TablePropsHrms<T>) => {
  // set state for sorting the table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [grouping, setGrouping] = useState([]);

  // set table columns
  const tableColumns = useMemo(() => columns, [columns]);

  // set table data
  const tableData = useMemo(() => data, [data]);

  // initialize table settings
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: { sorting, columnVisibility, globalFilter, columnFilters, grouping },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,

    globalFilterFn: filterFn,
  });

  return (
    <>
      <div className="order-1 w-1/2 search-box-wrapper">
        {showGlobalFilter ? (
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus-visible:outline-none w-60"
            placeholder="Search all columns..."
          />
        ) : null}
      </div>

      <div className="flex flex-col order-3 w-full h-full overflow-y-auto bg-white rounded-md">
        <table className="flex-1 w-full text-left whitespace-no-wrap bg-white table-auto">
          <thead className="sticky top-0 text-sm text-gray-600 bg-white border-b">
            {table.getHeaderGroups().map((group) => {
              return (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        className="px-6 py-3 text-xs font-semibold text-left text-black align-middle border-l-0 border-r-0 bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap"
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
          {data && data.length !== 0 ? (
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    onClick={onRowClick ? () => onRowClick(row) : () => null}
                    className="cursor-pointer odd:bg-slate-50 hover:bg-slate-100"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="p-4 px-6 text-xs align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap"
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
                <td colSpan={columns.length} className="text-xs text-center">
                  No records found
                </td>
              </tr>
            </tbody>
          )}
        </table>

        {data && paginate ? (
          <div className="flex items-center justify-end px-4 py-3 space-x-3 bg-white border-t border-gray-200 sm:px-6">
            {/* Next and Previous button */}
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                // onClick={() => previousPage()}
                // disabled={!canPreviousPage}
              >
                {'Previous'}
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                // onClick={() => nextPage()}
                // disabled={!canNextPage}
              >
                {'Next'}
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
              <div>
                <nav
                  className="inline-flex -space-x-px rounded-md shadow-sm isolate"
                  aria-label="Pagination"
                >
                  <button
                    className="relative inline-flex items-center px-2 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 "
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <i className="bx bxs-chevron-left"></i>
                    {'Previous'}
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 "
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
            <div className="hidden text-xs text-gray-700 sm:flex">
              <span className="pr-1">Page</span>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>{' '}
            </div>

            {/* Paginate size */}
            <div className="hidden text-gray-700 sm:flex">
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="text-xs font-medium text-gray-500 border border-gray-300 rounded-md"
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
    </>
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
