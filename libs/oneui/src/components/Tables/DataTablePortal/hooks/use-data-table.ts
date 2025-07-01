/* eslint-disable @nx/enforce-module-boundaries */
import {
  SortingState,
  RowSelectionState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  ColumnFiltersState,
  sortingFns,
  SortingFn,
  FilterFn,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { DataTableOptions } from '../types/data-table-options';
import { RankingInfo, rankItem, compareItems } from '@tanstack/match-sorter-utils';
import { ApprovalType } from '../../../../../../../libs/utils/src/lib/enums/approval-type.enum';
import { PassSlipStatus } from '../../../../../../../libs/utils/src/lib/enums/pass-slip.enum';
import { LeaveStatus } from '../../../../../../../libs/utils/src/lib/enums/leave.enum';
import { OvertimeStatus } from '../../../../../../../libs/utils/src/lib/enums/overtime.enum';
import { DtrCorrectionStatus } from '../../../../../../../libs/utils/src/lib/enums/dtr.enum';
import { TrainingStatus } from '../../../../../../../libs/utils/src/lib/enums/training.enum';
import { TrainingNominationStatus } from '../../../../../../../libs/utils/src/lib/enums/training.enum';

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    arrIncludesSomeCstm: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export const fuzzySort: SortingFn<unknown> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(rowA.columnFiltersMeta[columnId]?.itemRank, rowB.columnFiltersMeta[columnId]?.itemRank);
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const arrIncludesSomeCstmFilter: FilterFn<any> = (row, columnId: string, filterValue: unknown[]) => {
  if (Array.isArray(row.getValue<unknown>)) {
    return filterValue.some((val) => row.getValue<unknown[]>(columnId)?.includes(val));
  }
  return filterValue.some((val) => val === row.getValue<unknown>(columnId));
};

export const useDataTable = <T>(options: DataTableOptions<T>, type: ApprovalType) => {
  const { columns, data, enableRowSelection, columnVisibility } = options;

  const Approvaltype = type;

  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [globalFilter, setGlobalFilter] = useState('');

  const tableColumns = useMemo(() => columns, [columns]);

  const tableData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    filterFns: {
      fuzzy: fuzzyFilter,
      arrIncludesSomeCstm: arrIncludesSomeCstmFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
      columnFilters: [
        {
          id:
            Approvaltype !== ApprovalType.TRAINING_NOMINATION && Approvaltype !== ApprovalType.NA
              ? 'status'
              : Approvaltype === ApprovalType.TRAINING_NOMINATION
              ? 'nominationStatus'
              : 'label',
          value:
            // Approvaltype === ApprovalType.PASSSLIP
            //   ? PassSlipStatus.FOR_SUPERVISOR_APPROVAL
            // :
            Approvaltype === ApprovalType.LEAVE
              ? LeaveStatus.FOR_SUPERVISOR_APPROVAL
              : Approvaltype === ApprovalType.FINAL_LEAVE
              ? LeaveStatus.FOR_HRDM_APPROVAL
              : // : Approvaltype === ApprovalType.OVERTIME
              // ? OvertimeStatus.PENDING
              Approvaltype === ApprovalType.DTRCORRECTION
              ? DtrCorrectionStatus.PENDING
              : Approvaltype === ApprovalType.PDC_SECRETARIAT
              ? TrainingStatus.PDC_SECRETARIAT_APPROVAL
              : Approvaltype === ApprovalType.PDC_CHAIRMAN
              ? TrainingStatus.PDC_CHAIRMAN_APPROVAL
              : Approvaltype === ApprovalType.PDC_GM
              ? TrainingStatus.GM_APPROVAL
              : Approvaltype === ApprovalType.TRAINING_NOMINATION
              ? TrainingNominationStatus.NOMINATION_PENDING
              : Approvaltype === ApprovalType.NOMINEE_STATUS
              ? ''
              : '',
        },
      ],
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return { table };
};
