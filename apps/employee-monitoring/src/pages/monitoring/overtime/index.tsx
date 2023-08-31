import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';

import { Overtime } from 'apps/employee-monitoring/src/utils/types/overtime.type';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime';

import { DataTable, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';

const mockDataModules: Array<Overtime> = [
  {
    id: 'dda572e1-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-08-31',
    immediateSupervisorName: 'Eric Sison',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda58b5e-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-09-02',
    immediateSupervisorName: 'Eric Sison',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda598b6-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-08-31',
    immediateSupervisorName: 'Rizza Baugbog',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda5adce-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-09-24',
    immediateSupervisorName: 'Eric Sison',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda5bc73-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-09-15',
    immediateSupervisorName: 'Rizza Baugbog',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda5d9c7-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-08-31',
    immediateSupervisorName: 'Eric Sison',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda5e67a-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-08-31',
    immediateSupervisorName: 'Eric Sison',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda5f284-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-08-31',
    immediateSupervisorName: 'Eric Sison',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda5ff92-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-08-31',
    immediateSupervisorName: 'Eric Sison',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda60b5d-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-08-31',
    immediateSupervisorName: 'Eric Sison',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },

  {
    id: 'dda60b5d-3816-11ee-8170-005056b680ac',
    plannedDate: '2023-08-31',
    immediateSupervisorName: 'Eric Sison',
    employees: [
      {
        employeeId: '001',
        companyId: '2000-001',
        fullName: 'Employee Name 1',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
      {
        employeeId: '002',
        companyId: '2000-002',
        fullName: 'Employee Name 2',
        scheduleBase: ScheduleBases.OFFICE,
        assignment: 'SDAD',
      },
    ],
    estimatedNoOfHours: 3,
    purpose: 'to finish up emergency task',
    status: OvertimeStatus.FOR_APPROVAL,
  },
];

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<Overtime>({} as Overtime);

  // fetch data for overtime applications
  const {
    data: overtimeApplications,
    error: overtimeApplicationsError,
    isLoading: overtimeApplicationsLoading,
    mutate: mutateOvertimeApplications,
  } = useSWR('/overtime-applications', fetcherEMS, {
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

  // Render row actions in the table component
  const renderRowActions = (rowData: Overtime) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          // onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>
      </div>
    );
  };

  const columnHelper = createColumnHelper<Overtime>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('plannedDate', {
      header: 'Date',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('immediateSupervisorName', {
      header: 'Supervisor Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('employees', {
      enableSorting: false,
      header: 'Employees',
      cell: (info) => JSON.stringify(info.getValue()),
    }),
    columnHelper.accessor('estimatedNoOfHours', {
      header: 'No Of Hours',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: mockDataModules,
    columnVisibility: { id: false },
  });

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Modules" />
        {/* Notifications */}
        {/* {!isEmpty(ErrorModules) ? (
          <ToastNotification toastType="error" notifMessage={ErrorModules} />
        ) : null} */}

        {/* {!isEmpty(ErrorModule) ? (
          <ToastNotification toastType="error" notifMessage={ErrorModule} />
        ) : null} */}

        <Can I="access" this="Modules">
          <div className="mx-5">
            <Card>
              {/* {modulesLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAddActionModal}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Add Module
                    </button>
                  </div>

                  <DataTable
                    model={table}
                    showGlobalFilter={true}
                    showColumnFilter={false}
                    paginate={true}
                  />
                </div>
              )} */}

              <div className="flex flex-row flex-wrap">
                <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
              </div>
            </Card>
          </div>

          {/* View modal */}
          {/* <ViwqOvertimeModal
            modalState={editModalIsOpen}
            setModalState={setEditModalIsOpen}
            closeModalAction={closeEditActionModal}
            rowData={currentRowData}
          /> */}
        </Can>
      </div>
    </>
  );
};

export default Index;
