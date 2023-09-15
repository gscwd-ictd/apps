import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import UseRenderOvertimeStatus from 'apps/employee-monitoring/src/utils/functions/RenderOvertimeStatus';

import { EmployeeOvertimeDetails } from 'libs/utils/src/lib/types/employee.type';
import { Overtime } from 'libs/utils/src/lib/types/overtime.type';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime.store';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ViewOvertimeModal from 'apps/employee-monitoring/src/components/modal/monitoring/overtime/ViewOvertimeModal';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';

// const mockData: Array<Overtime> = [
//   {
//     id: 'e5d69068-3ed6-459f-9b86-f08463454fc6',
//     plannedDate: '2023-09-08',
//     immediateSupervisorName: 'Michael G. Gabales',
//     employees: [
//       {
//         employeeId: '05b0614c-b191-11ed-a79b-000c29f95a80',
//         companyId: '2019-016',
//         fullName: 'John Henry S. Alfeche',
//         scheduleBase: ScheduleBases.OFFICE,
//         avatarUrl: 'http://172.20.110.45:4500/ALFECHE.jpg',
//         assignment: 'Systems Development and Application Division',
//       },
//       {
//         employeeId: '62f1cd41-b26f-11ed-a79b-000c29f95a80',
//         companyId: '2015-003',
//         fullName: 'Jay M. Sabio',
//         scheduleBase: ScheduleBases.PUMPING_STATION,
//         avatarUrl: 'http://172.20.110.45:4500/SABIO.jpg',
//         assignment: 'Water Quality, Production and Electromechanical Division',
//       },
//       {
//         employeeId: 'af635f15-b26e-11ed-a79b-000c29f95a80',
//         companyId: '2020-003',
//         fullName: 'Phyll Patrick C. Fragata',
//         scheduleBase: ScheduleBases.OFFICE,
//         avatarUrl: null,
//         assignment: 'Systems Development and Application Division',
//       },
//     ],
//     estimatedHours: 3,
//     purpose: 'Repair of computers',
//     status: OvertimeStatus.APPROVED,
//   },
// ];

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<Overtime>({} as Overtime);

  // fetch data for overtime applications
  const {
    data: overtimeApplications,
    error: overtimeApplicationsError,
    isLoading: overtimeApplicationsLoading,
    // mutate: mutateOvertimeApplications,
  } = useSWR('/overtime', fetcherEMS, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });

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
      header: 'Date',
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
                <div className="flex flex-row flex-wrap">
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
