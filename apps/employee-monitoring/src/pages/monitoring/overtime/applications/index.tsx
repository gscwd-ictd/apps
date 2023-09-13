import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import UseRenderOvertimeStatus from 'apps/employee-monitoring/src/utils/functions/RenderOvertimeStatus';

import { EmployeeOvertimeDetails } from 'libs/utils/src/lib/types/employee.type';
import { Overtime } from 'apps/employee-monitoring/src/utils/types/overtime.type';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime.store';

import { DataTable, LoadingSpinner, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ViewOvertimeModal from 'apps/employee-monitoring/src/components/modal/monitoring/overtime/ViewOvertimeModal';

// const mockDataModules: Array<Overtime> = [
//   {
//     id: 'dda572e1-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-08-31',
//     immediateSupervisorName: 'Eric Sison',
//     employees: [
//       {
//         employeeId: '001',
//         companyId: '2000-001',
//         fullName: 'Ricardo Vicente Narvaiza',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//       {
//         employeeId: '002',
//         companyId: '2000-002',
//         fullName: 'Mikhail Anthony Sebua',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//       {
//         employeeId: '003',
//         companyId: '2000-003',
//         fullName: 'Allyn Joseph Cubero',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//       {
//         employeeId: '004',
//         companyId: '2000-004',
//         fullName: 'Alexis Aponesto',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//     ],
//     estimatedNoOfHours: 3,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.FOR_APPROVAL,
//   },

//   {
//     id: 'dda58b5e-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-09-02',
//     immediateSupervisorName: 'Eric Sison',
//     employees: [
//       {
//         employeeId: '005',
//         companyId: '2000-005',
//         fullName: 'Deo Delos Reyes',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//       {
//         employeeId: '006',
//         companyId: '2000-006',
//         fullName: 'Phyll Patrick Fragata',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//       {
//         employeeId: '007',
//         companyId: '2000-007',
//         fullName: 'John Henry Alfeche',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//     ],
//     estimatedNoOfHours: 2,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.FOR_APPROVAL,
//   },

//   {
//     id: 'dda598b6-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-08-31',
//     immediateSupervisorName: 'Rizza Baugbog',
//     employees: [
//       {
//         employeeId: '008',
//         companyId: '2000-008',
//         fullName: 'Kumier Lou Arancon',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'GIS',
//       },
//       {
//         employeeId: '009',
//         companyId: '2000-009',
//         fullName: 'Cara Jade Reyes',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'GIS',
//       },
//     ],
//     estimatedNoOfHours: 3,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.APPROVED,
//   },

//   {
//     id: 'dda5adce-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-09-24',
//     immediateSupervisorName: 'Darwin Dave Sarsale',
//     employees: [
//       {
//         employeeId: '010',
//         companyId: '2000-010',
//         fullName: 'Noel A. Alava',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'BAG',
//       },
//     ],
//     estimatedNoOfHours: 4,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.DISAPPROVED,
//   },

//   {
//     id: 'dda5bc73-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-09-15',
//     immediateSupervisorName: 'Melanie Nudos',
//     employees: [
//       {
//         employeeId: '011',
//         companyId: '2000-011',
//         fullName: 'Lipsy Grace C. Lucas',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'HRD',
//       },
//       {
//         employeeId: '012',
//         companyId: '2000-012',
//         fullName: 'Wilhem R. Aquino',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'HRD',
//       },
//       {
//         employeeId: '013',
//         companyId: '2000-013',
//         fullName: 'Haniel O. Decrepito',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'HRD',
//       },
//     ],
//     estimatedNoOfHours: 3,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.FOR_APPROVAL,
//   },

//   {
//     id: 'dda5d9c7-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-08-31',
//     immediateSupervisorName: 'Rizza Baugbog',
//     employees: [
//       {
//         employeeId: '014',
//         companyId: '2000-014',
//         fullName: 'Enriquito R. Carmona',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'GIS',
//       },
//       {
//         employeeId: '015',
//         companyId: '2000-015',
//         fullName: 'Gefrey O. Dumangcas',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'GIS',
//       },
//       {
//         employeeId: '016',
//         companyId: '2000-016',
//         fullName: 'Ricky C. Libertad',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'GIS',
//       },
//       {
//         employeeId: '017',
//         companyId: '2000-017',
//         fullName: 'Alfred V. Perez',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'GIS',
//       },
//     ],
//     estimatedNoOfHours: 8,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.APPROVED,
//   },

//   {
//     id: 'dda5e67a-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-08-31',
//     immediateSupervisorName: 'Lorevin V. Evangelio, ME',
//     employees: [
//       {
//         employeeId: '018',
//         companyId: '2000-018',
//         fullName: 'Jay M. Sabio',
//         scheduleBase: ScheduleBases.PUMPING_STATION,
//         assignment: 'WQD',
//       },
//       {
//         employeeId: '019',
//         companyId: '2000-019',
//         fullName: 'Nestor D. Sacor, Jr.',
//         scheduleBase: ScheduleBases.PUMPING_STATION,
//         assignment: 'WQD',
//       },
//     ],
//     estimatedNoOfHours: 3,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.APPROVED,
//   },

//   {
//     id: 'dda5f284-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-08-31',
//     immediateSupervisorName: 'Jennifer B. Manguramas',
//     employees: [
//       {
//         employeeId: '020',
//         companyId: '2000-020',
//         fullName: 'Ricky P. Gallibot',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'CSD',
//       },
//       {
//         employeeId: '021',
//         companyId: '2000-021',
//         fullName: 'Carlito C. Saron',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'CSD',
//       },
//       {
//         employeeId: '022',
//         companyId: '2000-022',
//         fullName: 'Rey M. Alcarde',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'CSD',
//       },
//       {
//         employeeId: '023',
//         companyId: '2000-023',
//         fullName: 'Conrad Ian N. Sudario',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'CSD',
//       },
//       {
//         employeeId: '024',
//         companyId: '2000-024',
//         fullName: 'Antonio Jose T. Turija',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'CSD',
//       },
//       {
//         employeeId: '025',
//         companyId: '2000-025',
//         fullName: 'Eduardo M. Zarate, Jr.',
//         scheduleBase: ScheduleBases.FIELD,
//         assignment: 'CSD',
//       },
//     ],
//     estimatedNoOfHours: 2,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.DISAPPROVED,
//   },

//   {
//     id: 'dda5ff92-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-08-31',
//     immediateSupervisorName: 'Eric Sison',
//     employees: [
//       {
//         employeeId: '001',
//         companyId: '2000-001',
//         fullName: 'Employee Name 1',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//       {
//         employeeId: '002',
//         companyId: '2000-002',
//         fullName: 'Employee Name 2',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//     ],
//     estimatedNoOfHours: 3,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.FOR_APPROVAL,
//   },

//   {
//     id: 'dda60b5d-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-08-31',
//     immediateSupervisorName: 'Eric Sison',
//     employees: [
//       {
//         employeeId: '001',
//         companyId: '2000-001',
//         fullName: 'Employee Name 1',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//       {
//         employeeId: '002',
//         companyId: '2000-002',
//         fullName: 'Employee Name 2',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//     ],
//     estimatedNoOfHours: 3,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.FOR_APPROVAL,
//   },

//   {
//     id: 'dda60b5d-3816-11ee-8170-005056b680ac',
//     plannedDate: '2023-08-31',
//     immediateSupervisorName: 'Eric Sison',
//     employees: [
//       {
//         employeeId: '001',
//         companyId: '2000-001',
//         fullName: 'Employee Name 1',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//       {
//         employeeId: '002',
//         companyId: '2000-002',
//         fullName: 'Employee Name 2',
//         scheduleBase: ScheduleBases.OFFICE,
//         assignment: 'SDAD',
//       },
//     ],
//     estimatedNoOfHours: 3,
//     purpose: 'to finish up emergency task',
//     status: OvertimeStatus.FOR_APPROVAL,
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
    mutate: mutateOvertimeApplications,
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
        {/* {!isEmpty(ErrorModules) ? (
          <ToastNotification toastType="error" notifMessage={ErrorModules} />
        ) : null} */}

        {/* {!isEmpty(ErrorModule) ? (
          <ToastNotification toastType="error" notifMessage={ErrorModule} />
        ) : null} */}

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
