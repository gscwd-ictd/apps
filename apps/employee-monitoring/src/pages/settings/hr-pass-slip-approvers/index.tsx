/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, LoadingSpinner, ToastNotification, useDataTable } from '@gscwd-apps/oneui';
import { Can } from 'apps/employee-monitoring/src/context/casl/CaslContext';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { HrPassSlipApprover } from 'apps/employee-monitoring/src/utils/types/hr-pass-slip-approver.type';
import AddHrPassSlipApproverModal from 'apps/employee-monitoring/src/components/modal/settings/hr-pass-slip-approvers/AddHrPassSlipApproverModal';
import DeleteHrPassSlipApproverModal from 'apps/employee-monitoring/src/components/modal/settings/hr-pass-slip-approvers/DeleteHrPassSlipApproverModal';

/**
 * HR Pass Slip Approvers: HR employees (Recruitment and Personnel Welfare Division) who are listed in every
 * employee's pass slip supervisor list in the portal and can approve pass slips.
 */
const Index = () => {
  const { data, error, isLoading, mutate } = useSWR('/ems-settings/hr-pass-slip-approvers', fetcherEMS, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });
  const approvers: HrPassSlipApprover[] = Array.isArray(data?.data) ? data.data : [];

  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);
  const [currentRowData, setCurrentRowData] = useState<HrPassSlipApprover>({} as HrPassSlipApprover);

  // toast messages (cleared after 5 seconds like the other settings pages)
  const [success, setSuccess] = useState<string>('');
  const [failure, setFailure] = useState<string>('');
  useEffect(() => {
    if (!success && !failure) return;
    const t = setTimeout(() => {
      setSuccess('');
      setFailure('');
    }, 5000);
    return () => clearTimeout(t);
  }, [success, failure]);

  const columnHelper = createColumnHelper<HrPassSlipApprover>();
  const columns = [
    columnHelper.accessor('id', { cell: (info) => info.getValue() }),
    columnHelper.accessor('fullName', { enableSorting: true, header: () => 'Employee Name', cell: (info) => info.getValue() }),
    columnHelper.accessor('positionTitle', { enableSorting: true, header: () => 'Position', cell: (info) => info.getValue() }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="w-full text-center">Actions</span>,
      cell: (props) => (
        <div className="w-full text-center">
          <button
            type="button"
            className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
            onClick={() => {
              setCurrentRowData(props.row.original);
              setDeleteModalIsOpen(true);
            }}
            aria-label="Remove"
          >
            <i className="bx bx-trash-alt"></i>
          </button>
        </div>
      ),
    }),
  ];

  const { table } = useDataTable({ columns, data: approvers, columnVisibility: { id: false } });

  return (
    <>
      <div className="w-full">
        <BreadCrumbs title="HR Pass Slip Approvers" />
        {error ? <ToastNotification toastType="error" notifMessage="An error occurred. Please try again later." /> : null}
        {success ? <ToastNotification toastType="success" notifMessage={success} /> : null}
        {failure ? <ToastNotification toastType="error" notifMessage={failure} /> : null}

        <Can I="access" this="Hr_pass_slip_approvers">
          <div className="mx-5">
            <Card>
              {isLoading ? (
                <LoadingSpinner size="lg" />
              ) : (
                <div className="flex flex-row flex-wrap justify-between">
                  <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2"
                      onClick={() => setAddModalIsOpen(true)}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Add HR Pass Slip Approver
                    </button>
                  </div>
                  <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={true} />
                </div>
              )}
            </Card>
          </div>

          <AddHrPassSlipApproverModal
            modalState={addModalIsOpen}
            setModalState={setAddModalIsOpen}
            closeModalAction={() => setAddModalIsOpen(false)}
            onAdded={(name) => {
              setSuccess(`${name || 'Employee'} added as HR Pass Slip Approver`);
              mutate();
            }}
          />

          <DeleteHrPassSlipApproverModal
            modalState={deleteModalIsOpen}
            setModalState={setDeleteModalIsOpen}
            closeModalAction={() => setDeleteModalIsOpen(false)}
            rowData={currentRowData}
            onDeleted={(name) => {
              setSuccess(`${name} removed as HR Pass Slip Approver`);
              mutate();
            }}
            onError={setFailure}
          />
        </Can>

        <Can not I="access" this="Hr_pass_slip_approvers">
          <Navigate to="/page-404" />
        </Can>
      </div>
    </>
  );
};

export default Index;
