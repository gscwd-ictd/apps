/* eslint-disable @nx/enforce-module-boundaries */
import { Button, DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
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
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import ConvertToYearMonth from 'apps/employee-monitoring/src/utils/functions/ConvertToYearMonth';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { HiOutlineSearch } from 'react-icons/hi';
import axios from 'axios';

type Filter = {
  monthYear: string;
};

export default function Index() {
  const [currentRowData, setCurrentRowData] = useState<PassSlip>({} as PassSlip);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // use swr pass slips
  const {
    data: swrPassSlips,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutatePassSlipApplications,
  } = useSWR(`/pass-slip/`, fetcherEMS, {
    // } = useSWR(`/pass-slip/monthly/${dayjs().year() + '-' + (dayjs().month() + 1)}`, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  const {
    PassSlips,
    GetPassSlipsFail,
    GetPassSlipsSuccess,

    ErrorPassSlips,
    ResponseHrmoApprovalPassSlip,
    CancelPassSlip,
    UpdatePassSlipTimeLogs,

    EmptyErrorsAndResponse,
  } = usePassSlipStore((state) => ({
    PassSlips: state.passSlips,
    ErrorPassSlips: state.error.errorPassSlips,

    ResponseHrmoApprovalPassSlip: state.response.hrmoApprovalPassSlip,

    GetPassSlipsSuccess: state.getPassSlipsSuccess,
    GetPassSlipsFail: state.getPassSlipsFail,

    CancelPassSlip: state.response.cancelPassSlip,

    UpdatePassSlipTimeLogs: state.response.updatePassSlip,

    EmptyErrorsAndResponse: state.emptyErrorsAndResponse,
  }));

  const yupSchema = yup.object().shape({
    monthYear: yup.date().max(new Date(), 'Must not be greater than current date').nullable(),
  });

  // React hook form
  const { register, handleSubmit } = useForm<Filter>({
    mode: 'onChange',
    defaultValues: {
      monthYear: ConvertToYearMonth(dayjs().toString()),
    },
    resolver: yupResolver(yupSchema),
  });

  const onSubmit: SubmitHandler<Filter> = async (formData: Filter) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_BE_DOMAIN}/pass-slip/monthly/${ConvertToYearMonth(
          formData.monthYear
        )}`
      );

      // if success, push to update the state
      if (!isEmpty(data)) {
        setIsLoading(false);
        GetPassSlipsSuccess(data);
      }
    } catch (error) {
      setIsLoading(false);
      GetPassSlipsFail(error.message);
    }
  };

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
        {rowData.status === PassSlipStatus.APPROVED ||
        rowData.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE ||
        rowData.status === PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE ||
        rowData.status === PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE ? (
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
    columnHelper.accessor('isMedical', {
      header: 'Medical Purpose',
      enableColumnFilter: false,
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue();
        return value === true ? 'Yes' : value === false ? 'No' : 'Not Applicable';
      },
    }),
    columnHelper.accessor('obTransportation', {
      header: 'OB Transportation',
      enableSorting: false,
      cell: (info) => UseRenderObTransportation(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      enableSorting: true,
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
    data: PassSlips,
    columnVisibility: { id: false, obTransportation: false },
  });

  // Reset responses on load of page
  useEffect(() => {
    EmptyErrorsAndResponse();
  }, []);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPassSlips)) {
      GetPassSlipsSuccess(swrPassSlips.data);
    }

    if (!isEmpty(swrError)) {
      GetPassSlipsFail(swrError.message);
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
        {!isEmpty(ErrorPassSlips) ? <ToastNotification toastType="error" notifMessage={ErrorPassSlips} /> : null}

        {!isEmpty(CancelPassSlip) ? (
          <ToastNotification toastType="success" notifMessage="Pass slip cancelled successfully" />
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
              {swrIsLoading || isLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap justify-between">
                  <form onSubmit={handleSubmit(onSubmit)} id="searchMonthYear" className="order-2">
                    <div className="mb-6 flex ">
                      <LabelInput id="monthYear" type="month" controller={{ ...register('monthYear') }} />

                      <Button
                        variant="info"
                        type="submit"
                        form="searchMonthYear"
                        className="mx-1 text-gray-400 disabled:cursor-not-allowed"
                      >
                        <HiOutlineSearch className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>

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
