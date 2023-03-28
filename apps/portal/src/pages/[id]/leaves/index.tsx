import Head from 'next/head';
import { useEffect } from 'react';
import { HiDocumentAdd, HiX } from 'react-icons/hi';
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
import { getUserDetails, withSession } from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { LeavesTabs } from '../../../components/fixed/leaves/LeavesTabs';
import { LeavesTabWindow } from '../../../components/fixed/leaves/LeavesTabWindow';
import { Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { employeeDummy } from '../../../../src/types/employee.type';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { LeaveApplicationModal } from '../../../../src/components/fixed/leaves/LeaveApplicationModal';
import { LeavePendingModal } from '../../../components/fixed/leaves/LeavePendingModal';
import LeaveCompletedModal from '../../../../src/components/fixed/leaves/LeaveCompletedModal';

export default function Leaves({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    applyLeaveModalIsOpen,
    pendingLeaveModalIsOpen,
    completedLeaveModalIsOpen,
    loading,
    error,
    responseApply,
    responseCancel,

    setApplyLeaveModalIsOpen,
    setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen,

    getLeaveList,
    getLeaveListSuccess,
    getLeaveListFail,
  } = useLeaveStore((state) => ({
    tab: state.tab,
    applyLeaveModalIsOpen: state.applyLeaveModalIsOpen,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    completedLeaveModalIsOpen: state.completedLeaveModalIsOpen,

    loading: state.loading.loadingLeaves,
    error: state.error.errorLeaves,
    responseApply: state.response.postResponseApply,
    responseCancel: state.response.deleteResponseCancel,

    setApplyLeaveModalIsOpen: state.setApplyLeaveModalIsOpen,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen: state.setCompletedLeaveModalIsOpen,

    getLeaveList: state.getLeaveList,
    getLeaveListSuccess: state.getLeaveListSuccess,
    getLeaveListFail: state.getLeaveListFail,
  }));

  // open the modal
  const openApplyLeaveModal = () => {
    if (!applyLeaveModalIsOpen) {
      setApplyLeaveModalIsOpen(true);
    }
  };

  // cancel action for Pass Slip Application Modal
  const closeApplyLeaveModal = async () => {
    setApplyLeaveModalIsOpen(false);
  };

  // cancel action for Pass Slip Pending Modal
  const closePendingLeaveModal = async () => {
    setPendingLeaveModalIsOpen(false);
  };

  // cancel action for Pass Slip Completed Modal
  const closeCompletedLeaveModal = async () => {
    setCompletedLeaveModalIsOpen(false);
  };

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

  const leaveUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/${employeeDetails.employmentDetails.userId}`;

  const {
    data: swrLeaves,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutateLeaves,
  } = useSWR(leaveUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getLeaveList(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaves)) {
      getLeaveListSuccess(swrIsLoading, swrLeaves);
      console.log(swrLeaves);
    }

    if (!isEmpty(swrError)) {
      getLeaveListFail(swrIsLoading, swrError.message);
    }
  }, [swrLeaves, swrError]);

  useEffect(() => {
    if (!isEmpty(responseApply) || !isEmpty(responseCancel)) {
      mutateLeaves();
    }
  }, [responseApply, responseCancel]);

  return (
    <>
      {error ? (
        <ToastNotification toastType="error" notifMessage={error} />
      ) : null}

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Leaves</title>
        </Head>

        <SideNav />

        {/* Pass Slip Application Modal */}
        <LeaveApplicationModal
          modalState={applyLeaveModalIsOpen}
          setModalState={setApplyLeaveModalIsOpen}
          closeModalAction={closeApplyLeaveModal}
        />

        {/* Pass Slip Pending Modal */}
        <LeavePendingModal
          modalState={pendingLeaveModalIsOpen}
          setModalState={setPendingLeaveModalIsOpen}
          closeModalAction={closePendingLeaveModal}
        />

        {/* Pass Slip Pending Modal */}
        <LeaveCompletedModal
          modalState={completedLeaveModalIsOpen}
          setModalState={setCompletedLeaveModalIsOpen}
          closeModalAction={closeCompletedLeaveModal}
        />

        <MainContainer>
          <div className="w-full h-full px-32">
            <ContentHeader
              title="Employee Leaves"
              subtitle="Apply for company leave"
            >
              <Button onClick={openApplyLeaveModal}>
                <div className="flex items-center w-full gap-2">
                  <HiDocumentAdd /> Apply for Leave
                </div>
              </Button>
            </ContentHeader>
            {loading ? (
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
                      <LeavesTabs tab={tab} />
                    </div>
                    <div className="w-full">
                      <LeavesTabWindow
                      // employeeId={employeeDummy.employmentDetails.userId}
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
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const employeeDetails = employeeDummy;

  return { props: { employeeDetails } };
};

// export const getServerSideProps: GetServerSideProps = withSession(
//   async (context: GetServerSidePropsContext) => {
//     const employeeDetails = getUserDetails();

//     return { props: { employeeDetails } };
//   }
// );
