import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { OvertimeImmediateSupervisor } from 'libs/utils/src/lib/types/overtime.type';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime.store';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import AddImmediateSupervisorModal from 'apps/employee-monitoring/src/components/modal/monitoring/overtime/AddImmediateSupervisorModal';
import { useOrganizationStructureStore } from 'apps/employee-monitoring/src/store/organization-structure.store';
import { useEmployeeStore } from 'apps/employee-monitoring/src/store/employee.store';
import DeleteImmediateSupervisorModal from 'apps/employee-monitoring/src/components/modal/monitoring/overtime/DeleteImmediateSupervisorModal';
import UseRenderAvatarInTable from 'apps/employee-monitoring/src/utils/functions/RenderAvatarInTable';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<OvertimeImmediateSupervisor>({} as OvertimeImmediateSupervisor);

  // fetch data for overtime immediate supervisors
  const {
    data: overtimeImmediateSupervisors,
    error: overtimeImmediateSupervisorsError,
    isLoading: overtimeImmediateSupervisorsLoading,
    mutate: mutateOvertimeImmediateSupervisors,
  } = useSWR('/overtime/immediate-supervisors/', fetcherEMS, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });

  // Zustand initialization for overtime
  const {
    OvertimeImmediateSupervisors,
    SetOvertimeImmediateSupervisors,

    ErrorOvertimeImmediateSupervisors,
    SetErrorOvertimeImmediateSupervisors,

    AssignImmediateSupervisor,
    ErrorAssignImmediateSupervisor,

    UnassignImmediateSupervisor,
    ErrorUnassignImmediateSupervisor,

    EmptyResponse,
  } = useOvertimeStore((state) => ({
    OvertimeImmediateSupervisors: state.overtimeImmediateSupervisors,
    SetOvertimeImmediateSupervisors: state.setOvertimeImmediateSupervisors,

    ErrorOvertimeImmediateSupervisors: state.errorOvertimeImmediateSupervisors,
    SetErrorOvertimeImmediateSupervisors: state.setErrorOvertimeImmediateSupervisors,

    AssignImmediateSupervisor: state.assignImmediateSupervisor,
    ErrorAssignImmediateSupervisor: state.errorAssignImmediateSupervisor,

    UnassignImmediateSupervisor: state.unassignImmediateSupervisor,
    ErrorUnassignImmediateSupervisor: state.errorUnassignImmediateSupervisor,

    EmptyResponse: state.emptyResponse,
  }));

  // zustand initialization for employees
  const { ErrorEmployeeOptions } = useEmployeeStore((state) => ({
    ErrorEmployeeOptions: state.errorEmployeeOptions,
  }));

  // zustand store initialization for organizations
  const { ErrorOrganizationOptions } = useOrganizationStructureStore((state) => ({
    ErrorOrganizationOptions: state.errorOrganizationOptions,
  }));

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: OvertimeImmediateSupervisor) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: OvertimeImmediateSupervisor) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </div>
    );
  };

  const columnHelper = createColumnHelper<OvertimeImmediateSupervisor>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'avatarUrl',
      header: '',
      enableColumnFilter: false,
      cell: (props) => UseRenderAvatarInTable(props.row.original.avatarUrl, props.row.original.immediateSupervisorName),
    }),
    columnHelper.accessor('immediateSupervisorName', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('positionTitle', {
      header: 'Position Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignment', {
      header: 'Assignment',
      cell: (info) => info.getValue(),
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
    data: OvertimeImmediateSupervisors,
    columnVisibility: { id: false },
  });

  // Reset responses on load of page
  useEffect(() => {
    EmptyResponse();
  }, []);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(overtimeImmediateSupervisors)) {
      SetOvertimeImmediateSupervisors(overtimeImmediateSupervisors.data);
    }

    if (!isEmpty(overtimeImmediateSupervisorsError)) {
      SetErrorOvertimeImmediateSupervisors(overtimeImmediateSupervisorsError.message);
    }
  }, [overtimeImmediateSupervisors, overtimeImmediateSupervisorsError]);

  // Get new list of immediate supervisors
  useEffect(() => {
    if (!isEmpty(AssignImmediateSupervisor) || !isEmpty(UnassignImmediateSupervisor)) {
      mutateOvertimeImmediateSupervisors();
    }
  }, [AssignImmediateSupervisor, UnassignImmediateSupervisor]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Overtime Applications" />
        {/* Notifications */}
        {!isEmpty(ErrorOvertimeImmediateSupervisors) ? (
          <ToastNotification toastType="error" notifMessage={ErrorOvertimeImmediateSupervisors} />
        ) : null}

        {!isEmpty(ErrorOrganizationOptions) ? (
          <ToastNotification toastType="error" notifMessage={ErrorOrganizationOptions} />
        ) : null}

        {!isEmpty(ErrorEmployeeOptions) ? (
          <ToastNotification toastType="error" notifMessage={ErrorEmployeeOptions} />
        ) : null}

        {!isEmpty(ErrorAssignImmediateSupervisor) ? (
          <ToastNotification toastType="error" notifMessage={ErrorAssignImmediateSupervisor} />
        ) : null}

        {!isEmpty(ErrorUnassignImmediateSupervisor) ? (
          <ToastNotification toastType="error" notifMessage={ErrorUnassignImmediateSupervisor} />
        ) : null}

        {!isEmpty(AssignImmediateSupervisor) ? (
          <ToastNotification toastType="success" notifMessage="Successfully assigned as immediate supervisor" />
        ) : null}

        {!isEmpty(UnassignImmediateSupervisor) ? (
          <ToastNotification toastType="success" notifMessage="Successfully unassigned as immediate supervisor" />
        ) : null}

        <Can I="access" this="Overtime_applications">
          <div className="mx-5">
            <Card>
              {overtimeImmediateSupervisorsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAddActionModal}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Assign I.S.
                    </button>
                  </div>

                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={true} paginate={true} />
                </div>
              )}
            </Card>
          </div>

          {/* Add modal */}
          <AddImmediateSupervisorModal
            modalState={addModalIsOpen}
            setModalState={setAddModalIsOpen}
            closeModalAction={closeAddActionModal}
          />

          {/* Delete modal */}
          <DeleteImmediateSupervisorModal
            modalState={deleteModalIsOpen}
            setModalState={setDeleteModalIsOpen}
            closeModalAction={closeDeleteActionModal}
            rowData={currentRowData}
          />
        </Can>
      </div>
    </>
  );
};

export default Index;
