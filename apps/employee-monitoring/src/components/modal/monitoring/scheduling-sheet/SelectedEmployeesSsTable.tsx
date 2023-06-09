import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { NoGroupSelectedVisual } from './NoGroupSelected';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, useDataTable } from '@gscwd-apps/oneui';
import { EmployeeAsOptionWithRestDays } from 'libs/utils/src/lib/types/employee.type';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import SelectRdByNModal from './SelectRdByNModal';
import UseConvertRestDaysToString from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysToString';
import UseRenderRestDays from 'apps/employee-monitoring/src/utils/functions/RenderRestDays';

const SelectedEmployeesSsTable = () => {
  const { currentScheduleSheet } = useScheduleSheetStore((state) => ({
    currentScheduleSheet: state.currentScheduleSheet,
  }));

  const [isDateRangeFilled, setIsDateRangeFilled] = useState<boolean>(true);

  const [currentRowData, setCurrentRowData] =
    useState<EmployeeAsOptionWithRestDays>({} as EmployeeAsOptionWithRestDays);

  const [restDaysModalIsOpen, setRestDaysModalIsOpen] =
    useState<boolean>(false);
  const openRestDaysModal = (rowData: EmployeeAsOptionWithRestDays) => {
    setRestDaysModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeRestDaysModal = () => {
    setRestDaysModalIsOpen(false);
  };

  // listens to date from and date to, if both are filled-out then set the state to true
  useEffect(() => {
    if (
      !isEmpty(currentScheduleSheet.dateFrom) &&
      !isEmpty(currentScheduleSheet.dateTo)
    ) {
      setIsDateRangeFilled(true);
    }
  }, [currentScheduleSheet.dateFrom, currentScheduleSheet.dateTo]);

  // Render row actions in the table component
  const renderRowActions = (rowData: EmployeeAsOptionWithRestDays) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openRestDaysModal(rowData)}
        >
          <i className="text-md bx bxs-sleepy"></i>
        </button>
      </div>
    );
  };

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
      cell: (info) =>
        UseRenderRestDays(UseConvertRestDaysToString(info.getValue())),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="flex justify-center w-full">Edit</div>,
      enableColumnFilter: false,
      cell: (props) => renderRowActions(props.row.original),
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
      {currentScheduleSheet &&
      isDateRangeFilled &&
      !isEmpty(currentScheduleSheet.customGroupId) ? (
        <>
          <SelectRdByNModal
            modalState={restDaysModalIsOpen}
            setModalState={setRestDaysModalIsOpen}
            closeModalAction={closeRestDaysModal}
            rowData={currentRowData}
          />

          <DataTable
            model={table}
            paginate={!isEmpty(currentScheduleSheet.employees) ? true : false}
          />
        </>
      ) : null}
    </>
  );
};

export default SelectedEmployeesSsTable;
