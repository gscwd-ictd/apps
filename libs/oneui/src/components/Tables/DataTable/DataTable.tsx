import { FunctionComponent } from 'react';
import { flexRender } from '@tanstack/react-table';
import { DataTableProps } from './types/data-table-props';
import { SortableColumn } from './SortableColumn';
import { GlobalFilter } from './GlobalFilter';
import { ColumnFilter } from './ColumnFilter';
import { Button } from '@gscwd-apps/oneui';

export const DataTable: FunctionComponent<DataTableProps> = ({
  hydrating = false,
  model,
  width = 'auto',
  onRowClick,
  showGlobalFilter = false,
  showColumnFilter = false,
  paginate = false,
}) => {
  const resetInputs = () => {
    // model.setColumnFilters.
  };

  return (
    <>
      <div className="order-1 w-1/2 search-box-wrapper">
        {showGlobalFilter ? <GlobalFilter model={model} /> : null}
      </div>

      <div className="order-3 w-full search-box-wrapper py-5">
        {showColumnFilter ? (
          <>
            <p className="text-xs pb-1">Filters:</p>
            {model?.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex flex-wrap">
                {headerGroup.headers.map((header) => {
                  return header.isPlaceholder ? null : (
                    <div key={header.id}>
                      {header.column.getCanFilter() ? (
                        <div className=" w-1/4 pr-2">
                          <ColumnFilter
                            column={header.column}
                            model={model}
                            placeholder={header.column.columnDef.header}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}

            <Button onClick={() => resetDateInputs()} variant="info">
              <i className="bx bx-reset"></i>
            </Button>
          </>
        ) : null}
      </div>

      <div className="flex flex-col order-4 w-full h-full overflow-y-auto bg-white rounded-md">
        <table className="flex-1 w-full text-left whitespace-no-wrap bg-white table-auto">
          <thead className="sticky top-0 text-sm text-gray-600 bg-white border-b">
            {model?.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className={'header_level_' + headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-xs font-semibold text-left text-black align-middle border-l-0 border-r-0 bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap"
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: `${
                            header.column.getCanSort()
                              ? 'cursor-pointer'
                              : 'cursor-default'
                          } select-none flex items-center gap-2`,
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.getCanSort() && <SortableColumn />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {hydrating
              ? 'Loading data...'
              : model?.getRowModel().rows.map((row) => {
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
        </table>

        {model && paginate ? (
          <div className="flex items-center justify-end px-4 py-3 space-x-3 bg-white border-t border-gray-200 sm:px-6">
            {/* Next and Previous button */}
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => model.previousPage()}
                disabled={!model.getCanPreviousPage()}
              >
                {'Previous'}
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => model.nextPage()}
                disabled={!model.getCanNextPage()}
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
                    onClick={() => model.previousPage()}
                    disabled={!model.getCanPreviousPage()}
                  >
                    <i className="bx bxs-chevron-left"></i>
                    {'Previous'}
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 "
                    onClick={() => model.nextPage()}
                    disabled={!model.getCanNextPage()}
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
                {model.getState().pagination.pageIndex + 1} of{' '}
                {model.getPageCount()}
              </strong>
            </div>

            {/* Paginate size */}
            <div className="hidden text-gray-700 sm:flex">
              <select
                value={model.getState().pagination.pageSize}
                onChange={(e) => {
                  model.setPageSize(Number(e.target.value));
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
