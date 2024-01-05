import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, useDataTable } from '@gscwd-apps/oneui';
import { EmployeeAsOptionWithRestDays } from 'libs/utils/src/lib/types/employee.type';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import UseConvertRestDaysToString from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysToString';
import UseRenderRestDays from 'apps/employee-monitoring/src/utils/functions/RenderRestDays';

const ViewEmployeesSsTable = () => {
  const { currentScheduleSheet, scheduleSheet } = useScheduleSheetStore((state) => ({
    currentScheduleSheet: state.currentScheduleSheet,
    scheduleSheet: state.getScheduleSheetResponse,
  }));

  const [isDateRangeFilled, setIsDateRangeFilled] = useState<boolean>(false);

  // listens to date from and date to, if both are filled-out then set the state to true
  useEffect(() => {
    if (!isEmpty(currentScheduleSheet.dateFrom) && !isEmpty(currentScheduleSheet.dateTo)) {
      setIsDateRangeFilled(true);
    }
  }, [currentScheduleSheet.dateFrom, currentScheduleSheet.dateTo]);

  // Define table columns
  const columnHelper = createColumnHelper<EmployeeAsOptionWithRestDays>();
  const columns = [
    columnHelper.accessor('employeeId', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('fullName', {
      header: 'Full Name',
      enableSorting: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('positionTitle', {
      header: 'Position Title',
      enableSorting: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('restDays', {
      header: 'Rest Days',
      enableSorting: false,
      cell: (info) => UseRenderRestDays(UseConvertRestDaysToString(info.getValue())),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: currentScheduleSheet.employees,
    columnVisibility: { employeeId: false },
  });

  return (
    <>
      {isDateRangeFilled && !isEmpty(currentScheduleSheet.customGroupId) ? (
        <>
          {/* <hr className="mt-2 border border-dashed rounded " /> */}

          <p className="flex items-center justify-start w-full px-5 font-light">Employees</p>
          <hr className="h-1 mt-2 bg-gray-200 border-0 rounded" />
          <DataTable model={table} paginate={!isEmpty(currentScheduleSheet.employees) ? true : false} />
        </>
      ) : null}
    </>
  );
};

export default ViewEmployeesSsTable;
