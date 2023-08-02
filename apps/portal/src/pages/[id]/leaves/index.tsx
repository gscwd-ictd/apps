import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiDocumentAdd } from 'react-icons/hi';
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
import {
  getUserDetails,
  withCookieSession,
} from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { LeavesTabs } from '../../../components/fixed/leaves/LeavesTabs';
import { LeavesTabWindow } from '../../../components/fixed/leaves/LeavesTabWindow';
import { Button, ToastNotification } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { employeeDummy } from '../../../../src/types/employee.type';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { LeaveApplicationModal } from '../../../../src/components/fixed/leaves/LeaveApplicationModal';
import { LeavePendingModal } from '../../../components/fixed/leaves/LeavePendingModal';
import LeaveCompletedModal from '../../../../src/components/fixed/leaves/LeaveCompletedModal';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';

export default function Leaves({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    applyLeaveModalIsOpen,
    pendingLeaveModalIsOpen,
    completedLeaveModalIsOpen,

    loading,
    errorLeaves,
    errorLeaveDetails,
    errorUnavailableDates,
    errorLeaveTypes,
    errorResponse,
    responseApply,
    responseCancel,

    setApplyLeaveModalIsOpen,
    setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen,

    getLeaveList,
    getLeaveListSuccess,
    getLeaveListFail,
    emptyResponseAndError,
  } = useLeaveStore((state) => ({
    tab: state.tab,
    applyLeaveModalIsOpen: state.applyLeaveModalIsOpen,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    completedLeaveModalIsOpen: state.completedLeaveModalIsOpen,

    loading: state.loading.loadingLeaves,
    errorLeaves: state.error.errorLeaves,
    errorLeaveDetails: state.error.errorIndividualLeave,
    errorUnavailableDates: state.error.errorUnavailableDates,
    errorLeaveTypes: state.error.errorLeaveTypes,
    errorResponse: state.error.errorResponse,

    responseApply: state.response.postResponseApply,
    responseCancel: state.response.deleteResponseCancel,

    setApplyLeaveModalIsOpen: state.setApplyLeaveModalIsOpen,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen: state.setCompletedLeaveModalIsOpen,

    getLeaveList: state.getLeaveList,
    getLeaveListSuccess: state.getLeaveListSuccess,
    getLeaveListFail: state.getLeaveListFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  // open the modal
  const openApplyLeaveModal = () => {
    if (!applyLeaveModalIsOpen) {
      setApplyLeaveModalIsOpen(true);
    }
  };

  // cancel action for Leave Application Modal
  const closeApplyLeaveModal = async () => {
    setApplyLeaveModalIsOpen(false);
  };

  // cancel action for Leave Pending Modal
  const closePendingLeaveModal = async () => {
    setPendingLeaveModalIsOpen(false);
  };

  // cancel action for Leave Completed Modal
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
    }

    if (!isEmpty(swrError)) {
      getLeaveListFail(swrIsLoading, swrError.message);
    }
  }, [swrLeaves, swrError]);

  useEffect(() => {
    if (!isEmpty(responseApply) || !isEmpty(responseCancel)) {
      mutateLeaves();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [responseApply, responseCancel]);

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
        {/* Individual Leave Details Load Failed Error COMPLETED MODAL */}
        {!isEmpty(errorLeaveDetails) && completedLeaveModalIsOpen ? (
          <>
            <ToastNotification
              toastType="error"
              notifMessage={`${errorLeaveDetails}: Failed to load Leave Details.`}
            />
          </>
        ) : null}

        {/* Individual Leave Details Load Failed Error ONGOING MODAL */}
        {!isEmpty(errorLeaveDetails) && pendingLeaveModalIsOpen ? (
          <>
            <ToastNotification
              toastType="error"
              notifMessage={`${errorLeaveDetails}: Failed to load Leave Details.`}
            />
          </>
        ) : null}

        {/* Unavailable Calendar Dates Load Failed Error */}
        {!isEmpty(errorUnavailableDates) ? (
          <>
            <ToastNotification
              toastType="error"
              notifMessage={`${errorUnavailableDates}: Failed to load Holiday and Leave dates in calendar.`}
            />
          </>
        ) : null}

        {/* Leave List Load Failed Error */}
        {!isEmpty(errorLeaves) ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorLeaves}: Failed to load Leave List.`}
          />
        ) : null}

        {/* Leave Types Selection Load Failed Error */}
        {!isEmpty(errorLeaveTypes) ? (
          <>
            <ToastNotification
              toastType="error"
              notifMessage={`${errorLeaveTypes}: Failed to load Leave Types.`}
            />
          </>
        ) : null}

        {/* Post/Submit Leave Error*/}
        {!isEmpty(errorResponse) ? (
          <>
            <ToastNotification
              toastType="error"
              notifMessage={`${errorResponse}: Failed to Submit.`}
            />
          </>
        ) : null}

        {/* Post/Submit Leave Success*/}
        {!isEmpty(responseApply) ? (
          <ToastNotification
            toastType="success"
            notifMessage="Leave Application Successful! Please wait for supervisor's decision on this application."
          />
        ) : null}
      </>

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Leaves</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

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
          <div className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="Employee Leaves"
              subtitle="Apply for company leave"
            >
              <Button
                onClick={openApplyLeaveModal}
                className="hidden lg:block"
                size={`md`}
              >
                <div className="flex items-center w-full gap-2">
                  <HiDocumentAdd /> Apply for Leave
                </div>
              </Button>

              <Button
                onClick={openApplyLeaveModal}
                className="block lg:hidden"
                size={`lg`}
              >
                <div className="flex items-center w-full gap-2">
                  <HiDocumentAdd />
                </div>
              </Button>
            </ContentHeader>
            {loading ? (
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="flex w-full h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            ) : (
              <ContentBody>
                <>
                  <div className={`w-full flex lg:flex-row flex-col`}>
                    <div className={`lg:w-[58rem] w-full`}>
                      <LeavesTabs tab={tab} />
                    </div>
                    <div className="w-full">
                      <LeavesTabWindow />
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
