/* eslint-disable @nx/enforce-module-boundaries */
import { DataTable, useDataTable } from '@gscwd-apps/oneui';
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
import {
  NatureOfBusiness,
  ObTransportation,
  PassSlipStatus,
} from 'libs/utils/src/lib/enums/pass-slip.enum';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

// const passSlips: Array<PassSlip> = [
//   {
//     employeeName: 'Maritess P. Primaylon',
//     supervisorName: 'Michael G. Gabales',
//     id: '09decec4-7a1c-4d77-a0cf-a905f9601dbe',
//     employeeId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     supervisorId: '010a02be-5b3d-11ed-a08b-000c29f95a80',
//     status: PassSlipStatus.APPROVED,
//     dateOfApplication: '2023-03-01',
//     natureOfBusiness: NatureOfBusiness.UNDERTIME,
//     obTransportation: null,
//     estimateHours: 0,
//     purposeDestination: 'undertime',
//     isCancelled: Boolean(0),
//   },
//   {
//     employeeName: 'Ricardo Vicente P. Narvaiza',
//     supervisorName: 'Michael G. Gabales',
//     id: '09decec4-7a1c-4d77-a0cf-a905f9601dbe',
//     employeeId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     supervisorId: '010a02be-5b3d-11ed-a08b-000c29f95a80',
//     status: PassSlipStatus.DISAPPROVED,
//     dateOfApplication: '2023-03-01',
//     natureOfBusiness: NatureOfBusiness.HALF_DAY,
//     obTransportation: null,
//     estimateHours: 0,
//     purposeDestination: 'undertime',
//     isCancelled: Boolean(0),
//   },
//   {
//     employeeName: 'Allyn Joseph C. Cubero',
//     supervisorName: 'Michael G. Gabales',
//     id: '09decec4-7a1c-4d77-a0cf-a905f9601dbe',
//     employeeId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     supervisorId: '010a02be-5b3d-11ed-a08b-000c29f95a80',
//     status: PassSlipStatus.ONGOING,
//     dateOfApplication: '2023-03-01',
//     natureOfBusiness: NatureOfBusiness.UNDERTIME,
//     obTransportation: null,
//     estimateHours: 0,
//     purposeDestination: 'undertime',
//     isCancelled: Boolean(0),
//   },
//   {
//     employeeName: 'Eric C. Sison',
//     supervisorName: 'Michael G. Gabales',
//     id: '09decec4-7a1c-4d77-a0cf-a905f9601dbe',
//     employeeId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     supervisorId: '010a02be-5b3d-11ed-a08b-000c29f95a80',
//     status: PassSlipStatus.APPROVED,
//     dateOfApplication: '2023-03-01',
//     natureOfBusiness: NatureOfBusiness.OFFICIAL_BUSINESS,
//     obTransportation: ObTransportation.OFFICE_VEHICLE,
//     estimateHours: 0,
//     purposeDestination: 'undertime',
//     isCancelled: Boolean(0),
//   },
//   {
//     employeeName: 'Eric C. Sison',
//     supervisorName: 'Michael G. Gabales',
//     id: '09decec4-7a1c-4d77-a0cf-a905f9601dbe',
//     employeeId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     supervisorId: '010a02be-5b3d-11ed-a08b-000c29f95a80',
//     status: PassSlipStatus.APPROVED,
//     dateOfApplication: '2023-03-01',
//     natureOfBusiness: NatureOfBusiness.PERSONAL_BUSINESS,
//     obTransportation: null,
//     estimateHours: 0,
//     purposeDestination: 'undertime undertime undertime ',
//     isCancelled: Boolean(0),
//   },
//   {
//     employeeName: 'Alexis G. Aponesto',
//     supervisorName: 'Michael G. Gabales',
//     id: '09decec4-7a1c-4d77-a0cf-a905f9601dbe',
//     employeeId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     supervisorId: '010a02be-5b3d-11ed-a08b-000c29f95a80',
//     status: PassSlipStatus.CANCELLED,
//     dateOfApplication: '2023-03-01',
//     natureOfBusiness: NatureOfBusiness.OFFICIAL_BUSINESS,
//     obTransportation: ObTransportation.PRIVATE_OR_PERSONAL_VEHICLE,
//     estimateHours: 0,
//     purposeDestination: 'undertime',
//     isCancelled: Boolean(0),
//   },
// ];

export default function Index() {
  const { passSlips, getPassSlips, getPassSlipsFail, getPassSlipsSuccess } =
    usePassSlipStore((state) => ({
      passSlips: state.passSlips,
      getPassSlips: state.getPassSlips,
      getPassSlipsSuccess: state.getPassSlipsSuccess,
      getPassSlipsFail: state.getPassSlipsFail,
    }));

  const [currentRowData, setCurrentRowData] = useState<PassSlip>(
    {} as PassSlip
  );

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

        {/* <button
          type="button"
          className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
          // onClick={() => openDeleteActionModal(rowData)}
        >
          <i className="bx bx-trash-alt"></i>
        </button> */}
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
      cell: (info) => info.getValue(),
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
    }),

    columnHelper.display({
      header: () => 'Actions',
      id: 'actions',
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // initialize loading
  useEffect(() => {
    if (swrIsLoading) getPassSlips();
  }, [swrIsLoading]);

  // get passlips success or fail
  useEffect(() => {
    // success
    if (!isEmpty(swrPassSlips)) {
      getPassSlipsSuccess(swrPassSlips.data);
    }

    // fail
    if (!isEmpty(swrError)) getPassSlipsFail(swrError);
  }, [swrPassSlips, swrError]);

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: passSlips,
    columnVisibility: { id: false },
  });

  return (
    <>
      <div className="w-full px-4">
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

        {/* view modal */}
        <ViewPassSlipModal
          modalState={viewModalIsOpen}
          setModalState={setViewModalIsOpen}
          closeModalAction={closeViewModal}
          rowData={currentRowData}
        />

        <Can I="access" this="Pass_slips">
          <div className="sm:mx-0 md:mx-0 lg:mx-5 ">
            <Card>
              <div className="flex flex-row flex-wrap ">
                <DataTable
                  model={table}
                  showGlobalFilter={true}
                  showColumnFilter={true}
                  paginate={true}
                />
              </div>
            </Card>
          </div>
        </Can>
      </div>
    </>
  );
}
