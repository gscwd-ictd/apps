import { useMemo } from 'react';
import { DebouncedInput } from './DebounceInput';
import { Column, Table } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';

export const ColumnFilterPortal = ({
  column,
  model,
  placeholder,
}: {
  column: Column<any, unknown>;
  model: Table<any>;
  placeholder: unknown | undefined;
}) => {
  const firstValue = model.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () => (typeof firstValue === 'number' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
          placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
          className="w-24 border rounded shadow"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
          placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
          className="w-24 border rounded shadow"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'} className="capitalize">
        {sortedUniqueValues
          .slice(0, 5000)
          .map((value: any, index: number) =>
            dayjs(value).format('MM-DD-YYYY') !== 'Invalid Date' ? (
              <option value={value} label={`${dayjs(value).format('MM-DD-YYYY')}`} key={index}></option>
            ) : !isEmpty(value[0]?.fullName) ? (
              <option value={value[0].fullName} key={index} />
            ) : (
              <option value={value} key={index} />
            )
          )}
      </datalist>

      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`${placeholder}... (${column.getFacetedUniqueValues().size})`}
        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus-visible:outline-none w-full column-filter-input"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  );
};
