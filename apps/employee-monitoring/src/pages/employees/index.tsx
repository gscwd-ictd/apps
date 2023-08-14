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
import { EmployeeRowData } from 'apps/employee-monitoring/src/utils/types/table-row-types/monitoring/employee.type';
import { isEmpty } from 'lodash';
import {
  EmployeeSchedule,
  useDtrStore,
} from 'apps/employee-monitoring/src/store/dtr.store';
import fetcherHRMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherHRMS';
import { UseCapitalizer } from '../../utils/functions/Capitalizer';
import UseRenderBadgePill from '../../utils/functions/RenderBadgePill';
import { EmployeeDtrWithSummary } from 'libs/utils/src/lib/types/dtr.type';
import { ActionDropdownEmployee } from '../../components/dropdown/ActionDropdownEmployee';

export default function Index() {
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

  const [currentRowData, setCurrentRowData] = useState<EmployeeRowData>(
    {} as EmployeeRowData
  );

  const {
    data: swrEmployees,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: swrMutate,
  } = useSWR(`/employees`, fetcherHRMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: EmployeeRowData) => {
    setEditModalIsOpen(true);

    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => {
    setDropdownAction('');
    setEditModalIsOpen(false);
    setEmployeeWithSchedule({} as EmployeeSchedule);
  };

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: EmployeeRowData) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // render row actions in the table component
  const renderRowActions = (rowData: EmployeeRowData) => {
    return (
      <>
        <div className="flex items-center justify-start">
          <ActionDropdownEmployee employee={rowData} />
        </div>
      </>
    );
  };

  // define table columns
  const columnHelper = createColumnHelper<EmployeeRowData>();

  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('fullName', {
      enableSorting: false,
      header: 'Full Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('positionTitle', {
      enableSorting: false,
      header: 'Position Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignment.name', {
      enableSorting: false,
      header: 'Assignment',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('natureOfAppointment', {
      enableSorting: false,
      header: 'Nature of Appointment',
      cell: (info) => UseRenderBadgePill(UseCapitalizer(info.getValue())),
    }),
    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: employees,
    columnVisibility: { id: false },
  });

  // initialize loading swr
  useEffect(() => {
    if (swrIsLoading) {
      getDtrEmployees();
    }
  }, [swrIsLoading]);

  // useSWR data
  useEffect(() => {
    if (!isEmpty(swrEmployees)) {
      const employeesDetails: Array<EmployeeRowData> = swrEmployees.data.map(
        (employeeDetails: EmployeeProfile) => {
          const { employmentDetails, personalDetails } = employeeDetails;
          return {
            id: employmentDetails.employeeId,
            fullName: personalDetails.fullName,
            assignment: employmentDetails.assignment,
            positionTitle: employmentDetails.positionTitle,
            companyId: employeeDetails.employmentDetails.companyId,
            natureOfAppointment: employmentDetails.natureOfAppointment,
          };
        }
      );
      getDtrEmployeesSuccess(employeesDetails);
    }

    if (!isEmpty(swrError)) {
      getDtrEmployeesFail(swrError.message);
    }
  }, [swrEmployees, swrError]);

  //
  useEffect(() => {
    if (dropdownAction === 'View Daily Time Record') {
      //
    } else if (dropdownAction === 'Schedule') {
      openEditActionModal(selectedEmployee);
    }
  }, [dropdownAction, selectedEmployee]);

  // mutate from swr
  useEffect(() => {
    if (
      !isEmpty(errorEmployeeWithSchedule) ||
      !isEmpty(errorEmployeeAsOption)
    ) {
      setTimeout(() => {
        emptyErrorsAndResponse();
      }, 3000);
    }
    if (!isEmpty(postResponse)) {
      swrMutate();
      setTimeout(() => {
        emptyErrorsAndResponse();
      }, 3000);
    }
  }, [postResponse, errorEmployeeWithSchedule, errorEmployeeAsOption]);

  useEffect(() => {
    setDropdownAction('');
    setEmployeeDtr({ dtrDays: [], summary: {} as EmployeeDtrWithSummary });
  }, []);

  return (
    <>
      <div className="">
        <BreadCrumbs
          title="Employees"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Employees',
              path: '',
            },
          ]}
        />

        {/* Fetch employees error */}
        {!isEmpty(errorEmployeeAsOption) ? (
          <ToastNotification
            toastType="error"
            notifMessage={errorEmployeeAsOption}
          />
        ) : null}

        {/* Notification error */}
        {!isEmpty(errorEmployeeWithSchedule) ? (
          <ToastNotification
            toastType="error"
            notifMessage={errorEmployeeWithSchedule}
          />
        ) : null}

        {/* Notification Success */}
        {!isEmpty(postResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Successfully Added!"
          />
        ) : null}

        <div className="sm:px-2 md:px-2 lg:px-5">
          <Card>
            {swrIsLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <div className="flex flex-col flex-wrap overflow-hidden">
                {/** Top Card */}

                <DataTable
                  model={table}
                  showColumnFilter={true}
                  paginate={true}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
