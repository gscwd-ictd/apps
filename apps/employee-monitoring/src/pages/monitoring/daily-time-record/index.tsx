/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, DataTableHrms } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import React, { useEffect, useState } from 'react';
import { EmployeeProfile } from 'libs/utils/src/lib/types/employee.type';
import useSWR from 'swr';
import fetcherHRIS from '../../../utils/fetcher/FetcherHRIS';
import { createColumnHelper } from '@tanstack/react-table';
import { EmployeeRowData } from 'apps/employee-monitoring/src/utils/types/table-row-types/monitoring/employee.type';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ActionDropdown } from 'apps/employee-monitoring/src/components/dropdown/ActionDropdown';

export default function Index({
  employees,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [allEmployees, setAllEmployees] = useState<Array<EmployeeRowData>>([]);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const [currentRowData, setCurrentRowData] = useState<EmployeeRowData>(
    {} as EmployeeRowData
  );

  const { data } = useSWR(`/employees`, fetcherHRIS);

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
      enableSorting: false,
      header: () => 'Full Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('positionTitle', {
      enableSorting: false,
      header: () => 'Position Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignment.name', {
      enableSorting: false,
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
          <ActionDropdown />
        </div>
      </>
    );
  };

  useEffect(() => {
    if (employees) {
      // console.log(employees);
      const employeesDetails: Array<EmployeeRowData> = employees.map(
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

      setAllEmployees(employeesDetails);
    }
  }, []);

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
              <DataTableHrms
                data={allEmployees}
                columns={columns}
                columnVisibility={columnVisibility}
                paginate
                showGlobalFilter
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/employees`
    );

    return { props: { employees: response.data } };
  } catch (error) {
    return { props: { employees: [] } };
  }
};
