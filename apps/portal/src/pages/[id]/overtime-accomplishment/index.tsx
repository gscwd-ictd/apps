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
import { ToastNotification } from '@gscwd-apps/oneui';
import { employeeDummy } from '../../../../src/types/employee.type';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { OvertimeApplicationModal } from 'apps/portal/src/components/fixed/overtime/OvertimeApplicationModal';
import { OvertimeAccomplishmentTabs } from 'apps/portal/src/components/fixed/overtime-accomplishment/OvertimeAccomplishmentTabs';
import { OvertimeAccomplishmentTabWindow } from 'apps/portal/src/components/fixed/overtime-accomplishment/OvertimeAccomplishmentTabWindow';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import OvertimeAccomplishmentModal from 'apps/portal/src/components/fixed/overtime-accomplishment/OvertimeAccomplishmentModal';

export default function OvertimeAccomplishment({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,

    pendingOvertimeAccomplishmentModalIsOpen,
    completedOvertimeAccomplishmentModalIsOpen,
    overtimeList,
    responseApply,

    setPendingOvertimeAccomplishmentModalIsOpen,
    setCompletedOvertimeAccomplishmentModalIsOpen,
    setOvertimeDetails,
    emptyResponseAndError,
  } = useOvertimeAccomplishmentStore((state) => ({
    tab: state.tab,

    pendingOvertimeAccomplishmentModalIsOpen: state.pendingOvertimeAccomplishmentModalIsOpen,
    completedOvertimeAccomplishmentModalIsOpen: state.completedOvertimeAccomplishmentModalIsOpen,
    overtimeList: state.overtime,

    responseApply: state.response.postResponseApply,

    setOvertimeDetails: state.setOvertimeDetails,
    setPendingOvertimeAccomplishmentModalIsOpen: state.setPendingOvertimeAccomplishmentModalIsOpen,
    setCompletedOvertimeAccomplishmentModalIsOpen: state.setCompletedOvertimeAccomplishmentModalIsOpen,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  // cancel action for Overtime Pending Modal
  const closePendingOvertimeAccomplishmentModal = async () => {
    setPendingOvertimeAccomplishmentModalIsOpen(false);
  };

  // cancel action for Overtime Completed Modal
  const closeCompletedOvertimeAccomplishmentModal = async () => {
    setCompletedOvertimeAccomplishmentModalIsOpen(false);
  };

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

  // const employeeListUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/supervisor/${employeeDetails.employmentDetails.userId}/employees/`;

  // const {
  //   data: swrEmployeeList,
  //   isLoading: swrEmployeeListIsLoading,
  //   error: swrEmployeeListError,
  //   mutate: mutateLeaves,
  // } = useSWR(employeeListUrl, fetchWithToken, {
  //   shouldRetryOnError: false,
  //   revalidateOnFocus: false,
  // });

  // // Initial zustand state update
  // useEffect(() => {
  //   if (swrEmployeeListIsLoading) {
  //     getEmployeeList(swrEmployeeListIsLoading);
  //   }
  // }, [swrEmployeeListIsLoading]);

  // // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrEmployeeList)) {
  //     getEmployeeListSuccess(swrEmployeeListIsLoading, swrEmployeeList);
  //   }

  //   if (!isEmpty(swrEmployeeListError)) {
  //     getEmployeeListFail(swrEmployeeListIsLoading, swrEmployeeListError.message);
  //   }
  // }, [swrEmployeeList, swrEmployeeListError]);

  // useEffect(() => {
  //   if (!isEmpty(responseApply)) {
  //     mutateLeaves();
  //     setTimeout(() => {
  //       emptyResponseAndError();
  //     }, 3000);
  //   }
  // }, [responseApply]);

  return (
    <>
      <>
        {/* Individual Leave Details Load Failed Error COMPLETED MODAL */}
        {/* {!isEmpty(errorLeaveDetails) && completedLeaveModalIsOpen ? (
          <>
            <ToastNotification toastType="error" notifMessage={`${errorLeaveDetails}: Failed to load Leave Details.`} />
          </>
        ) : null} */}

        {/* Individual Leave Details Load Failed Error ONGOING MODAL */}
        {/* {!isEmpty(errorLeaveDetails) && pendingLeaveModalIsOpen ? (
          <>
            <ToastNotification toastType="error" notifMessage={`${errorLeaveDetails}: Failed to load Leave Details.`} />
          </>
        ) : null} */}

        {/* Post/Submit Leave Error*/}
        {/* {!isEmpty(errorResponse) ? (
          <>
            <ToastNotification toastType="error" notifMessage={`${errorResponse}: Failed to Submit.`} />
          </>
        ) : null} */}

        {/* Post/Submit Leave Success*/}
        {/* {!isEmpty(responseApply) ? (
          <ToastNotification toastType="success" notifMessage="Leave Application Successful!" />
        ) : null} */}

        {/* Patch Cancel Leave Successs*/}
        {/* {!isEmpty(responseCancel) ? (
          <ToastNotification toastType="success" notifMessage="Leave Cancellation Successful!" />
        ) : null} */}
      </>

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Overtime Accomplishment</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        {/* Overtime Pending Accomplishment Modal */}
        <OvertimeAccomplishmentModal
          modalState={pendingOvertimeAccomplishmentModalIsOpen}
          setModalState={setPendingOvertimeAccomplishmentModalIsOpen}
          closeModalAction={closePendingOvertimeAccomplishmentModal}
        />

        {/* Overtime Completed Accomplishment Modal */}
        <OvertimeAccomplishmentModal
          modalState={completedOvertimeAccomplishmentModalIsOpen}
          setModalState={setCompletedOvertimeAccomplishmentModalIsOpen}
          closeModalAction={closeCompletedOvertimeAccomplishmentModal}
        />

        <MainContainer>
          <div className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="Employee Overtime Accomplishment"
              subtitle="Fill up Overtime Accomplishment Reports"
            ></ContentHeader>
            {!overtimeList ? (
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
                      <OvertimeAccomplishmentTabs tab={tab} />
                    </div>
                    <div className="w-full">
                      <OvertimeAccomplishmentTabWindow />
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

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  return { props: { employeeDetails } };
});
