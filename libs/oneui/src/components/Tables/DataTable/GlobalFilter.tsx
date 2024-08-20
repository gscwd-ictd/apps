import { DebouncedInput } from './DebounceInput';
import { Table } from '@tanstack/react-table';

export const GlobalFilter = ({ model }: { model: Table<any> }) => {
  const filterValue = model.options.state.globalFilter;

  return (
    <div>
      <DebouncedInput
        type="search"
        value={filterValue ?? ''}
        onChange={(value) => model.setGlobalFilter(String(value))}
        className="text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus-visible:outline-none w-80 p-2.5"
        placeholder="Search all columns..."
      />
    </div>
  );
};
