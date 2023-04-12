import React from 'react';
import { FunctionComponent } from 'react';
import { flexRender } from '@tanstack/react-table';
import { DataTableProps } from './types/data-table-props';
import { SortableColumn } from './SortableColumn';

export const DataTable: FunctionComponent<DataTableProps> = ({
  hydrating = false,
  model,
  width = 'auto',
  onRowClick,
}) => {
  console.log(model?.getRowModel().rows);

  return (
    <div>
      <div>
        <table>
          <thead>
            {model?.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope="col">
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
                        {/* {header.column.getCanSort() && <SortableColumn />} */}
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
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
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
      </div>
      {/* <footer>naa pa diri</footer> */}
    </div>
  );
};
