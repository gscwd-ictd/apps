import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiDocumentAdd } from 'react-icons/hi';
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
import { Button, ToastNotification } from '@gscwd-apps/oneui';
import { employeeDummy } from '../../../../src/types/employee.type';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { OvertimeApplicationModal } from 'apps/portal/src/components/fixed/overtime/OvertimeApplicationModal';
import OvertimeModal from 'apps/portal/src/components/fixed/overtime/OvertimeModal';
import { OvertimeTabs } from 'apps/portal/src/components/fixed/overtime/OvertimeTabs';
import { OvertimeTabWindow } from 'apps/portal/src/components/fixed/overtime/OvertimeTabWindow';
import { useRouter } from 'next/router';

export default function Overtime({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    applyOvertimeModalIsOpen,
    pendingOvertimeModalIsOpen,
    completedOvertimeModalIsOpen,
    overtimeList,
    employeeList,
    responseApply,

    setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen,
    setApplyOvertimeModalIsOpen,
    setOvertimeDetails,
    getEmployeeList,
    getEmployeeListSuccess,
    getEmployeeListFail,
    getOvertimeList,
    getOvertimeListSuccess,
    getOvertimeListFail,
    emptyResponseAndError,
  } = useOvertimeStore((state) => ({
    tab: state.tab,
    applyOvertimeModalIsOpen: state.applyOvertimeModalIsOpen,
    pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
    completedOvertimeModalIsOpen: state.completedOvertimeModalIsOpen,
    overtimeList: state.overtime,
    employeeList: state.employeeList,
    responseApply: state.response.postResponseApply,

    setOvertimeDetails: state.setOvertimeDetails,
    setPendingOvertimeModalIsOpen: state.setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen: state.setCompletedOvertimeModalIsOpen,
    setApplyOvertimeModalIsOpen: state.setApplyOvertimeModalIsOpen,

    getEmployeeList: state.getEmployeeList,
    getEmployeeListSuccess: state.getEmployeeListSuccess,
    getEmployeeListFail: state.getEmployeeListFail,
    getOvertimeList: state.getOvertimeList,
    getOvertimeListSuccess: state.getOvertimeListSuccess,
    getOvertimeListFail: state.getOvertimeListFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const router = useRouter();

  const openApplyOvertimeModal = () => {
    if (!applyOvertimeModalIsOpen) {
      setApplyOvertimeModalIsOpen(true);
    }
  };

  // cancel action for Overtime Application Modal
  const closeApplyOvertimeModal = async () => {
    setApplyOvertimeModalIsOpen(false);
  };

  // cancel action for Overtime Pending Modal
  const closePendingOvertimeModal = async () => {
    setPendingOvertimeModalIsOpen(false);
  };

  // cancel action for Overtime Completed Modal
  const closeCompletedOvertimeModal = async () => {
    setCompletedOvertimeModalIsOpen(false);
  };

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

  const employeeListUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/supervisor/${employeeDetails.employmentDetails.userId}/employees/`;

  const {
    data: swrEmployeeList,
    isLoading: swrEmployeeListIsLoading,
    error: swrEmployeeListError,
    mutate: mutateEmployeeList,
  } = useSWR(employeeListUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrEmployeeListIsLoading) {
      getEmployeeList(swrEmployeeListIsLoading);
    }
  }, [swrEmployeeListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrEmployeeList)) {
      getEmployeeListSuccess(swrEmployeeListIsLoading, swrEmployeeList);
    }

    if (!isEmpty(swrEmployeeListError)) {
      getEmployeeListFail(swrEmployeeListIsLoading, swrEmployeeListError.message);
    }
  }, [swrEmployeeList, swrEmployeeListError]);

  const overtimeListUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${employeeDetails.employmentDetails.overtimeImmediateSupervisorId}`;

  const {
    data: swrOvertimeList,
    isLoading: swrOvertimeListIsLoading,
    error: swrOvertimeListError,
    mutate: mutateOvertimeList,
  } = useSWR(overtimeListUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeListIsLoading) {
      getOvertimeList(swrOvertimeListIsLoading);
    }
  }, [swrOvertimeListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeList)) {
      getOvertimeListSuccess(swrOvertimeListIsLoading, swrOvertimeList);
    }

    if (!isEmpty(swrOvertimeListError)) {
      getOvertimeListFail(swrOvertimeListIsLoading, swrOvertimeListError.message);
    }
  }, [swrOvertimeList, swrOvertimeListError]);

  useEffect(() => {
    if (!isEmpty(responseApply)) {
      mutateOvertimeList();
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    }
  }, [responseApply]);

  return (
    <>
      <>
        {/* Employee List Load Failed */}
        {!isEmpty(swrEmployeeListError) ? (
          <>
            <ToastNotification
              toastType="error"
              notifMessage={`${swrEmployeeListError}: Failed to load Employee List.`}
            />
          </>
        ) : null}

        {/* Post/Submit Overtime Application Success*/}
        {!isEmpty(responseApply) ? (
          <ToastNotification toastType="success" notifMessage="Overtime Application Successful!" />
        ) : null}

        {/* List of Overtime Load Failed */}
        {!isEmpty(swrOvertimeListError) ? (
          <>
            <ToastNotification
              toastType="error"
              notifMessage={`${swrOvertimeListError}: Failed to load Overtime List.`}
            />
          </>
        ) : null}
      </>

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Overtime</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        {/* Overtime Application Modal */}
        <OvertimeApplicationModal
          modalState={applyOvertimeModalIsOpen}
          setModalState={setApplyOvertimeModalIsOpen}
          closeModalAction={closeApplyOvertimeModal}
        />

        {/* Overtime Pending Modal */}
        <OvertimeModal
          modalState={pendingOvertimeModalIsOpen}
          setModalState={setPendingOvertimeModalIsOpen}
          closeModalAction={closePendingOvertimeModal}
        />

        {/* Overtime Completed Modal */}
        <OvertimeModal
          modalState={completedOvertimeModalIsOpen}
          setModalState={setCompletedOvertimeModalIsOpen}
          closeModalAction={closeCompletedOvertimeModal}
        />

        <MainContainer>
          <div className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader title="Employee Overtime" subtitle="Apply for overtime" backUrl={`/${router.query.id}`}>
              <Button onClick={openApplyOvertimeModal} className="hidden lg:block" size={`md`}>
                <div className="flex items-center w-full gap-2">
                  <HiDocumentAdd /> Apply for Overtime
                </div>
              </Button>

              <Button onClick={openApplyOvertimeModal} className="block lg:hidden" size={`lg`}>
                <div className="flex items-center w-full gap-2">
                  <HiDocumentAdd />
                </div>
              </Button>
            </ContentHeader>
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
                      <OvertimeTabs tab={tab} />
                    </div>
                    <div className="w-full">
                      <OvertimeTabWindow />
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
