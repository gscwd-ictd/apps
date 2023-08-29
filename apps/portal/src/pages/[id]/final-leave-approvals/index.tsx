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
import { SpinnerDotted } from 'spinners-react';
import { ToastNotification } from '@gscwd-apps/oneui';
import React from 'react';
import useSWR from 'swr';
import { employeeDummy } from '../../../types/employee.type';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { isEmpty, isEqual } from 'lodash';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { FinalApprovalsPendingLeaveModal } from 'apps/portal/src/components/fixed/final-leave-approvals/FinalApprovalsPendingLeaveModal';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';
import { FinalApprovalsTabs } from 'apps/portal/src/components/fixed/final-leave-approvals/FinalApprovalsTabs';
import { FinalApprovalsTabWindow } from 'apps/portal/src/components/fixed/final-leave-approvals/FinalApprovalsTabWindow';
import FinalApprovalsCompletedLeaveModal from 'apps/portal/src/components/fixed/final-leave-approvals/FinalApprovalsCompletedLeaveModal';

export default function FinalLeaveApprovals({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen,

    patchResponseLeave,
    loadingLeave,
    errorLeave,

    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen,

    getLeaveList,
    getLeaveListSuccess,
    getLeaveListFail,
    emptyResponseAndError,
  } = useFinalLeaveApprovalStore((state) => ({
    tab: state.tab,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen: state.approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen: state.disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen: state.cancelledLeaveModalIsOpen,

    patchResponseLeave: state.response.patchResponseLeave,
    loadingLeave: state.loading.loadingLeaves,
    errorLeave: state.error.errorLeaves,

    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen: state.setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen: state.setCancelledLeaveModalIsOpen,

    getLeaveList: state.getLeaveList,
    getLeaveListSuccess: state.getLeaveListSuccess,
    getLeaveListFail: state.getLeaveListFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

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
  } = useSWR(leaveUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrLeaveIsLoading) {
      getLeaveList(swrLeaveIsLoading);
    }
  }, [swrLeaveIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaves)) {
      getLeaveListSuccess(swrLeaveIsLoading, swrLeaves);
    }

    if (!isEmpty(swrLeaveError)) {
      getLeaveListFail(swrLeaveIsLoading, swrLeaveError.message);
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
            <div className="w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32">
              <ContentHeader title="Employee Final Leave Approvals" subtitle="Approve Employee Leaves">
                {/* <ApprovalTypeSelect /> */}
              </ContentHeader>
              {loadingLeave ? (
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
                  <>
                    <div className={`w-full flex lg:flex-row flex-col`}>
                      <div className={`lg:w-[58rem] w-full`}>
                        <FinalApprovalsTabs tab={tab} />
                      </div>
                      <div className="w-full">
                        <FinalApprovalsTabWindow employeeId={employeeDetails.employmentDetails.userId} />
                      </div>
                    </div>
                  </>
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
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER)
  ) {
    if (
      employeeDetails.employmentDetails.assignment.name === 'Recruitment and Personnel Welfare Division' ||
      employeeDetails.employmentDetails.assignment.name === 'Training and Development Division'
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
