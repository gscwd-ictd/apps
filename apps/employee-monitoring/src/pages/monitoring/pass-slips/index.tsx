/* eslint-disable @nx/enforce-module-boundaries */
import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import ViewPassSlipModal from 'apps/employee-monitoring/src/components/modal/monitoring/pass-slips/ViewPassSlipModal';
import CancelPassSlipModal from 'apps/employee-monitoring/src/components/modal/monitoring/pass-slips/CancelPassSlipModal';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { usePassSlipStore } from 'apps/employee-monitoring/src/store/pass-slip.store';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import UseRenderAvatarInTable from 'apps/employee-monitoring/src/utils/functions/RenderAvatarInTable';
import UseRenderNatureOfBusiness from 'apps/employee-monitoring/src/utils/functions/RenderNatureOfBusiness';
import UseRenderObTransportation from 'apps/employee-monitoring/src/utils/functions/RenderObTransporation';
import UseRenderPassSlipStatus from 'apps/employee-monitoring/src/utils/functions/RenderPassSlipStatus';
import dayjs from 'dayjs';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import UpdatePassSlipModal from 'apps/employee-monitoring/src/components/modal/monitoring/pass-slips/UpdatePassSlipTimeLogs';

export default function Index() {
  const [currentRowData, setCurrentRowData] = useState<PassSlip>({} as PassSlip);

  // use swr pass slips
  const {
    data: swrPassSlips,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutatePassSlipApplications,
  } = useSWR('/pass-slip', fetcherEMS, {
    shouldRetryOnError: false,
  });

  const {
    passSlips,
    errorPassSlips,

    ResponseHrmoApprovalPassSlip,

    getPassSlips,
    getPassSlipsFail,
    getPassSlipsSuccess,

    CancelPassSlip,
    CancelPassSlipFail,
    CancelPassSlipSuccess,

    UpdatePassSlipTimeLogs,
    UpdatePassSlipTimeLogsFail,
    UpdatePassSlipTimeLogsSuccess,

    emptyErrorsAndResponse,
  } = usePassSlipStore((state) => ({
    passSlips: state.passSlips,
    errorPassSlips: state.error.errorPassSlips,

    ResponseHrmoApprovalPassSlip: state.response.hrmoApprovalPassSlip,

    getPassSlips: state.getPassSlips,
    getPassSlipsSuccess: state.getPassSlipsSuccess,
    getPassSlipsFail: state.getPassSlipsFail,

    CancelPassSlip: state.response.cancelPassSlip,
    CancelPassSlipFail: state.cancelPassSlipFail,
    CancelPassSlipSuccess: state.cancelPassSlipSuccess,

    UpdatePassSlipTimeLogs: state.response.updatePassSlipTimeLogs,
    UpdatePassSlipTimeLogsFail: state.updatePassSlipTimeLogsFail,
    UpdatePassSlipTimeLogsSuccess: state.updatePassSlipTimeLogsSuccess,

    emptyErrorsAndResponse: state.emptyErrorsAndResponse,
  }));

  // view modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewModal = (rowData: PassSlip) => {
    setViewModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeViewModal = () => setViewModalIsOpen(false);

  // Cancel modal function
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState<boolean>(false);
  const openCancelModal = (rowData: PassSlip) => {
    setCancelModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeCancelModal = () => setCancelModalIsOpen(false);

  // Update modal function
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false);
  const openUpdateModal = (rowData: PassSlip) => {
    setUpdateModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeUpdateModal = () => setUpdateModalIsOpen(false);

  // Render row actions in the table component
  const renderRowActions = (rowData: PassSlip) => {
    return (
      <>
        <button
          type="button"
          className="text-white bg-blue-400 hover:bg-blue-500  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openViewModal(rowData)}
        >
          <i className="bx bx-show"></i>
        </button>
        {rowData.status === PassSlipStatus.APPROVED ? (
          <button
            type="button"
            className="text-white bg-gray-400 hover:bg-gray-500  focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
            onClick={() => openUpdateModal(rowData)}
          >
            <i className="bx bxs-edit"></i>
          </button>
        ) : null}
        {rowData.status !== PassSlipStatus.UNUSED &&
        rowData.status !== PassSlipStatus.CANCELLED &&
        rowData.status !== PassSlipStatus.FOR_HRMO_APPROVAL ? (
          <button
            type="button"
            className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
            onClick={() => {
              openCancelModal(rowData);
            }}
          >
            <i className="bx bx-x"></i>
          </button>
        ) : null}
      </>
    );
  };

  // columns
  const columnHelper = createColumnHelper<PassSlip>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'avatarUrl',
      header: '',
      enableColumnFilter: false,
      cell: (props) => UseRenderAvatarInTable(props.row.original.avatarUrl, props.row.original.employeeName),
    }),
    columnHelper.accessor('dateOfApplication', {
      header: 'Date of Application',
      enableSorting: false,
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('employeeName', {
      header: 'Employee Name',
      enableSorting: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('natureOfBusiness', {
      header: 'Nature of Business',
      enableSorting: false,
      cell: (info) => UseRenderNatureOfBusiness(info.getValue()),
    }),
    columnHelper.accessor('obTransportation', {
      header: 'OB Transportation',
      enableSorting: false,
      cell: (info) => UseRenderObTransportation(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      enableSorting: false,
      cell: (info) => UseRenderPassSlipStatus(info.getValue()),
      filterFn: 'equals',
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
    data: passSlips,
    columnVisibility: { id: false, obTransportation: false },
  });

  // Reset responses on load of page
  useEffect(() => {
    emptyErrorsAndResponse();
  }, []);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPassSlips)) {
      getPassSlipsSuccess(swrPassSlips.data);
    }

    if (!isEmpty(swrError)) {
      getPassSlipsFail(swrError.message);
    }
  }, [swrPassSlips, swrError]);

  useEffect(() => {
    if (!isEmpty(ResponseHrmoApprovalPassSlip) || !isEmpty(CancelPassSlip) || !isEmpty(UpdatePassSlipTimeLogs)) {
      mutatePassSlipApplications();
    }
  }, [ResponseHrmoApprovalPassSlip, CancelPassSlip, UpdatePassSlipTimeLogs]);

  return (
    <>
      <div>
        <BreadCrumbs
          title="Pass Slips"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Pass Slips',
              path: '',
            },
          ]}
        />

        {/* Fetch pass slips error */}
        {!isEmpty(errorPassSlips) ? <ToastNotification toastType="error" notifMessage={errorPassSlips} /> : null}

        {!isEmpty(CancelPassSlip) ? (
          <ToastNotification toastType="success" notifMessage="Pass slip cancelled successfully" />
        ) : null}

        {!isEmpty(UpdatePassSlipTimeLogs) ? (
          <ToastNotification toastType="success" notifMessage="Time logs updated successfully" />
        ) : null}

        {/* view modal */}
        <ViewPassSlipModal
          modalState={viewModalIsOpen}
          setModalState={setViewModalIsOpen}
          closeModalAction={closeViewModal}
          rowData={currentRowData}
        />

        <CancelPassSlipModal
          modalState={cancelModalIsOpen}
          setModalState={setCancelModalIsOpen}
          closeModalAction={closeCancelModal}
          formData={currentRowData}
        />

        {/* update modal */}
        <UpdatePassSlipModal
          modalState={updateModalIsOpen}
          setModalState={setUpdateModalIsOpen}
          closeModalAction={closeUpdateModal}
          formData={currentRowData}
        />

        <Can I="access" this="Pass_slips">
          <div className="sm:px-2 md:px-2 lg:px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap ">
                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={true} paginate={true} />
                </div>
              )}
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
