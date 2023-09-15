import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import UseRenderOvertimeStatus from 'apps/employee-monitoring/src/utils/functions/RenderOvertimeStatus';

import { EmployeeOvertimeDetails } from 'libs/utils/src/lib/types/employee.type';
import { Overtime, OvertimeImmediateSupervisor } from 'libs/utils/src/lib/types/overtime.type';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime.store';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import ViewOvertimeModal from 'apps/employee-monitoring/src/components/modal/monitoring/overtime/ViewOvertimeModal';
import UseRenderNameIcon from 'apps/employee-monitoring/src/utils/functions/RenderNameIcon';
import AddImmediateSupervisorModal from 'apps/employee-monitoring/src/components/modal/monitoring/overtime/AddImmediateSupervisorModal';

const mockDataModules: Array<OvertimeImmediateSupervisor> = [
  {
    id: '001',
    immediateSupervisorName: 'Eric Sison',
    positionTitle: 'Management Information System Researcher',
    assignment: 'Systems Development and Application Division',
    avatarUrl: 'http://172.20.110.45:4500/SISON.jpg',
  },
  {
    id: '002',
    immediateSupervisorName: 'Rizza Baugbog',
    positionTitle: 'Supervising Data Encoder-Controller',
    assignment: 'Geographic Information System Division',
    avatarUrl: 'http://172.20.110.45:4500/BAUGBOG.jpg',
  },
];

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<Overtime>({} as Overtime);

  // fetch data for overtime immediate supervisors
  const {
    data: overtimeImmediateSupervisor,
    error: overtimeImmediateSupervisorError,
    isLoading: overtimeImmediateSupervisorLoading,
    mutate: mutateOvertimeApplications,
  } = useSWR('/overtime/immediate-supervisors/', fetcherEMS, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });

  // Zustand initialization
  const {
    OvertimeImmediateSupervisors,
    SetOvertimeImmediateSupervisors,

    ErrorOvertimeImmediateSupervisors,
    SetErrorOvertimeImmediateSupervisors,
  } = useOvertimeStore((state) => ({
    OvertimeImmediateSupervisors: state.overtimeImmediateSupervisors,
    SetOvertimeImmediateSupervisors: state.setOvertimeImmediateSupervisors,

    ErrorOvertimeImmediateSupervisors: state.errorOvertimeImmediateSupervisors,
    SetErrorOvertimeImmediateSupervisors: state.setErrorOvertimeImmediateSupervisors,
  }));

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: Overtime) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: OvertimeImmediateSupervisor) => {
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

  const renderAvatar = (avatarUrl: string, immediateSupervisorName: string) => {
    if (!isEmpty(avatarUrl)) {
      return (
        <Image
          src={avatarUrl}
          width={80}
          height={80}
          alt={`Picture of employee ${immediateSupervisorName}`}
          className="m-auto w-[2.5rem] h-[2.5rem] rounded-full"
        />
      );
    } else {
      return <> {UseRenderNameIcon(immediateSupervisorName)}</>;
    }
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
      cell: (props) => renderAvatar(props.row.original.avatarUrl, props.row.original.immediateSupervisorName),
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
    // data: OvertimeApplications,
    data: mockDataModules,
    columnVisibility: { id: false },
  });

  useEffect(() => {
    if (!isEmpty(overtimeImmediateSupervisor)) {
      SetOvertimeImmediateSupervisors(overtimeImmediateSupervisor.data);
    }

    if (!isEmpty(overtimeImmediateSupervisorError)) {
      SetErrorOvertimeImmediateSupervisors(overtimeImmediateSupervisorError.message);
    }
  }, [overtimeImmediateSupervisor, overtimeImmediateSupervisorError]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Overtime Applications" />
        {/* Notifications */}
        {!isEmpty(ErrorOvertimeImmediateSupervisors) ? (
          <ToastNotification toastType="error" notifMessage={ErrorOvertimeImmediateSupervisors} />
        ) : null}

        <Can I="access" this="Overtime_applications">
          <div className="mx-5">
            <Card>
              {overtimeImmediateSupervisorLoading ? (
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

          {/* Edit modal */}
          {/* <EditTravelOrderModal
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
