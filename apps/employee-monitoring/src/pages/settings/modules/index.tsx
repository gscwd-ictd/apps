/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

import { useModulesStore } from 'apps/employee-monitoring/src/store/module.store';
import { Module } from 'apps/employee-monitoring/src/utils/types/module.type';

import {
  DataTable,
  LoadingSpinner,
  ToastNotification,
  useDataTable,
} from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { createColumnHelper } from '@tanstack/react-table';
import AddModulesModal from 'apps/employee-monitoring/src/components/modal/settings/modules/AddModulesModal';
import EditModulesModal from 'apps/employee-monitoring/src/components/modal/settings/modules/EditModulesModal';

const TypesMockData: Array<Module> = [
  {
    id: '11be2691-b7a6-4e84-b8a2-72af24389939',
    module: 'Duties & Responsibilities',
    slug: 'dutiesResponsibilities',
    url: '/duties-responsibilities',
  },
  {
    id: '1ae7df50-c018-43d1-b41b-f1b1a934c0bf',
    module: 'Committees',
    slug: 'committees',
    url: '/committees',
  },
  {
    id: '22208337-d8c1-4378-9802-6da738714400',
    module: 'Qualification Standards',
    slug: 'qualificationStandards',
    url: '/qualification-standards',
  },
  {
    id: '2e4978f2-5070-4091-b89d-6e16f77e187c',
    module: 'Salary Grade',
    slug: 'salaryGrade',
    url: '/salary-grade',
  },
  {
    id: '3f644125-6fd5-4a9f-9894-7066357e559b',
    module: 'Employee Registration',
    slug: 'employeeRegistration',
    url: '/employee-registration',
  },
];

const Index = () => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<Module>({} as Module);

  // fetch data for list of custom groups
  // const {
  //   data: swrModules,
  //   error: swrError,
  //   isLoading: swrIsLoading,
  //   mutate: mutateModules,
  // } = useSWR('/modules', fetcherEMS, {
  //   shouldRetryOnError: false,
  //   revalidateOnFocus: false,
  // });

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

  // Delete modal function
  // const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  // const openDeleteActionModal = (rowData: Module) => {
  //   setDeleteModalIsOpen(true);
  //   setCurrentRowData(rowData);
  // };
  // const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

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

        <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          // onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button>
      </div>
    );
  };

  // define table columns
  const columnHelper = createColumnHelper<Module>();
  const columns = [
    columnHelper.accessor('id', {
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
    data: TypesMockData, // change to use Data from SWR
    columnVisibility: { id: false },
  });

  // Zustand initialization
  const {
    Modules,
    PostModuleResponse,
    UpdateModuleResponse,
    DeleteModuleResponse,

    IsLoading,
    ErrorModules,

    GetModules,
    GetModulesSuccess,
    GetModulesFail,

    EmptyResponse,
  } = useModulesStore((state) => ({
    Modules: state.modules,
    PostModuleResponse: state.module.postResponse,
    UpdateModuleResponse: state.module.updateResponse,
    DeleteModuleResponse: state.module.deleteResponse,

    IsLoading: state.loading.loadingModules,
    ErrorModules: state.error.errorModules,

    GetModules: state.getModules,
    GetModulesSuccess: state.getModulesSuccess,
    GetModulesFail: state.getModulesFail,

    EmptyResponse: state.emptyResponse,
  }));

  // Initial zustand state update
  // useEffect(() => {
  //   if (swrIsLoading) {
  //     GetModules();
  //   }
  // }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrModules)) {
  //         GetModulesSuccess,(swrModules.data);
  //   }

  //   if (!isEmpty(swrError)) {
  //     GetModulesFail(swrError.message);
  //   }
  // }, [swrModules, swrError]);

  // Reset responses from all modal actions
  // useEffect(() => {
  //   if (
  //     !isEmpty(PostModuleResponse) ||
  //     !isEmpty(UpdateCustomGroupResponse) ||
  //     !isEmpty(DeleteCustomGroupResponse)
  //   ) {
  //     mutateModules();

  //     setTimeout(() => {
  //       EmptyResponse();
  //     }, 3000);
  //   }
  // }, [
  //   PostModuleResponse,
  //   UpdateCustomGroupResponse,
  //   DeleteCustomGroupResponse,
  // ]);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="Custom Groups" />
        {/* Error Notifications */}
        {!isEmpty(ErrorModules) ? (
          <ToastNotification toastType="error" notifMessage={ErrorModules} />
        ) : null}

        {/* Success Notifications */}
        {!isEmpty(PostModuleResponse) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Custom group added successfully"
          />
        ) : null}

        <Can I="access" this="Modules">
          <div className="mx-5">
            <Card>
              {/* {IsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAddActionModal}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Add Custom
                      Group Order
                    </button>
                  </div>

                  <DataTable
                    model={table}
                    showGlobalFilter={true}
                    showColumnFilter={false}
                    paginate={true}
                  />
                </div>
              )} */}

              <div className="flex flex-row flex-wrap">
                <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                    onClick={openAddActionModal}
                  >
                    <i className="bx bxs-plus-square"></i>&nbsp; Add Modules
                  </button>
                </div>

                <DataTable
                  model={table}
                  showGlobalFilter={true}
                  showColumnFilter={false}
                  paginate={true}
                />
              </div>
            </Card>
          </div>

          {/* Add modal */}
          <AddModulesModal
            modalState={addModalIsOpen}
            setModalState={setAddModalIsOpen}
            closeModalAction={closeAddActionModal}
          />

          {/* Edit modal */}
          <EditModulesModal
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
