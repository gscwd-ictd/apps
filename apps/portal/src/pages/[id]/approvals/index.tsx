import Head from 'next/head';
import { useEffect, useState } from 'react';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
// import { getUserDetails, withSession } from '../../../utils/helpers/session';
import {
  getUserDetails,
  withCookieSession,
  withSession,
} from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { ToastNotification } from '@gscwd-apps/oneui';
import React from 'react';
import { ApprovalsTabs } from '../../../../src/components/fixed/approvals/ApprovalsTabs';
import { ApprovalsTabWindow } from '../../../../src/components/fixed/approvals/ApprovalsTabWindow';
import { useApprovalStore } from '../../../../src/store/approvals.store';
import useSWR from 'swr';
import { ApprovalTypeSelect } from '../../../../src/components/fixed/approvals/ApprovalTypeSelect';
import { employeeDummy } from '../../../../src/types/employee.type';
import ApprovalsPendingLeaveModal from '../../../../src/components/fixed/approvals/ApprovalsPendingLeaveModal';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import ApprovalsPendingPassSlipModal from '../../../../src/components/fixed/approvals/ApprovalsPendingPassSlipModal';
import ApprovalsCompletedPassSlipModal from '../../../../src/components/fixed/approvals/ApprovalsCompletedPassSlipModal';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';

export default function Approvals({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen,

    pendingPassSlipModalIsOpen,
    approvedPassSlipModalIsOpen,
    disapprovedPassSlipModalIsOpen,
    cancelledPassSlipModalIsOpen,

    patchResponsePassSlip,
    postResponseLeave,
    loadingPassSlip,
    loadingLeave,
    errorPassSlip,
    errorLeave,

    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen,

    setPendingPassSlipModalIsOpen,
    setApprovedPassSlipModalIsOpen,
    setDisapprovedPassSlipModalIsOpen,
    setCancelledPassSlipModalIsOpen,

    getPassSlipList,
    getPassSlipListSuccess,
    getPassSlipListFail,

    getLeaveList,
    getLeaveListSuccess,
    getLeaveListFail,
    emptyResponseAndError,
  } = useApprovalStore((state) => ({
    tab: state.tab,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen: state.approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen: state.disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen: state.cancelledLeaveModalIsOpen,

    pendingPassSlipModalIsOpen: state.pendingPassSlipModalIsOpen,
    approvedPassSlipModalIsOpen: state.approvedPassSlipModalIsOpen,
    disapprovedPassSlipModalIsOpen: state.disapprovedPassSlipModalIsOpen,
    cancelledPassSlipModalIsOpen: state.cancelledPassSlipModalIsOpen,

    patchResponsePassSlip: state.response.patchResponsePassSlip,
    postResponseLeave: state.response.postResponseLeave,
    loadingPassSlip: state.loading.loadingPassSlips,
    loadingLeave: state.loading.loadingLeaves,
    errorPassSlip: state.error.errorPassSlips,
    errorLeave: state.error.errorLeaves,

    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen: state.setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen: state.setCancelledLeaveModalIsOpen,

    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setApprovedPassSlipModalIsOpen: state.setApprovedPassSlipModalIsOpen,
    setDisapprovedPassSlipModalIsOpen: state.setDisapprovedPassSlipModalIsOpen,
    setCancelledPassSlipModalIsOpen: state.setCancelledPassSlipModalIsOpen,

    getPassSlipList: state.getPassSlipList,
    getPassSlipListSuccess: state.getPassSlipListSuccess,
    getPassSlipListFail: state.getPassSlipListFail,

    getLeaveList: state.getLeaveList,
    getLeaveListSuccess: state.getLeaveListSuccess,
    getLeaveListFail: state.getLeaveListFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );
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

  // cancel action for Pending Pass Slip Application Modal
  const closePendingPassSlipModal = async () => {
    setPendingPassSlipModalIsOpen(false);
  };

  // cancel action for Approved Pass Slip Application Modal
  const closeApprovedPassSlipModal = async () => {
    setApprovedPassSlipModalIsOpen(false);
  };

  // cancel action for Dispproved Pass Slip Application Modal
  const closeDisapprovedPassSlipModal = async () => {
    setDisapprovedPassSlipModalIsOpen(false);
  };

  // cancel action for Cancelled Pass Slip Application Modal
  const closeCancelledPassSlipModal = async () => {
    setCancelledPassSlipModalIsOpen(false);
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
      getPassSlipList(swrPassSlipIsLoading);
    }
  }, [swrPassSlipIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPassSlips)) {
      getPassSlipListSuccess(swrPassSlipIsLoading, swrPassSlips);
    }

    if (!isEmpty(swrPassSlipError)) {
      getPassSlipListFail(swrPassSlipIsLoading, swrPassSlipError.message);
    }
  }, [swrPassSlips, swrPassSlipError]);

  const leaveUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/supervisor/${employeeDetails.employmentDetails.userId}`;

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
    console.log(swrLeaves);
  }, [swrLeaves, swrLeaveError]);

  useEffect(() => {
    if (!isEmpty(patchResponsePassSlip)) {
      mutatePassSlips();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
    if (!isEmpty(postResponseLeave)) {
      mutateLeaves();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [patchResponsePassSlip, postResponseLeave]);

  const [navDetails, setNavDetails] = useState<NavButtonDetails>();

  useEffect(() => {
    setNavDetails({
      profile: employeeDetails.user.email,
      fullName: `${employeeDetails.profile.firstName} ${employeeDetails.profile.lastName}`,
      initials: UseNameInitials(
        employeeDetails.profile.firstName,
        employeeDetails.profile.lastName
      ),
    });
  }, []);

  return (
    <>
      <>
        {/* Pass Slip List Load Failed Error */}
        {!isEmpty(patchResponsePassSlip) ? (
          <ToastNotification
            toastType="success"
            notifMessage={`Pass Slip action submitted.`}
          />
        ) : null}

        {/* Pass Slip List Load Failed Error */}
        {!isEmpty(errorPassSlip) ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorPassSlip}: Failed to load Pass Slips.`}
          />
        ) : null}

        {/* Leave List Load Failed Error */}
        {!isEmpty(errorLeave) ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorLeave}: Failed to load Leaves.`}
          />
        ) : null}

        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Approvals</title>
          </Head>

          <SideNav navDetails={navDetails} employeeDetails={employeeDetails} />

          {/* Pending Leave Approval Modal */}
          <ApprovalsPendingLeaveModal
            modalState={pendingLeaveModalIsOpen}
            setModalState={setPendingLeaveModalIsOpen}
            closeModalAction={closePendingLeaveModal}
          />

          {/* Pending Pass Slip For Approval Modal */}
          <ApprovalsPendingPassSlipModal
            modalState={pendingPassSlipModalIsOpen}
            setModalState={setPendingPassSlipModalIsOpen}
            closeModalAction={closePendingPassSlipModal}
          />

          {/* Pending Pass Slip Approved/Disapproved/Cancelled Modal */}
          <ApprovalsCompletedPassSlipModal
            modalState={approvedPassSlipModalIsOpen}
            setModalState={setApprovedPassSlipModalIsOpen}
            closeModalAction={closeApprovedPassSlipModal}
          />

          <ApprovalsCompletedPassSlipModal
            modalState={disapprovedPassSlipModalIsOpen}
            setModalState={setDisapprovedPassSlipModalIsOpen}
            closeModalAction={closeDisapprovedPassSlipModal}
          />

          <ApprovalsCompletedPassSlipModal
            modalState={cancelledPassSlipModalIsOpen}
            setModalState={setCancelledPassSlipModalIsOpen}
            closeModalAction={closeCancelledPassSlipModal}
          />

          <MainContainer>
            <div className="w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32">
              <ContentHeader
                title="Employee Approvals"
                subtitle="Approve Employee Pass Slips & Leaves"
              >
                <ApprovalTypeSelect />
              </ContentHeader>
              {loadingPassSlip && loadingLeave ? (
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
                        <ApprovalsTabs tab={tab} />
                      </div>
                      <div className="w-full">
                        <ApprovalsTabWindow
                          employeeId={employeeDetails.employmentDetails.userId}
                        />
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

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
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
  }
);
