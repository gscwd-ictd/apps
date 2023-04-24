import Head from 'next/head';
import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import { SideNav } from '../../../components/fixed/nav/SideNav';
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
import { Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ApprovalsTabs } from '../../../../src/components/fixed/approvals/ApprovalsTabs';
import { ApprovalsTabWindow } from '../../../../src/components/fixed/approvals/ApprovalsTabWindow';
import { useApprovalStore } from '../../../../src/store/approvals.store';
import useSWR, { mutate } from 'swr';
import { ApprovalTypeSelect } from '../../../../src/components/fixed/approvals/ApprovalTypeSelect';
import { employeeDummy } from '../../../../src/types/employee.type';
import { ApprovalPendingLeaveModal } from '../../../../src/components/fixed/approvals/ApprovalsPendingLeaveModal';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';

export default function Approvals({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen,
    pendingPassSlipModalIsOpen,
    approvedPassSlipModalIsOpen,
    disapprovedPassSlipModalIsOpen,
    postResponsePassSlip,
    postResponseLeave,
    loadingPassSlip,
    loadingLeave,
    errorPassSlip,
    errorLeave,

    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen,
    setPendingPassSlipModalIsOpen,
    setApprovedPassSlipModalIsOpen,
    setDisapprovedPassSlipModalIsOpen,

    getPassSlipList,
    getPassSlipListSuccess,
    getPassSlipListFail,

    getLeaveList,
    getLeaveListSuccess,
    getLeaveListFail,
  } = useApprovalStore((state) => ({
    tab: state.tab,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen: state.approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen: state.disapprovedLeaveModalIsOpen,
    pendingPassSlipModalIsOpen: state.pendingPassSlipModalIsOpen,
    approvedPassSlipModalIsOpen: state.approvedPassSlipModalIsOpen,
    disapprovedPassSlipModalIsOpen: state.disapprovedPassSlipModalIsOpen,
    postResponsePassSlip: state.response.postResponsePassSlip,
    postResponseLeave: state.response.postResponseLeave,
    loadingPassSlip: state.loading.loadingPassSlips,
    loadingLeave: state.loading.loadingLeaves,
    errorPassSlip: state.error.errorPassSlips,
    errorLeave: state.error.errorLeaves,

    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen: state.setDisapprovedLeaveModalIsOpen,
    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setApprovedPassSlipModalIsOpen: state.setApprovedPassSlipModalIsOpen,
    setDisapprovedPassSlipModalIsOpen: state.setDisapprovedPassSlipModalIsOpen,

    getPassSlipList: state.getPassSlipList,
    getPassSlipListSuccess: state.getPassSlipListSuccess,
    getPassSlipListFail: state.getPassSlipListFail,

    getLeaveList: state.getLeaveList,
    getLeaveListSuccess: state.getLeaveListSuccess,
    getLeaveListFail: state.getLeaveListFail,
  }));

  // get state for the modal
  const modal = useApprovalStore((state) => state.modal);

  // get loading state from store
  const isLoading = useApprovalStore((state) => state.isLoading);

  // set loading state from store
  const setIsLoading = useApprovalStore((state) => state.setIsLoading);

  // set state for the modal
  const setModal = useApprovalStore((state) => state.setModal);

  const setAction = useApprovalStore((state) => state.setAction);
  const action = useApprovalStore((state) => state.action);

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );
  // set state for employee store
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
    setIsLoading(true);
  }, [employeeDetails, setEmployeeDetails, setIsLoading]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, setIsLoading]);

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

  // cancel action for Pending Leave Application Modal
  const closePendingPassSlipModal = async () => {
    setPendingLeaveModalIsOpen(false);
  };

  // cancel action for Approved Leave Application Modal
  const closeApprovedPassSlipModal = async () => {
    setApprovedLeaveModalIsOpen(false);
  };

  // cancel action for Dispproved Leave Application Modal
  const closeDisapprovedPassSlipModal = async () => {
    setDisapprovedLeaveModalIsOpen(false);
  };

  const passSlipUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/pass-slip/${employeeDetails.employmentDetails.userId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrPassSlips,
    isLoading: swrPassSlipIsLoading,
    error: swrPassSlipError,
    mutate: mutatePassSlips,
  } = useSWR(passSlipUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrPassSlipIsLoading) {
      getPassSlipList(swrPassSlipIsLoading);
    }
  }, [swrPassSlipIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    // console.log(swrPassSlips);
    if (!isEmpty(swrPassSlips)) {
      getPassSlipListSuccess(swrPassSlipIsLoading, swrPassSlips);
    }

    if (!isEmpty(swrPassSlipError)) {
      getPassSlipListFail(swrPassSlipIsLoading, swrPassSlipError.message);
    }
  }, [swrPassSlips, swrPassSlipError]);

  const leaveUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/${employeeDetails.employmentDetails.userId}`;

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
      // console.log(swrLeaves);
    }

    if (!isEmpty(swrLeaveError)) {
      getLeaveListFail(swrLeaveIsLoading, swrLeaveError.message);
    }
  }, [swrLeaves, swrLeaveError]);

  useEffect(() => {
    if (!isEmpty(postResponsePassSlip)) {
      mutatePassSlips();
    }
    if (!isEmpty(postResponseLeave)) {
      mutateLeaves();
    }
  }, [postResponsePassSlip, postResponseLeave]);

  return (
    <>
      <>
        {/* Pass Slip List Load Failed Error */}
        {errorPassSlip ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorPassSlip}: Failed to load Pass Slips.`}
          />
        ) : null}

        {/* Leave List Load Failed Error */}
        {errorLeave ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorLeave}: Failed to load Leaves.`}
          />
        ) : null}

        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Approvals</title>
          </Head>

          <SideNav />

          {/* Pending Leave Approval Modal */}
          <ApprovalPendingLeaveModal
            modalState={pendingLeaveModalIsOpen}
            setModalState={setPendingLeaveModalIsOpen}
            closeModalAction={closePendingLeaveModal}
          />

          <MainContainer>
            <div className="w-full h-full px-32">
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
                    <div className="w-full flex">
                      <div className="w-[58rem]">
                        <ApprovalsTabs tab={tab} />
                      </div>
                      <div className="w-full">
                        <ApprovalsTabWindow
                          employeeId={employeeDummy.employmentDetails.userId}
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

    return { props: { employeeDetails } };
  }
);
