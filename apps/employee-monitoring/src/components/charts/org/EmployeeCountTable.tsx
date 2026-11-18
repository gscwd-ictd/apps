/* eslint-disable @nx/enforce-module-boundaries */
import { useMemo } from 'react';
import { DataTable, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import * as XLSX from 'xlsx';
import { EmployeeCount, excelButtonClass } from './chart-config';

export type EmployeeRow = {
  rank: number;
  employeeId: string;
  companyId: string;
  fullName: string;
  orgName: string;
  total: number;
  /** count per category (pass slip types) */
  byCategory: Record<string, number>;
};

/** one row per employee (categories become columns), highest first */
export const toEmployeeRows = (data: EmployeeCount[], sortCategory?: string): EmployeeRow[] => {
  const map = new Map<string, EmployeeRow>();
  (data ?? []).forEach((d) => {
    const row =
      map.get(d.employeeId) ??
      ({ rank: 0, employeeId: d.employeeId, companyId: d.companyId, fullName: d.fullName, orgName: d.orgName, total: 0, byCategory: {} } as EmployeeRow);
    row.total += d.count;
    if (d.category) row.byCategory[d.category] = (row.byCategory[d.category] ?? 0) + d.count;
    map.set(d.employeeId, row);
  });
  const value = (r: EmployeeRow) => (sortCategory ? r.byCategory[sortCategory] ?? 0 : r.total);
  return Array.from(map.values())
    .filter((r) => value(r) > 0)
    .sort((a, b) => value(b) - value(a) || a.fullName.localeCompare(b.fullName))
    .map((r, i) => ({ ...r, rank: i + 1 }));
};

type Props = {
  rows: EmployeeRow[];
  countLabel: string;
  orgLabel: string;
  categories?: { value: string; label: string }[];
  /** Excel title lines and file name */
  excelTitle: string[];
  excelFileName: string;
};

/** employees with their counts + Download Excel (on top of the table) */
export const EmployeeCountTable = ({ rows, countLabel, orgLabel, categories, excelTitle, excelFileName }: Props) => {
  const columnHelper = createColumnHelper<EmployeeRow>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('rank', { header: () => 'No.', enableSorting: false, cell: (info) => info.getValue() }),
      columnHelper.accessor('fullName', { header: () => 'Employee Name', enableSorting: true, cell: (info) => info.getValue() }),
      columnHelper.accessor('companyId', { header: () => 'Employee No.', enableSorting: true, cell: (info) => info.getValue() }),
      columnHelper.accessor('orgName', { header: () => orgLabel, enableSorting: true, cell: (info) => info.getValue() }),
      ...(categories ?? []).map((c) =>
        columnHelper.accessor((r) => r.byCategory[c.value] ?? 0, {
          id: `cat_${c.label}`,
          header: () => c.label,
          enableSorting: true,
          cell: (info) => info.getValue(),
        })
      ),
      columnHelper.accessor('total', {
        header: () => (categories?.length ? 'Total' : countLabel),
        enableSorting: true,
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      }),
    ],
    [orgLabel, countLabel, categories]
  );

  const { table } = useDataTable({ columns, data: rows });

  const downloadExcel = () => {
    const header = ['No.', 'Employee Name', 'Employee No.', orgLabel, ...(categories ?? []).map((c) => c.label), categories?.length ? 'Total' : countLabel];
    const aoa = [
      ...excelTitle.map((t) => [t]),
      [],
      header,
      ...rows.map((r) => [r.rank, r.fullName, r.companyId, r.orgName, ...(categories ?? []).map((c) => r.byCategory[c.value] ?? 0), r.total]),
    ];
    const sheet = XLSX.utils.aoa_to_sheet(aoa);
    sheet['!cols'] = [{ wch: 6 }, { wch: 35 }, { wch: 14 }, { wch: 50 }, ...(categories ?? []).map(() => ({ wch: 11 })), { wch: 14 }];
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Employees');
    XLSX.writeFile(book, `${excelFileName}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <button type="button" className={excelButtonClass} disabled={rows.length === 0} onClick={downloadExcel}>
          <i className="bx bxs-file-export"></i>
          Download Excel
        </button>
      </div>
      <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
    </div>
  );
};
