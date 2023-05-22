/* eslint-disable @nx/enforce-module-boundaries */
import { DataTable, useDataTable } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import React, { useEffect, useState } from 'react';
import { EmployeeProfile } from 'libs/utils/src/lib/types/employee.type';
import useSWR from 'swr';
import fetcherHRIS from '../../../utils/fetcher/FetcherHRIS';
import { createColumnHelper } from '@tanstack/react-table';
import { EmployeeRowData } from 'apps/employee-monitoring/src/utils/types/table-row-types/monitoring/employee.type';
import { ActionDropdown } from 'apps/employee-monitoring/src/components/dropdown/ActionDropdown';
import { isEmpty } from 'lodash';
import {
  EmployeeSchedule,
  useDtrStore,
} from 'apps/employee-monitoring/src/store/dtr.store';
import ViewEmployeeSchedule from 'apps/employee-monitoring/src/components/sidebar-items/monitoring/daily-time-record/ViewEmployeeSchedule';

export default function Index() {
  const {
    employees,
    postResponse,
    dropdownAction,
    selectedEmployee,
    getDtrEmployees,
    getDtrEmployeesFail,
    getDtrEmployeesSuccess,
    setEmployeeWithSchedule,
    setDropdownAction,
  } = useDtrStore((state) => ({
    employees: state.employees,
    selectedEmployee: state.selectedEmployee,
    dropdownAction: state.dropdownAction,
    postResponse: state.employeeDtr.postResponse,
    getDtrEmployees: state.getDtrEmployees,
    setEmployeeWithSchedule: state.setEmployeeWithSchedule,
    getDtrEmployeesFail: state.getDtrEmployeesFail,
    getDtrEmployeesSuccess: state.getDtrEmployeesSuccess,
    setDropdownAction: state.setDropdownAction,
  }));

  const [currentRowData, setCurrentRowData] = useState<EmployeeRowData>(
    {} as EmployeeRowData
  );

  const {
    data: swrEmployees,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: swrMutate,
  } = useSWR(`/employees`, fetcherHRIS);

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
          <ActionDropdown employee={rowData} />
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
          };
        }
      );
      getDtrEmployeesSuccess(employeesDetails);
    }

    if (!isEmpty(swrError)) getDtrEmployeesFail(swrError);
  }, [swrEmployees, swrError]);

  //
  useEffect(() => {
    if (dropdownAction === 'View Daily Time Record') {
      //
    } else if (dropdownAction === 'Schedule') {
      openEditActionModal(selectedEmployee);
    }
  }, [dropdownAction, selectedEmployee]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs
          title="Daily Time Record"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Daily Time Record',
              path: '',
            },
          ]}
        />

        <div className="mx-5">
          <Card>
            {/** Top Card */}
            <div className="flex flex-col flex-wrap ">
              <ViewEmployeeSchedule
                modalState={editModalIsOpen}
                setModalState={setEditModalIsOpen}
                closeAction={closeEditActionModal}
                employee={currentRowData}
              />

              <DataTable
                model={table}
                showGlobalFilter={true}
                showColumnFilter={true}
                paginate={true}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
