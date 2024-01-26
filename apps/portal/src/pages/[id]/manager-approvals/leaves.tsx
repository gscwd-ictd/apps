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
import { ToastNotification, fuzzySort, useDataTable } from '@gscwd-apps/oneui';
import { DataTablePortal } from 'libs/oneui/src/components/Tables/DataTablePortal';
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
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useRouter } from 'next/router';
import ApprovalsPendingLeaveModal from 'apps/portal/src/components/fixed/manager-approvals/ApprovalsPendingLeaveModal';
import ApprovalsCompletedLeaveModal from 'apps/portal/src/components/fixed/manager-approvals/ApprovalsCompletedLeaveModal';
import UseRenderLeaveStatus from 'apps/portal/src/utils/functions/RenderLeaveStatus';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';

export default function LeaveApprovals({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen,
    patchResponseLeave,
    loadingLeave,
    errorLeave,
    errorLeaveResponse,
    leaveApplications,

    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen,

    getLeaveApplicationsList,
    getLeaveApplicationsListSuccess,
    getLeaveApplicationsListFail,

    setLeaveIndividualDetail,

    emptyResponseAndError,
  } = useApprovalStore((state) => ({
    tab: state.tab,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen: state.approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen: state.disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen: state.cancelledLeaveModalIsOpen,
    patchResponseLeave: state.response.patchResponseLeave,
    loadingLeave: state.loading.loadingLeaves,
    errorLeave: state.error.errorLeaves,
    errorLeaveResponse: state.error.errorLeaveResponse,
    leaveApplications: state.leaveApplications,

    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen: state.setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen: state.setCancelledLeaveModalIsOpen,

    getLeaveApplicationsList: state.getLeaveApplicationsList,
    getLeaveApplicationsListSuccess: state.getLeaveApplicationsListSuccess,
    getLeaveApplicationsListFail: state.getLeaveApplicationsListFail,
    emptyResponseAndError: state.emptyResponseAndError,

    setLeaveIndividualDetail: state.setLeaveIndividualDetail,
  }));

  const router = useRouter();

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);
  // set state for employee store
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails, setEmployeeDetails]);

  // cancel action for Pending Leave Application Modal
  const closePendingLeaveModal = async () => {
    setPendingLeaveModalIsOpen(false);
  };

  // cancel action for Approved Leave Application Modal
  const closeApprovedLeaveModal = async () => {
    setApprovedLeaveModalIsOpen(false);
  };

  // cancel action for Dispproved Leave Application Modal
  const closeDisapprovedLeaveModal = async () => {
    setDisapprovedLeaveModalIsOpen(false);
  };

  // cancel action for Cancelled Pass Slip Application Modal
  const closeCancelledLeaveModal = async () => {
    setCancelledLeaveModalIsOpen(false);
  };

  const leaveUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/supervisor/v2/${employeeDetails.employmentDetails.userId}`;

  const {
    data: swrLeaves,
    isLoading: swrLeaveIsLoading,
    error: swrLeaveError,
    mutate: mutateLeaves,
  } = useSWR(employeeDetails.employmentDetails.userId ? leaveUrl : null, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrLeaveIsLoading) {
      getLeaveApplicationsList(swrLeaveIsLoading);
    }
  }, [swrLeaveIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaves)) {
      getLeaveApplicationsListSuccess(swrLeaveIsLoading, swrLeaves);
    }

    if (!isEmpty(swrLeaveError)) {
      getLeaveApplicationsListFail(swrLeaveIsLoading, swrLeaveError.message);
    }
  }, [swrLeaves, swrLeaveError]);

  useEffect(() => {
    if (!isEmpty(patchResponseLeave)) {
      mutateLeaves();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [patchResponseLeave]);

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
  const renderRowActions = (rowData: SupervisorLeaveDetails) => {
    setLeaveIndividualDetail(rowData);
    if (rowData.status == LeaveStatus.APPROVED) {
      if (!approvedLeaveModalIsOpen) {
        setApprovedLeaveModalIsOpen(true);
      }
    } else if (
      rowData.status == LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
      rowData.status == LeaveStatus.FOR_HRDM_APPROVAL ||
      rowData.status == LeaveStatus.FOR_HRMO_APPROVAL
    ) {
      // PENDING APPROVAL LEAVES
      if (!pendingLeaveModalIsOpen) {
        setPendingLeaveModalIsOpen(true);
      }
    } else if (
      rowData.status == LeaveStatus.DISAPPROVED_BY_HRDM ||
      rowData.status == LeaveStatus.DISAPPROVED_BY_HRMO ||
      rowData.status == LeaveStatus.DISAPPROVED_BY_SUPERVISOR
    ) {
      // DISAPPROVED LEAVES
      if (!disapprovedLeaveModalIsOpen) {
        setDisapprovedLeaveModalIsOpen(true);
      }
    } else {
      // CANCELLED LEAVES
      if (!cancelledLeaveModalIsOpen) {
        setCancelledLeaveModalIsOpen(true);
      }
    }
  };

  // Define table columns
  const columnHelper = createColumnHelper<SupervisorLeaveDetails>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateOfFiling', {
      header: 'Date of Filing',
      filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('employee.employeeName', {
      header: 'Employee Name',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('leaveName', {
      header: 'Leave Benefit',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'leaveDates',
      header: 'Leave Dates',
      enableColumnFilter: false,
      cell: (props) => renderRowLeaveDates(props.row.original.leaveDates),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => UseRenderLeaveStatus(info.getValue(), TextSize.TEXT_SM),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: leaveApplications,
    columnVisibility: { id: false, employeeId: false },
  });

  return (
    <>
      <>
        {/* Leave Approval Patch Success */}
        {!isEmpty(patchResponseLeave) ? (
          <ToastNotification toastType="success" notifMessage={`Leave Application action submitted.`} />
        ) : null}

        {/* Leave Patch Failed Error */}
        {!isEmpty(errorLeaveResponse) ? (
          <ToastNotification toastType="error" notifMessage={`Leave Application action failed.`} />
        ) : null}

        {/* Leave List Load Failed Error */}
        {!isEmpty(errorLeave) ? (
          <ToastNotification toastType="error" notifMessage={`${errorLeave}: Failed to load Leaves.`} />
        ) : null}

        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Leave Approvals</title>
          </Head>

          <SideNav employeeDetails={employeeDetails} />

          {/* Pending Leave Approval Modal */}
          <ApprovalsPendingLeaveModal
            modalState={pendingLeaveModalIsOpen}
            setModalState={setPendingLeaveModalIsOpen}
            closeModalAction={closePendingLeaveModal}
          />

          {/* Leave Approved/Disapproved/Cancelled ModalApproval Modal */}
          <ApprovalsCompletedLeaveModal
            modalState={approvedLeaveModalIsOpen}
            setModalState={setApprovedLeaveModalIsOpen}
            closeModalAction={closeApprovedLeaveModal}
          />

          {/* Disapproved Leaves */}
          <ApprovalsCompletedLeaveModal
            modalState={disapprovedLeaveModalIsOpen}
            setModalState={setDisapprovedLeaveModalIsOpen}
            closeModalAction={closeDisapprovedLeaveModal}
          />

          {/* Cancelled Leaves */}
          <ApprovalsCompletedLeaveModal
            modalState={cancelledLeaveModalIsOpen}
            setModalState={setCancelledLeaveModalIsOpen}
            closeModalAction={closeCancelledLeaveModal}
          />

          <MainContainer>
            <div className="w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32">
              <ContentHeader
                title="Employee Leave Approvals"
                subtitle="Approve or disapprove Employee Leaves"
                backUrl={`/${router.query.id}/manager-approvals`}
              ></ContentHeader>

              {loadingLeave ? (
                <div className="w-full h-96 static flex flex-col justify-items-center items-center place-items-center">
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
                      onRowClick={(row) => renderRowActions(row.original as SupervisorLeaveDetails)}
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
