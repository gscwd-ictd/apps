import {
  Button,
  DataTableHrms,
  LoadingSpinner,
  Modal,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import React, { useEffect, useState } from 'react';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import AddRecurringModal from 'apps/employee-monitoring/src/components/modal/maintenance/leave/recurring/AddRecurringModal';
import { LeaveBenefit } from 'libs/utils/src/lib/types/leave-benefits.type';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { createColumnHelper } from '@tanstack/react-table';
import { isEmpty } from 'lodash';
import EditRecurringModal from 'apps/employee-monitoring/src/components/modal/maintenance/leave/recurring/EditRecurringModal';
import DeleteRecurringModal from 'apps/employee-monitoring/src/components/modal/maintenance/leave/recurring/DeleteRecurringModal';
import UseRenderBooleanYesOrNo from 'apps/employee-monitoring/src/utils/functions/RenderBooleanYesOrNo';
import UseRenderDistribution from 'apps/employee-monitoring/src/utils/functions/RenderDistribution';

export default function Index() {
  const {
    leaveBenefits,
    PostResponse,
    UpdateResponse,
    DeleteResponse,
    LeaveBenefitError,
    LeaveBenefitsError,
    setLeaveBenefits,
    EmptyErrors,
    EmptyResponse,
    GetLeaveBenefits,
    GetLeaveBenefitsFail,
    GetLeaveBenefitsSuccess,
  } = useLeaveBenefitStore((state) => ({
    leaveBenefits: state.leaveBenefits,
    PostResponse: state.leaveBenefit.postResponse,
    UpdateResponse: state.leaveBenefit.updateResponse,
    DeleteResponse: state.leaveBenefit.deleteResponse,
    LeaveBenefitError: state.error.errorLeaveBenefit,
    LeaveBenefitsError: state.error.errorLeaveBenefits,
    setLeaveBenefits: state.setLeaveBenefits,
    GetLeaveBenefits: state.getLeaveBenefits,
    GetLeaveBenefitsSuccess: state.getLeaveBenefitsSuccess,
    GetLeaveBenefitsFail: state.getLeaveBenefitsFail,
    EmptyResponse: state.emptyResponse,
    EmptyErrors: state.emptyErrors,
  }));
  const [currentRowData, setCurrentRowData] = useState<LeaveBenefit>(
    {} as LeaveBenefit
  );

  const {
    data: swrLeaveBenefits,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutateLeaveBenefits,
  } = useSWR('/leave-benefits?type=Recurring', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  // edit modal function
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>(false);
  const openEditActionModal = (rowData: LeaveBenefit) => {
    setEditModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeEditActionModal = () => setEditModalIsOpen(false);

  // delete modal function
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const openDeleteActionModal = (rowData: LeaveBenefit) => {
    setDeleteModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeDeleteActionModal = () => setDeleteModalIsOpen(false);

  // define table columns
  const columnHelper = createColumnHelper<LeaveBenefit>();

  const columns = [
    columnHelper.accessor('id', {
      enableSorting: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('leaveName', {
      header: () => 'Leave Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('accumulatedCredits', {
      enableSorting: false,
      header: () => 'Credits',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('creditDistribution', {
      enableSorting: false,
      header: () => 'Distribution',
      cell: (info) => (
        <div className="w-[4rem]">{UseRenderDistribution(info.getValue())}</div>
      ),
    }),
    columnHelper.accessor('isMonetizable', {
      enableSorting: false,
      header: () => 'Monetizable',
      cell: (info) => (
        <div className="w-[3rem]">
          {UseRenderBooleanYesOrNo(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('canBeCarriedOver', {
      enableSorting: false,
      header: () => 'Can be carried over',
      cell: (info) => (
        <div className="w-[3rem]">
          {UseRenderBooleanYesOrNo(info.getValue())}
        </div>
      ),
    }),
    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // Define visibility of columns
  const columnVisibility = { id: false };

  // Render row actions in the table component
  const renderRowActions = (rowData: LeaveBenefit) => {
    return (
      <>
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
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
      </>
    );
  };

  // Initial zustand state update
  useEffect(() => {
    EmptyResponse();
    EmptyErrors();
    if (swrIsLoading) {
      GetLeaveBenefits(swrIsLoading);
    }
  }, [swrIsLoading]);

  // upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveBenefits)) {
      GetLeaveBenefitsSuccess(swrLeaveBenefits.data);
    }

    if (!isEmpty(swrError)) {
      GetLeaveBenefitsFail(swrError);
    }
  }, [swrLeaveBenefits, swrError]);

  // mutate from swr
  useEffect(() => {
    if (
      !isEmpty(PostResponse) ||
      !isEmpty(UpdateResponse) ||
      !isEmpty(DeleteResponse)
    ) {
      mutateLeaveBenefits();
    }
  }, [PostResponse, UpdateResponse, DeleteResponse]);

  return (
    <div className="min-h-[100%] w-full">
      <BreadCrumbs
        title="Recurring Leave"
        crumbs={[
          {
            layerNo: 1,
            layerText: 'Recurring Leave Maintenance',
            path: '',
          },
        ]}
      />

      {/* Notification error for array of benefits */}
      {!isEmpty(LeaveBenefitsError) ? (
        <ToastNotification
          toastType="error"
          notifMessage={LeaveBenefitsError}
        />
      ) : null}

      {/* Notification error for single entry of benefit */}
      {!isEmpty(LeaveBenefitError) ? (
        <ToastNotification toastType="error" notifMessage={LeaveBenefitError} />
      ) : null}

      {/* Notification Add Success */}
      {!isEmpty(PostResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Successfully added!"
        />
      ) : null}

      {/* Notification Update Success */}
      {!isEmpty(UpdateResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Successfully updated!"
        />
      ) : null}

      {/* Notification Delete Success */}
      {!isEmpty(DeleteResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Successfully deleted!"
        />
      ) : null}

      <AddRecurringModal
        modalState={addModalIsOpen}
        setModalState={setAddModalIsOpen}
        closeModalAction={closeAddActionModal}
      />

      <EditRecurringModal
        modalState={editModalIsOpen}
        setModalState={setEditModalIsOpen}
        closeModalAction={closeEditActionModal}
        rowData={currentRowData}
      />

      <DeleteRecurringModal
        modalState={deleteModalIsOpen}
        setModalState={setDeleteModalIsOpen}
        closeModalAction={closeDeleteActionModal}
        rowData={currentRowData}
      />

      <div className="sm:mx-0 lg:mx-5">
        <Card>
          {swrIsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className="flex flex-row flex-wrap">
              <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                  onClick={openAddActionModal}
                >
                  <i className="bx bxs-plus-square"></i>&nbsp; Add Leave Benefit
                </button>
              </div>

              <DataTableHrms
                data={leaveBenefits}
                columns={columns}
                columnVisibility={columnVisibility}
                paginate
                showGlobalFilter
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
