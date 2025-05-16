import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import UseRenderOvertimeStatus from 'apps/employee-monitoring/src/utils/functions/RenderOvertimeStatus';
import { EmployeeOvertimeDetails } from 'libs/utils/src/lib/types/employee.type';
import { Overtime } from 'libs/utils/src/lib/types/overtime.type';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime.store';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ConvertToYearMonth from 'apps/employee-monitoring/src/utils/functions/ConvertToYearMonth';

import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ViewOvertimeModal from 'apps/employee-monitoring/src/components/modal/monitoring/overtime/ViewOvertimeModal';
import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';

type Filter = {
  monthYear: string;
};

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<Overtime>({} as Overtime);

  // Zustand initialization
  const {
    OvertimeApplications,
    SetOvertimeApplications,

    ErrorOvertimeApplications,
    SetErrorOvertimeApplications,
  } = useOvertimeStore((state) => ({
    OvertimeApplications: state.overtimeApplications,
    SetOvertimeApplications: state.setOvertimeApplications,

    ErrorOvertimeApplications: state.errorOvertimeApplications,
    SetErrorOvertimeApplications: state.setErrorOvertimeApplications,
  }));

  const yupSchema = yup.object().shape({
    monthYear: yup.date().max(new Date(), 'Must not be greater than current date').nullable(),
  });

  // React hook form
  const { register, watch } = useForm<Filter>({
    mode: 'onChange',
    defaultValues: {
      monthYear: ConvertToYearMonth(dayjs().toString()),
    },
    resolver: yupResolver(yupSchema),
  });
  const watchMonthYear = watch('monthYear');

  // fetch data for overtime applications
  const {
    data: overtimeApplications,
    error: overtimeApplicationsError,
    isLoading: overtimeApplicationsLoading,
  } = useSWR(`/overtime/monthly/${watchMonthYear}`, fetcherEMS, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });

  // View modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewActionModal = (rowData: Overtime) => {
    setViewModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeViewActionModal = () => setViewModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: Overtime) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openViewActionModal(rowData)}
        >
          <i className="bx bx-show"></i>
        </button>
      </div>
    );
  };
  // Rendering of leave dates in row
  const renderRowEmployees = (employees: Array<EmployeeOvertimeDetails>) => {
    if (employees) {
      if (employees.length > 2) {
        return (
          <p className="leading-6">
            {employees.slice(0, 2).map((employee: EmployeeOvertimeDetails) => (
              <span
                className="bg-gray-300 text-gray-700 text-xs px-1 py-0.5 ml-1 rounded text-center"
                key={employee.employeeId}
              >
                {employee.fullName}
              </span>
            ))}
            <br></br>
            <span className=" text-gray-700 text-xs px-1 py-0.5 ml-1"> and {employees.length - 2} others...</span>
          </p>
        );
      } else {
        return employees.map((employee: EmployeeOvertimeDetails) => (
          <span
            className="bg-gray-300 text-gray-700 text-xs px-1 py-0.5 ml-1 rounded text-center"
            key={employee.employeeId}
          >
            {employee.fullName}
          </span>
        ));
      }
    }
  };

  const columnHelper = createColumnHelper<Overtime>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('plannedDate', {
      header: 'Planned Date',
      filterFn: 'equalsString',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('immediateSupervisorName', {
      header: 'Supervisor Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'employees',
      header: 'Employees',
      enableColumnFilter: false,
      cell: (props) => renderRowEmployees(props.row.original.employees),
    }),
    columnHelper.accessor('estimatedHours', {
      header: 'No Of Hours',
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      filterFn: 'equals',
      cell: (info) => UseRenderOvertimeStatus(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      enableColumnFilter: false,
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: OvertimeApplications,
    columnVisibility: { id: false },
  });

  useEffect(() => {
    if (!isEmpty(overtimeApplications)) {
      SetOvertimeApplications(overtimeApplications.data);
    }

    if (!isEmpty(overtimeApplicationsError)) {
      SetErrorOvertimeApplications(overtimeApplicationsError.message);
    }
  }, [overtimeApplications, overtimeApplicationsError]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Overtime Applications" />
        {/* Notifications */}
        {!isEmpty(ErrorOvertimeApplications) ? (
          <ToastNotification toastType="error" notifMessage={ErrorOvertimeApplications} />
        ) : null}

        <Can I="access" this="Overtime_applications">
          <div className="mx-5">
            <Card>
              {overtimeApplicationsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap justify-between">
                  <form className="order-2">
                    <LabelInput
                      id="monthYear"
                      type="month"
                      controller={{ ...register('monthYear') }}
                      className="mb-6"
                    />
                  </form>

                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={true} paginate={true} />
                </div>
              )}
            </Card>
          </div>

          {/* View modal */}
          <ViewOvertimeModal
            modalState={viewModalIsOpen}
            setModalState={setViewModalIsOpen}
            closeModalAction={closeViewActionModal}
            rowData={currentRowData}
          />
        </Can>
      </div>
    </>
  );
};

export default Index;
