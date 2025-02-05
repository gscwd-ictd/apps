import Head from 'next/head';
import { useEffect } from 'react';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import React from 'react';
import useSWR from 'swr';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { isEmpty, isEqual } from 'lodash';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { FinalApprovalsPendingLeaveModal } from 'apps/portal/src/components/fixed/final-leave-approvals/FinalApprovalsPendingLeaveModal';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';
import FinalApprovalsCompletedLeaveModal from 'apps/portal/src/components/fixed/final-leave-approvals/FinalApprovalsCompletedLeaveModal';
import { SupervisorLeaveDetails } from 'libs/utils/src/lib/types/leave-application.type';
import dayjs from 'dayjs';
import { createColumnHelper } from '@tanstack/react-table';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useRouter } from 'next/router';
import { LoadingSpinner, ToastNotification, fuzzySort } from '@gscwd-apps/oneui';
import { DataTablePortal, useDataTable } from 'libs/oneui/src/components/Tables/DataTablePortal';
import UseRenderLeaveStatus from 'apps/portal/src/utils/functions/RenderLeaveStatus';
import { ApprovalType } from 'libs/utils/src/lib/enums/approval-type.enum';

export default function FinalLeaveApprovals({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen,
    patchResponseLeave,
    errorLeave,
    leaveApplications,
    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen,
    setLeaveIndividualDetail,

    getLeaveApplicationsList,
    getLeaveApplicationsListSuccess,
    getLeaveApplicationsListFail,
    emptyResponseAndError,
  } = useFinalLeaveApprovalStore((state) => ({
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen: state.approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen: state.disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen: state.cancelledLeaveModalIsOpen,
    patchResponseLeave: state.response.patchResponseLeave,
    errorLeave: state.error.errorLeaves,
    leaveApplications: state.leaveApplications,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen: state.setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen: state.setCancelledLeaveModalIsOpen,
    setLeaveIndividualDetail: state.setLeaveIndividualDetail,
    getLeaveApplicationsList: state.getLeaveApplicationsList,
    getLeaveApplicationsListSuccess: state.getLeaveApplicationsListSuccess,
    getLeaveApplicationsListFail: state.getLeaveApplicationsListFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const router = useRouter();

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);

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

  // cancel action for Dispproved Leave Application Modal
  const closeCancelledLeaveModal = async () => {
    setCancelledLeaveModalIsOpen(false);
  };

  const leaveUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/hrdm`;

  const {
    data: swrLeaves,
    isLoading: swrLeaveIsLoading,
    error: swrLeaveError,
    mutate: mutateLeaves,
  } = useSWR(leaveUrl, fetchWithToken, {});

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
      rowData.status == LeaveStatus.FOR_HRDM_APPROVAL ||
      rowData.status == LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
      rowData.status == LeaveStatus.FOR_HRMO_APPROVAL ||
      rowData.status == LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION
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
    // leaveId
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateOfFiling', {
      header: 'Date of Filing',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
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
      cell: (info) => UseRenderLeaveStatus(info.getValue()),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable(
    {
      columns: columns,
      data: leaveApplications,
      columnVisibility: { id: false, employeeId: false },
    },
    ApprovalType.FINAL_LEAVE
  );

  return (
    <>
      <>
        {/* Leave List Load Failed Error */}
        {!isEmpty(errorLeave) ? (
          <ToastNotification toastType="error" notifMessage={`${errorLeave}: Failed to load Leaves.`} />
        ) : null}

        {/* Leave List Load Failed Error */}
        {!isEmpty(patchResponseLeave) ? (
          <ToastNotification toastType="success" notifMessage={`Leave Application action submitted.`} />
        ) : null}

        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Final Leave Approvals</title>
          </Head>

          <SideNav employeeDetails={employeeDetails} />

          {/* Pending Leave Approval Modal */}
          <FinalApprovalsPendingLeaveModal
            modalState={pendingLeaveModalIsOpen}
            setModalState={setPendingLeaveModalIsOpen}
            closeModalAction={closePendingLeaveModal}
          />

          {/* Approved Leave Modal */}
          <FinalApprovalsCompletedLeaveModal
            modalState={approvedLeaveModalIsOpen}
            setModalState={setApprovedLeaveModalIsOpen}
            closeModalAction={closeApprovedLeaveModal}
          />

          {/* Disapproved Leave Modal */}
          <FinalApprovalsCompletedLeaveModal
            modalState={disapprovedLeaveModalIsOpen}
            setModalState={setDisapprovedLeaveModalIsOpen}
            closeModalAction={closeDisapprovedLeaveModal}
          />

          {/* Cancelled Leave Modal */}
          <FinalApprovalsCompletedLeaveModal
            modalState={cancelledLeaveModalIsOpen}
            setModalState={setCancelledLeaveModalIsOpen}
            closeModalAction={closeCancelledLeaveModal}
          />

          <MainContainer>
            <div className="w-full pl-4 pr-4 lg:pl-32 lg:pr-32">
              <ContentHeader
                title="Employee Final Leave Approvals"
                subtitle="Approve or Disapprove Employee Leaves"
                backUrl={`/${router.query.id}`}
              >
                {/* <ApprovalTypeSelect /> */}
              </ContentHeader>
              {swrLeaveIsLoading ? (
                <div className="w-full h-96 static flex flex-col justify-center items-center place-items-center">
                  <LoadingSpinner size={'lg'} />
                  {/* <SpinnerDotted
                    speed={70}
                    thickness={70}
                    className="w-full flex h-full transition-all "
                    color="slateblue"
                    size={100}
                  /> */}
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

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  // check if user role is rank_and_file or job order = kick out
  if (
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER)
  ) {
    if (
      employeeDetails.employmentDetails.assignment.name === 'Recruitment and Personnel Welfare Division' ||
      employeeDetails.employmentDetails.assignment.name === 'Human Resource Department'
    ) {
      return { props: { employeeDetails } };
    } else {
      // if false, the employee is not allowed to access this page
      return {
        redirect: {
          permanent: false,
          destination: `/${employeeDetails.user._id}`,
        },
      };
    }
  } else {
    // if false, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${employeeDetails.user._id}`,
      },
    };
  }
});
