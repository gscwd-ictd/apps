/* eslint-disable @nx/enforce-module-boundaries */
import {
  DataTable,
  LoadingSpinner,
  ToastNotification,
  useDataTable,
} from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import React, { useEffect, useState } from 'react';
import { EmployeeProfile } from 'libs/utils/src/lib/types/employee.type';
import useSWR from 'swr';
import { createColumnHelper } from '@tanstack/react-table';
import { ModuleRowData } from 'apps/employee-monitoring/src/utils/types/table-row-types/settings/module.type';
import { isEmpty } from 'lodash';
import {
  EmployeeSchedule,
  useDtrStore,
} from 'apps/employee-monitoring/src/store/dtr.store';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { EmployeeDtrWithSummary } from 'libs/utils/src/lib/types/dtr.type';

export default function Index() {
  const mockData = [
    {
      createdAt: '2022-12-15T08:57:25.559Z',
      updatedAt: '2023-01-11T08:49:48.000Z',
      _id: '11be2691-b7a6-4e84-b8a2-72af24389939',
      module: 'Duties & Responsibilities',
      slug: 'dutiesResponsibilities',
      url: '/duties-responsibilities',
    },
    {
      createdAt: '2022-12-15T08:57:25.561Z',
      updatedAt: '2022-12-28T03:46:17.850Z',
      _id: '1ae7df50-c018-43d1-b41b-f1b1a934c0bf',
      module: 'Committees',
      slug: 'committees',
      url: '/committees',
    },
    {
      createdAt: '2022-12-15T08:57:25.556Z',
      updatedAt: '2022-12-28T06:42:50.000Z',
      _id: '22208337-d8c1-4378-9802-6da738714400',
      module: 'Qualification Standards',
      slug: 'qualificationStandards',
      url: '/qualification-standards',
    },
    {
      createdAt: '2022-12-15T08:57:25.555Z',
      updatedAt: '2022-12-28T03:46:49.228Z',
      _id: '2e4978f2-5070-4091-b89d-6e16f77e187c',
      module: 'Salary Grade',
      slug: 'salaryGrade',
      url: '/salary-grade',
    },
    {
      createdAt: '2022-12-15T08:57:25.551Z',
      updatedAt: '2022-12-28T03:47:05.826Z',
      _id: '3f644125-6fd5-4a9f-9894-7066357e559b',
      module: 'Employee Registration',
      slug: 'employeeRegistration',
      url: '/employee-registration',
    },
  ];

  const {
    errorEmployeeWithSchedule,
    employees,
    postResponse,
    dropdownAction,
    selectedEmployee,
    errorEmployeeAsOption,
    getDtrEmployees,
    getDtrEmployeesFail,
    emptyErrorsAndResponse,
    getDtrEmployeesSuccess,
    setEmployeeWithSchedule,
    setDropdownAction,
    setEmployeeDtr,
  } = useDtrStore((state) => ({
    employees: state.employees,
    dropdownAction: state.dropdownAction,
    selectedEmployee: state.selectedEmployee,
    postResponse: state.employeeSchedule.postResponse,
    errorEmployeeWithSchedule: state.error.errorEmployeeWithSchedule,
    errorEmployeeAsOption: state.error.errorEmployeesAsOption,
    getDtrEmployees: state.getDtrEmployees,
    setEmployeeWithSchedule: state.setEmployeeWithSchedule,
    emptyErrorsAndResponse: state.emptyErrorsAndResponse,
    getDtrEmployeesFail: state.getDtrEmployeesFail,
    getDtrEmployeesSuccess: state.getDtrEmployeesSuccess,
    setDropdownAction: state.setDropdownAction,
    setEmployeeDtr: state.setEmployeeDtr,
  }));

  const [currentRowData, setCurrentRowData] = useState<ModuleRowData>(
    {} as ModuleRowData
  );

  const {
    data: swrEmployees,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: swrMutate,
  } = useSWR(`/modules`, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: ModuleRowData) => {
    setEditModalIsOpen(true);

    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => {
    setDropdownAction('');
    setEditModalIsOpen(false);
    setEmployeeWithSchedule({} as EmployeeSchedule);
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: ModuleRowData) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>
      </div>
    );
  };

  // define table columns
  const columnHelper = createColumnHelper<ModuleRowData>();
  const columns = [
    columnHelper.accessor('_id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('module', {
      enableSorting: false,
      header: 'Module Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('slug', {
      enableSorting: false,
      header: 'Slug',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('url', {
      enableSorting: false,
      header: 'URL',
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
    data: mockData, // change to use Data from SWR
    columnVisibility: { _id: false },
  });

  // initialize loading swr
  useEffect(() => {
    if (swrIsLoading) {
      getDtrEmployees();
    }
  }, [swrIsLoading]);

  // useSWR data
  // useEffect(() => {
  //   if (!isEmpty(swrEmployees)) {
  //     const employeesDetails: Array<ModuleRowData> = swrEmployees.data.map(
  //       (employeeDetails: EmployeeProfile) => {
  //         const { employmentDetails, personalDetails } = employeeDetails;
  //         return {
  //           id: employmentDetails.employeeId,
  //           fullName: personalDetails.fullName,
  //           assignment: employmentDetails.assignment,
  //           positionTitle: employmentDetails.positionTitle,
  //           companyId: employeeDetails.employmentDetails.companyId,
  //           natureOfAppointment: employmentDetails.natureOfAppointment,
  //         };
  //       }
  //     );
  //     getDtrEmployeesSuccess(employeesDetails);
  //   }

  //   if (!isEmpty(swrError)) {
  //     getDtrEmployeesFail(swrError.message);
  //   }
  // }, [swrEmployees, swrError]);

  // mutate from swr
  // useEffect(() => {
  //   if (
  //     !isEmpty(errorEmployeeWithSchedule) ||
  //     !isEmpty(errorEmployeeAsOption)
  //   ) {
  //     setTimeout(() => {
  //       emptyErrorsAndResponse();
  //     }, 3000);
  //   }
  //   if (!isEmpty(postResponse)) {
  //     swrMutate();
  //     setTimeout(() => {
  //       emptyErrorsAndResponse();
  //     }, 3000);
  //   }
  // }, [postResponse, errorEmployeeWithSchedule, errorEmployeeAsOption]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Modules" />

        {/* Notifications */}
        {/* {!isEmpty(errorEmployeeAsOption) ? (
          <ToastNotification
            toastType="error"
            notifMessage={errorEmployeeAsOption}
          />
        ) : null} */}

        {/* {!isEmpty(postResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Successfully Added!"
          />
        ) : null} */}

        <div className="mx-5">
          <Card>
            {/* {swrIsLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <div className="flex flex-col flex-wrap ">
                <DataTable
                  model={table}
                  showColumnFilter={true}
                  paginate={true}
                />
              </div>
            )} */}

            <div className="flex flex-col flex-wrap ">
              <DataTable
                model={table}
                showGlobalFilter={true}
                showColumnFilter={false}
                paginate={true}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
