import Head from 'next/head';
import { useEffect, useState } from 'react';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { DataTablePortal, ToastNotification, fuzzySort, useDataTable } from '@gscwd-apps/oneui';
import React from 'react';
import { useApprovalStore } from '../../../store/approvals.store';
import useSWR from 'swr';
import { employeeDummy } from '../../../types/employee.type';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import dayjs from 'dayjs';
import { createColumnHelper } from '@tanstack/react-table';
import { SupervisorLeaveDetails } from 'libs/utils/src/lib/types/leave-application.type';
import UseRenderPassSlipStatus from 'apps/employee-monitoring/src/utils/functions/RenderPassSlipStatus';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import ApprovalsPendingPassSlipModal from 'apps/portal/src/components/fixed/manager-approvals/ApprovalsPendingPassSlipModal';
import ApprovalsCompletedPassSlipModal from 'apps/portal/src/components/fixed/manager-approvals/ApprovalsCompletedPassSlipModal';

export default function OvertimeApprovals({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    pendingOvertimeModalIsOpen,
    approvedOvertimeModalIsOpen,
    disapprovedOvertimeModalIsOpen,

    patchResponseOvertime,
    patchResponseAccomplishment,
    loadingOvertime,
    errorOvertime,
    errorOvertimeResponse,
    errorAccomplishment,
    errorAccomplishmentResponse,

    setPendingOvertimeModalIsOpen,
    setApprovedOvertimeModalIsOpen,
    setDisapprovedOvertimeModalIsOpen,

    getPassSlipApplicationsList,
    getPassSlipApplicationsListSuccess,
    getPassSlipApplicationsListFail,

    setPassSlipIndividualDetail,

    emptyResponseAndError,
  } = useApprovalStore((state) => ({
    tab: state.tab,
    pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
    approvedOvertimeModalIsOpen: state.approvedOvertimeModalIsOpen,
    disapprovedOvertimeModalIsOpen: state.disapprovedOvertimeModalIsOpen,

    patchResponseOvertime: state.response.patchResponseOvertime,
    patchResponseAccomplishment: state.response.patchResponseAccomplishment,
    loadingOvertime: state.loading.loadingOvertime,
    errorOvertime: state.error.errorOvertime,
    errorOvertimeResponse: state.error.errorOvertimeResponse,
    errorAccomplishment: state.error.errorAccomplishment,
    errorAccomplishmentResponse: state.error.errorAccomplishmentResponse,

    setPendingOvertimeModalIsOpen: state.setPendingOvertimeModalIsOpen,
    setApprovedOvertimeModalIsOpen: state.setApprovedOvertimeModalIsOpen,
    setDisapprovedOvertimeModalIsOpen: state.setDisapprovedOvertimeModalIsOpen,

    getPassSlipApplicationsList: state.getPassSlipApplicationsList,
    getPassSlipApplicationsListSuccess: state.getPassSlipApplicationsListSuccess,
    getPassSlipApplicationsListFail: state.getPassSlipApplicationsListFail,
    emptyResponseAndError: state.emptyResponseAndError,

    setPassSlipIndividualDetail: state.setPassSlipIndividualDetail,
  }));

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);
  // set state for employee store
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails, setEmployeeDetails]);

  // cancel action for Pending Modal
  const closePendingPassSlipModal = async () => {
    setPendingOvertimeModalIsOpen(false);
  };

  // cancel action for Approved Modal
  const closeApprovedPassSlipModal = async () => {
    setApprovedOvertimeModalIsOpen(false);
  };

  // cancel action for Dispproved  Modal
  const closeDisapprovedPassSlipModal = async () => {
    setDisapprovedOvertimeModalIsOpen(false);
  };

  const passSlipUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/pass-slip/supervisor/${employeeDetails.employmentDetails.userId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrPassSlips,
    isLoading: swrPassSlipIsLoading,
    error: swrPassSlipError,
    mutate: mutatePassSlips,
  } = useSWR(passSlipUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrPassSlipIsLoading) {
      getPassSlipApplicationsList(swrPassSlipIsLoading);
    }
  }, [swrPassSlipIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPassSlips)) {
      getPassSlipApplicationsListSuccess(swrPassSlipIsLoading, swrPassSlips);
    }

    if (!isEmpty(swrPassSlipError)) {
      getPassSlipApplicationsListFail(swrPassSlipIsLoading, swrPassSlipError.message);
    }
  }, [swrPassSlips, swrPassSlipError]);

  // Rendering of leave dates in row
  const renderRowLeaveDates = (leaveDates: Array<string>) => {
    if (leaveDates) {
      if (leaveDates.length > 3) {
        return (
          <span className="bg-gray-300 text-gray-700 text-sm font-mono px-1 py-0.5 ml-1 rounded text-center">
            {leaveDates[0]} to {leaveDates.slice(-1)}
          </span>
        );
      } else {
        return leaveDates.map((leaveDate: string, index: number) => (
          <span
            className="bg-gray-300 text-gray-700 text-sm font-mono px-1 py-0.5 ml-1 rounded text-center whitespace-nowrap"
            key={index}
          >
            {leaveDate}
          </span>
        ));
      }
    }
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: PassSlip) => {
    setPassSlipIndividualDetail(rowData);
    console.log(rowData);
    if (rowData.status == PassSlipStatus.APPROVED) {
      if (!approvedOvertimeModalIsOpen) {
        setApprovedOvertimeModalIsOpen(true);
      }
    } else if (rowData.status == PassSlipStatus.FOR_APPROVAL) {
      // PENDING APPROVAL
      if (!pendingOvertimeModalIsOpen) {
        setPendingOvertimeModalIsOpen(true);
      }
    } else if (rowData.status == PassSlipStatus.DISAPPROVED) {
      // DISAPPROVED
      if (!disapprovedOvertimeModalIsOpen) {
        setDisapprovedOvertimeModalIsOpen(true);
      }
    } else {
    }
  };

  // Define table columns
  const columnHelper = createColumnHelper<PassSlip>();
  const columns = [
    // leaveId
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateOfApplication', {
      header: 'Date of Filing',
      filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('employeeName', {
      header: 'Employee Name',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('natureOfBusiness', {
      header: 'Nature of Business',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('estimateHours', {
      header: 'Estimated Hours',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => UseRenderPassSlipStatus(info.getValue()),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: passSlipApplications,
    columnVisibility: { id: false, employeeId: false },
  });

  return (
    <>
      <>
        {/* Pass Slip Approval Patch Success */}
        {!isEmpty(patchResponsePassSlip) ? (
          <ToastNotification toastType="success" notifMessage={`Pass Slip Application action submitted.`} />
        ) : null}
        {/* Pass Slip Patch Failed Error */}
        {!isEmpty(errorPassSlipResponse) ? (
          <ToastNotification toastType="error" notifMessage={`Pass Slip Application action failed.`} />
        ) : null}
        {/* Pass Slip List Load Failed Error */}
        {!isEmpty(errorPassSlip) ? (
          <ToastNotification toastType="error" notifMessage={`${errorPassSlip}: Failed to load Pass Slips.`} />
        ) : null}

        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Approvals</title>
          </Head>

          <SideNav employeeDetails={employeeDetails} />

          {/* Pending Pass Slip For Approval Modal */}
          <ApprovalsPendingPassSlipModal
            modalState={pendingOvertimeModalIsOpen}
            setModalState={setPendingOvertimeModalIsOpen}
            closeModalAction={closePendingPassSlipModal}
          />

          {/* Pass Slip Approved/Disapproved/Cancelled Modal */}
          <ApprovalsCompletedPassSlipModal
            modalState={approvedOvertimeModalIsOpen}
            setModalState={setApprovedOvertimeModalIsOpen}
            closeModalAction={closeApprovedPassSlipModal}
          />

          {/* Disapproved Pass Slips */}
          <ApprovalsCompletedPassSlipModal
            modalState={disapprovedOvertimeModalIsOpen}
            setModalState={setDisapprovedOvertimeModalIsOpen}
            closeModalAction={closeDisapprovedPassSlipModal}
          />

          {/* Cancelled Pass Slips */}
          <ApprovalsCompletedPassSlipModal
            modalState={cancelledOvertimeModalIsOpen}
            setModalState={setCancelledOvertimeModalIsOpen}
            closeModalAction={closeCancelledPassSlipModal}
          />

          <MainContainer>
            <div className="w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32">
              <ContentHeader
                title="Employee Leave Approvals"
                subtitle="Approve or disapprove Employee Leaves"
              ></ContentHeader>

              {loadingPassSlip ? (
                <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                  <SpinnerDotted
                    speed={70}
                    thickness={70}
                    className="w-full flex h-full transition-all "
                    color="slateblue"
                    size={100}
                  />
                </div>
              ) : (
                <ContentBody>
                  <div>
                    <DataTablePortal
                      onRowClick={(row) => renderRowActions(row.original as PassSlip)}
                      textSize={'text-lg'}
                      model={table}
                      showGlobalFilter={true}
                      showColumnFilter={true}
                      paginate={true}
                    />
                  </div>
                </ContentBody>
              )}
            </div>
          </MainContainer>
        </EmployeeProvider>
      </>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const employeeDetails = employeeDummy;

//   return { props: { employeeDetails } };
// };

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  // check if user role is rank_and_file or job order = kick out
  if (
    employeeDetails.employmentDetails.userRole === UserRole.RANK_AND_FILE ||
    employeeDetails.employmentDetails.userRole === UserRole.JOB_ORDER
  ) {
    // if true, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${employeeDetails.user._id}`,
      },
    };
  } else {
    return { props: { employeeDetails } };
  }
});
