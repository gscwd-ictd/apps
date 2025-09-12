import { FunctionComponent, ReactElement, useEffect } from 'react';
import { flexRender } from '@tanstack/react-table';
import { DataTablePortalProps, DataTableProps } from './types/data-table-props';
import { SortableColumn } from './SortableColumn';
import { Button } from '@gscwd-apps/oneui';
import { ColumnFilterPortal } from './ColumnFilterPortal';
import { GlobalFilterPortal } from './GlobalFilterPortal';

export const DataTablePortal = <T extends unknown>({
  textSize = 'text-md',
  hydrating = false,
  model,
  width = 'auto',
  onRowClick,
  showGlobalFilter = false,
  showColumnFilter = false,
  paginate = false,
}: DataTablePortalProps<T>): ReactElement => {
  const resetFilterInputs = () => {
    model.resetColumnFilters();
  };

  useEffect(() => {
    resetFilterInputs();
  }, []);

  // useEffect(() => {
  //   console.log(model.getHeaderGroups);
  // }, [model]);

  return (
    <>
      <div className="order-1 w-1/2 search-box-wrapper">
        {showGlobalFilter ? <GlobalFilterPortal model={model} /> : null}
      </div>

      <div className="order-2 w-full  column-filter-box-wrapper">
        {showColumnFilter ? (
          <div className="py-5">
            <p className={`pb-1 text-md`}>Filters:</p>
            {model?.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex flex-wrap items-center">
                {headerGroup.headers.map((header) => {
                  return header.isPlaceholder ? null : (
                    <div key={header.id}>
                      {header.column.getCanFilter() ? (
                        <div className="w-64 pr-2 text-md">
                          <ColumnFilterPortal
                            column={header.column}
                            model={model}
                            placeholder={header.column.columnDef.header}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                <div>
                  <Button id="resetButton" onClick={() => resetFilterInputs()} variant="primary">
                    <i className="bx bx-reset"></i>
                  </Button>
                  <div className="h-1" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="order-3 w-full flex overflow-x-auto">
        <table className="w-full px-6 py-1 bg-white rounded-md md:px-5 lg:px-4">
          <thead className="text-md text-gray-600 border-b">
            {model?.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={'header_level_' + headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-5 py-3 break-words text-md font-semibold text-left text-black align-middle border-l-0 border-r-0 bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: `${
                            header.column.getCanSort() ? 'cursor-pointer' : 'cursor-default'
                          } select-none flex items-center gap-2`,
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {header.column.getCanSort() && <SortableColumn />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {hydrating ? (
              'Loading data...'
            ) : model?.getRowModel().rows.length <= 0 ? (
              <tr>
                <td colSpan={model?.getAllColumns().length} className="py-5 text-md text-center text-gray-500">
                  --- No Data ---
                </td>
              </tr>
            ) : (
              model?.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    // onClick={onRowClick ? (row) => onRowClick(row.original) : () => null}
                    onClick={onRowClick ? () => onRowClick(row) : () => null}
                    className="cursor-pointer odd:bg-slate-50 hover:bg-slate-100"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="px-5 py-3 break-words text-md align-middle border-t-0 border-l-0 border-r-0"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {model && paginate ? (
        <div className="order-4 w-full flex px-6 py-3 space-x-3 bg-white border-t border-gray-200 sm:px-4">
          <div className="left-container w-full flex items-center sm:w-1/2"></div>
          <div className="right-container w-full flex items-center justify-end gap-2 sm:w-1/2">
            {/* Next and Previous button */}
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                className="relative inline-flex items-center px-4 py-2 text-md font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => model.previousPage()}
                disabled={!model.getCanPreviousPage()}
              >
                {'Previous'}
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 ml-3 text-md font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => model.nextPage()}
                disabled={!model.getCanNextPage()}
              >
                {'Next'}
              </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
              <div>
                <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
                  <button
                    className="cursor-pointer relative inline-flex items-center px-2 py-2 text-md font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 "
                    onClick={() => model.previousPage()}
                    disabled={!model.getCanPreviousPage()}
                  >
                    <i className="bx bxs-chevron-left"></i>
                    {'Previous'}
                  </button>
                  <button
                    className="cursor-pointer relative inline-flex items-center px-2 py-2 text-md font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 "
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
            <div className="hidden text-md text-gray-700 sm:flex">
              <div className="pr-1">Page</div>
              <div className="whitespace-nowrap">
                {model.getState().pagination.pageIndex + 1} of {model.getPageCount()}
              </div>
            </div>

            {/* Paginate size */}
            <div className="hidden text-gray-700 sm:flex">
              <select
                value={model.getState().pagination.pageSize}
                onChange={(e) => {
                  model.setPageSize(Number(e.target.value));
                }}
                className="text-md font-medium text-gray-500 border border-gray-300 rounded-md"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : null}
      {/* </div> */}
    </>
  );
};
