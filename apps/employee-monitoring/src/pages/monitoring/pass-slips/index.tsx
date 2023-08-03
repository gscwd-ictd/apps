/* eslint-disable @nx/enforce-module-boundaries */
import {
  DataTable,
  LoadingSpinner,
  ToastNotification,
  useDataTable,
} from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import ViewPassSlipModal from 'apps/employee-monitoring/src/components/modal/monitoring/pass-slips/ViewPassSlipModal';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { usePassSlipStore } from 'apps/employee-monitoring/src/store/pass-slip.store';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import UseRenderNatureOfBusiness from 'apps/employee-monitoring/src/utils/functions/RenderNatureOfBusiness';
import UseRenderObTransportation from 'apps/employee-monitoring/src/utils/functions/RenderObTransporation';
import UseRenderPassSlipStatus from 'apps/employee-monitoring/src/utils/functions/RenderPassSlipStatus';
import dayjs from 'dayjs';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function Index() {
  const {
    passSlip,
    passSlips,
    errorPassSlips,
    getPassSlips,
    getPassSlipsFail,
    getPassSlipsSuccess,
    emptyErrorsAndResponse,
  } = usePassSlipStore((state) => ({
    passSlip: state.passSlip,
    passSlips: state.passSlips,
    getPassSlips: state.getPassSlips,
    getPassSlipsSuccess: state.getPassSlipsSuccess,
    getPassSlipsFail: state.getPassSlipsFail,
    errorPassSlips: state.error.errorPassSlips,
    emptyErrorsAndResponse: state.emptyErrorsAndResponse,
  }));

  const [currentRowData, setCurrentRowData] = useState<PassSlip>(
    {} as PassSlip
  );

  // use swr pass slips
  const {
    data: swrPassSlips,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR('/pass-slip', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // view modal function
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewModal = (rowData: PassSlip) => {
    setViewModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeViewModal = () => setViewModalIsOpen(false);

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
      </>
    );
  };

  // columns
  const columnHelper = createColumnHelper<PassSlip>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
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

    columnHelper.accessor('purposeDestination', {
      header: 'Purpose/Destination',
      enableSorting: false,
      cell: (info) => (
        <div className="max-w-[6rem] truncate">{info.getValue()}</div>
      ),
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
    columnVisibility: { id: false },
  });

  // initialize loading
  useEffect(() => {
    if (swrIsLoading) getPassSlips();
  }, [swrIsLoading]);

  // get passlips success or fail
  useEffect(() => {
    // success
    if (!isEmpty(swrPassSlips)) getPassSlipsSuccess(swrPassSlips.data);

    // fail
    if (!isEmpty(swrError)) getPassSlipsFail(swrError.message);
  }, [swrPassSlips, swrError]);

  // if error getting pass slips
  useEffect(() => {
    if (!isEmpty(errorPassSlips) || !isEmpty(passSlip)) emptyErrorsAndResponse;
  }, [errorPassSlips]);

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

        {/* Fetch employees error */}
        {!isEmpty(errorPassSlips) ? (
          <ToastNotification toastType="error" notifMessage={errorPassSlips} />
        ) : null}

        {/* view modal */}
        <ViewPassSlipModal
          modalState={viewModalIsOpen}
          setModalState={setViewModalIsOpen}
          closeModalAction={closeViewModal}
          rowData={currentRowData}
        />

        <Can I="access" this="Pass_slips">
          <div className="sm:px-2 md:px-2 lg:px-5">
            <Card>
              {swrIsLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap ">
                  <DataTable
                    model={table}
                    showGlobalFilter={true}
                    showColumnFilter={true}
                    paginate={true}
                  />
                </div>
              )}
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
