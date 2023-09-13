/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import fetcherHRIS from 'apps/employee-monitoring/src/utils/fetcher/FetcherHRIS';

import { useModulesStore } from 'apps/employee-monitoring/src/store/module.store';
import { Module } from 'apps/employee-monitoring/src/utils/types/module.type';

import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import AddModuleModal from 'apps/employee-monitoring/src/components/modal/settings/modules/AddModuleModal';
import EditModuleModal from 'apps/employee-monitoring/src/components/modal/settings/modules/EditModuleModal';

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<Module>({} as Module);

  // fetch data for list of modules
  const {
    data: modules,
    error: modulesError,
    isLoading: modulesLoading,
    mutate: mutateModules,
  } = useSWR('/modules', fetcherHRIS, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });

  // Zustand initialization
  const {
    Modules,
    SetGetModules,

    ErrorModules,
    SetErrorModules,

    PostModuleResponse,
    UpdateModuleResponse,
    DeleteModuleResponse,

    ErrorModule,
  } = useModulesStore((state) => ({
    Modules: state.getModules,
    SetGetModules: state.setGetModules,

    ErrorModules: state.errorModules,
    SetErrorModules: state.setErrorModules,

    PostModuleResponse: state.postModule,
    UpdateModuleResponse: state.updateModule,
    DeleteModuleResponse: state.deleteModule,

    ErrorModule: state.errorModule,
  }));

  // Add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // Edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: Module) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: Module) => {
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
  const columnHelper = createColumnHelper<Module>();
  const columns = [
    columnHelper.accessor('_id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('module', {
      header: 'Module',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('slug', {
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
    data: Modules,
    columnVisibility: { _id: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (!isEmpty(modules)) {
      SetGetModules(modules.data);
    }

    if (!isEmpty(modulesError)) {
      SetErrorModules(modulesError);
    }
  }, [modules, modulesError]);

  // Reset responses from all modal actions
  useEffect(() => {
    if (!isEmpty(PostModuleResponse) || !isEmpty(UpdateModuleResponse) || !isEmpty(DeleteModuleResponse)) {
      mutateModules();
    }
  }, [PostModuleResponse, UpdateModuleResponse, DeleteModuleResponse]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Modules" />
        {/* Notifications */}
        {!isEmpty(ErrorModules) ? <ToastNotification toastType="error" notifMessage={ErrorModules} /> : null}

        {!isEmpty(ErrorModule) ? <ToastNotification toastType="error" notifMessage={ErrorModule} /> : null}

        <Can I="access" this="Modules">
          <div className="mx-5">
            <Card>
              {modulesLoading ? (
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

                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
                </div>
              )}
            </Card>
          </div>

          {/* Add modal */}
          <AddModuleModal
            modalState={addModalIsOpen}
            setModalState={setAddModalIsOpen}
            closeModalAction={closeAddActionModal}
          />

          {/* Edit modal */}
          <EditModuleModal
            modalState={editModalIsOpen}
            setModalState={setEditModalIsOpen}
            closeModalAction={closeEditActionModal}
            rowData={currentRowData}
          />
        </Can>
      </div>
    </>
  );
};

export default Index;
