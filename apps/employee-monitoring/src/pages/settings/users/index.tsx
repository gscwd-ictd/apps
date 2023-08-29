/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import fetcherHRIS from 'apps/employee-monitoring/src/utils/fetcher/FetcherHRIS';

import { useUsersStore } from 'apps/employee-monitoring/src/store/user.store';
import {
  User,
  UserId,
} from 'apps/employee-monitoring/src/utils/types/user.type';

import { useModulesStore } from 'apps/employee-monitoring/src/store/module.store';

import {
  DataTable,
  LoadingSpinner,
  ToastNotification,
  useDataTable,
} from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import AddUserModal from 'apps/employee-monitoring/src/components/modal/settings/users/AddUserModal';
import EditUserModal from 'apps/employee-monitoring/src/components/modal/settings/users/EditUserModal';
import DeleteUserModal from 'apps/employee-monitoring/src/components/modal/settings/users/DeleteUserModal';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<User>({} as User);

  // fetch data for list of user
  const {
    data: emsUsers,
    error: emsUsersError,
    isLoading: emsUsersLoading,
    mutate: mutateEmsUsers,
  } = useSWR('/users', fetcherHRIS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Zustand initialization
  const {
    EmsUsers,
    SetGetEmsUsers,

    ErrorEmsUsers,
    SetErrorEmsUsers,

    ErrorNonEmsUsers,

    ErrorGetUserRoles,

    PostUserResponse,
    UpdateUserResponse,
    DeleteUserResponse,

    ErrorUser,
  } = useUsersStore((state) => ({
    EmsUsers: state.getEmsUsers,
    SetGetEmsUsers: state.setGetEmsUsers,

    ErrorEmsUsers: state.errorEmsUsers,
    SetErrorEmsUsers: state.setErrorEmsUsers,

    ErrorNonEmsUsers: state.errorNonEmsUsers,

    ErrorGetUserRoles: state.errorGetUserRoles,

    PostUserResponse: state.postUser,
    UpdateUserResponse: state.updateUser,
    DeleteUserResponse: state.deleteUser,

    ErrorUser: state.errorUser,
  }));

  const { ErrorModules } = useModulesStore((state) => ({
    ErrorModules: state.errorModules,
  }));

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: User) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: User) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: User) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openEditActionModal(rowData)}
        >
          <i className="bx bx-edit-alt"></i>
        </button>

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

  // define table columns
  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor('employeeId', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('fullName', {
      header: 'Name',
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
    // data: TypesMockData, // change to use Data from SWR
    data: EmsUsers,
    columnVisibility: { employeeId: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (!isEmpty(emsUsers)) {
      SetGetEmsUsers(emsUsers.data);
    }

    if (!isEmpty(emsUsersError)) {
      SetErrorEmsUsers(emsUsersError);
    }
  }, [emsUsers, emsUsersError]);

  // Reset responses from all modal actions
  useEffect(() => {
    if (
      !isEmpty(PostUserResponse) ||
      !isEmpty(UpdateUserResponse) ||
      !isEmpty(DeleteUserResponse)
    ) {
      mutateEmsUsers();
    }
  }, [PostUserResponse, UpdateUserResponse, DeleteUserResponse]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Users" />
        {/* Notifications */}
        {!isEmpty(ErrorEmsUsers) ? (
          <ToastNotification toastType="error" notifMessage={ErrorEmsUsers} />
        ) : null}

        {!isEmpty(ErrorNonEmsUsers) ? (
          <ToastNotification
            toastType="error"
            notifMessage={ErrorNonEmsUsers}
          />
        ) : null}

        {!isEmpty(ErrorGetUserRoles) ? (
          <ToastNotification
            toastType="error"
            notifMessage={ErrorGetUserRoles}
          />
        ) : null}

        {!isEmpty(ErrorUser) ? (
          <ToastNotification toastType="error" notifMessage={ErrorUser} />
        ) : null}

        {!isEmpty(ErrorModules) ? (
          <ToastNotification toastType="error" notifMessage={ErrorModules} />
        ) : null}

        <Can I="access" this="Users">
          <div className="mx-5">
            <Card>
              {emsUsersLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAddActionModal}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Add User
                    </button>
                  </div>

                  <DataTable
                    model={table}
                    showGlobalFilter={true}
                    showColumnFilter={false}
                    paginate={true}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Add modal */}
          <AddUserModal
            modalState={addModalIsOpen}
            setModalState={setAddModalIsOpen}
            closeModalAction={closeAddActionModal}
          />

          {/* Edit modal */}
          <EditUserModal
            modalState={editModalIsOpen}
            setModalState={setEditModalIsOpen}
            closeModalAction={closeEditActionModal}
            rowData={currentRowData}
          />

          {/* Delete modal */}
          <DeleteUserModal
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
