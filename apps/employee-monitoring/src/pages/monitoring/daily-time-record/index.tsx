/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  DataTableHrms,
  LoadingSpinner,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import React, { useEffect, useState } from 'react';
import { EmployeeProfile } from 'libs/utils/src/lib/types/employee.type';
import useSWR from 'swr';
import fetcherHRIS from '../../../utils/fetcher/FetcherHris';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { createColumnHelper } from '@tanstack/react-table';
import { EmployeeRowData } from 'apps/employee-monitoring/src/utils/types/table-row-types/monitoring/employee.type';
import { isEmpty } from 'lodash';

export default function Index() {
  const [employees, setEmployees] = useState<Array<EmployeeRowData>>([]);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const selectedAssignment = useDtrStore((state) => state.selectedAssignment);

  const [currentRowData, setCurrentRowData] = useState<EmployeeRowData>(
    {} as EmployeeRowData
  );

  const { data, error, isLoading } = useSWR(`/employees`, fetcherHRIS);

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: EmployeeRowData) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: EmployeeRowData) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // when edit action is clicked
  const editAction = async (employee: EmployeeProfile, idx: number) => {
    // setAction(ModalActions.UPDATE);/
    // setScheduleForEdit(sched);
    // setSelectedRestDays(await transformRestDays(sched.restDays));
    // loadNewDefaultValues(sched);
    setModalIsOpen(true);
  };

  // define table columns
  const columnHelper = createColumnHelper<EmployeeRowData>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('fullName', {
      enableColumnFilter: false,
      header: () => 'Full Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('positionTitle', {
      header: () => 'Position Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignment.name', {
      header: () => 'Assignment',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Define visibility of columns
  const columnVisibility = { id: false };

  // render row actions in the table component
  const renderRowActions = (rowData: EmployeeRowData) => {
    return (
      <>
        <div className="flex items-center justify-start">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
            onClick={() => openEditActionModal(rowData)}
          >
            <span className="text-xs">View DTR</span>
          </button>
        </div>
      </>
    );
  };

  // fetch employees, transform and set to state
  useEffect(() => {
    if (data && !isEmpty(data.data)) {
      const employeesDetails: Array<EmployeeRowData> = data.data.map(
        (employeeDetails) => {
          const { employmentDetails, personalDetails } = employeeDetails;

          return {
            id: employmentDetails.employeeId,
            fullName: personalDetails.fullName,
            assignment: employmentDetails.assignment,
            positionTitle: employmentDetails.positionTitle,
          };
        }
      );

      setEmployees(employeesDetails);
    }
  }, [data]);

  return (
    <>
      <div className="min-h-[100%] min-w-full px-4">
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

        {/* Error toast notification */}
        {!isEmpty(error) ? (
          <ToastNotification
            toastType="error"
            notifMessage={error.errorMessage}
          />
        ) : null}

        <Card>
          {/** Top Card */}
          <div className="flex flex-row flex-wrap ">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <ToastNotification
                  toastType="success"
                  notifMessage="Daily Time Records found"
                />
                <DataTableHrms
                  data={employees}
                  columns={columns}
                  columnVisibility={columnVisibility}
                  paginate
                />
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
