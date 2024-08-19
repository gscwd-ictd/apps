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
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { OvertimeAccomplishmentTabs } from 'apps/portal/src/components/fixed/overtime-accomplishment/OvertimeAccomplishmentTabs';
import { OvertimeAccomplishmentTabWindow } from 'apps/portal/src/components/fixed/overtime-accomplishment/OvertimeAccomplishmentTabWindow';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import OvertimeAccomplishmentModal from 'apps/portal/src/components/fixed/overtime-accomplishment/OvertimeAccomplishmentModal';
import { useRouter } from 'next/router';
import { useTimeLogStore } from 'apps/portal/src/store/timelogs.store';
import { format } from 'date-fns';
import { UserRole } from 'libs/utils/src/lib/enums/user-roles.enum';

export default function OvertimeAccomplishment({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    pendingOvertimeAccomplishmentModalIsOpen,
    completedOvertimeAccomplishmentModalIsOpen,
    patchResponse,
    errorResponse,
    errorOvertimeAccomplishment,
    setPendingOvertimeAccomplishmentModalIsOpen,
    setCompletedOvertimeAccomplishmentModalIsOpen,
    emptyResponseAndError,
    getOvertimeAccomplishmentList,
    getOvertimeAccomplishmentListSuccess,
    getOvertimeAccomplishmentListFail,
  } = useOvertimeAccomplishmentStore((state) => ({
    tab: state.tab,
    pendingOvertimeAccomplishmentModalIsOpen: state.pendingOvertimeAccomplishmentModalIsOpen,
    completedOvertimeAccomplishmentModalIsOpen: state.completedOvertimeAccomplishmentModalIsOpen,
    patchResponse: state.response.patchResponse,
    errorResponse: state.error.errorResponse,
    errorOvertimeAccomplishment: state.error.errorOvertimeAccomplishment,
    setPendingOvertimeAccomplishmentModalIsOpen: state.setPendingOvertimeAccomplishmentModalIsOpen,
    setCompletedOvertimeAccomplishmentModalIsOpen: state.setCompletedOvertimeAccomplishmentModalIsOpen,
    emptyResponseAndError: state.emptyResponseAndError,
    getOvertimeAccomplishmentList: state.getOvertimeAccomplishmentList,
    getOvertimeAccomplishmentListSuccess: state.getOvertimeAccomplishmentListSuccess,
    getOvertimeAccomplishmentListFail: state.getOvertimeAccomplishmentListFail,
  }));

  const { getTimeLogs, getTimeLogsSuccess, getTimeLogsFail } = useTimeLogStore((state) => ({
    getTimeLogs: state.getTimeLogs,
    getTimeLogsSuccess: state.getTimeLogsSuccess,
    getTimeLogsFail: state.getTimeLogsFail,
  }));

  const router = useRouter();

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

  const faceScanUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${
    employeeDetails.employmentDetails.companyId
  }/${format(new Date(), 'yyyy-MM-dd')}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrFaceScan,
    isLoading: swrFaceScanIsLoading,
    error: swrFaceScanError,
    mutate: mutateFaceScanUrl,
  } = useSWR(employeeDetails.employmentDetails.companyId ? faceScanUrl : null, fetchWithToken);

  // Initial zustand state update
  useEffect(() => {
    if (swrFaceScanIsLoading) {
      getTimeLogs(swrFaceScanIsLoading);
    }
  }, [swrFaceScanIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrFaceScan)) {
      getTimeLogsSuccess(swrFaceScanIsLoading, swrFaceScan);
    }

    if (!isEmpty(swrFaceScanError)) {
      getTimeLogsFail(swrFaceScanIsLoading, swrFaceScanError.message);
    }
  }, [swrFaceScan, swrFaceScanError]);

  const overtimeAccomplishmentUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/employees/${employeeDetails.employmentDetails.userId}/accomplishments/`;

  const {
    data: swrOvertimeAccomplishmentList,
    isLoading: swrOvertimeAccomplishmentListIsLoading,
    error: swrOvertimeAccomplishmentListError,
    mutate: mutateOvertimeAccomplishments,
  } = useSWR(employeeDetails.employmentDetails.userId ? overtimeAccomplishmentUrl : null, fetchWithToken);

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeAccomplishmentListIsLoading) {
      getOvertimeAccomplishmentList(swrOvertimeAccomplishmentListIsLoading);
    }
  }, [swrOvertimeAccomplishmentListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeAccomplishmentList)) {
      getOvertimeAccomplishmentListSuccess(swrOvertimeAccomplishmentListIsLoading, swrOvertimeAccomplishmentList);
    }
    if (!isEmpty(swrOvertimeAccomplishmentListError)) {
      getOvertimeAccomplishmentListFail(
        swrOvertimeAccomplishmentListIsLoading,
        swrOvertimeAccomplishmentListError.message
      );
    }
  }, [swrOvertimeAccomplishmentList, swrOvertimeAccomplishmentListError]);

  useEffect(() => {
    if (!isEmpty(patchResponse)) {
      mutateOvertimeAccomplishments();
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    }
  }, [patchResponse]);

  return (
    <>
      {!isEmpty(swrFaceScanError) ? (
        <ToastNotification toastType="error" notifMessage={`Face Scans: ${swrFaceScanError.message}.`} />
      ) : null}

      {/* Overtime Accomplishment List Load Faled */}
      {!isEmpty(errorOvertimeAccomplishment) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorOvertimeAccomplishment}: Failed to load Overtime Accomplishment List.`}
        />
      ) : null}

      {/* Submit Accomplishment Error*/}
      {!isEmpty(errorResponse) ? (
        <ToastNotification toastType="error" notifMessage={`${errorResponse}: Failed to Submit.`} />
      ) : null}

      {/* Submit Accomplishment Success*/}
      {!isEmpty(patchResponse) ? (
        <ToastNotification toastType="success" notifMessage="Overtime Accomplishment Submitted!" />
      ) : null}

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
          <div className={`w-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="Employee Overtime Accomplishment"
              subtitle="Fill up Overtime Accomplishment Reports"
              backUrl={`/${router.query.id}`}
            ></ContentHeader>
            {swrOvertimeAccomplishmentListIsLoading ? (
              <div className="w-full h-96 static flex flex-col justify-items-center items-center place-items-center">
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

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  return { props: { employeeDetails } };

  // check if user role is COS/COS_JO
  // if (
  //   employeeDetails.employmentDetails.userRole === UserRole.COS ||
  //   employeeDetails.employmentDetails.userRole === UserRole.COS_JO
  // ) {
  //   // if true, the employee is not allowed to access this page
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: `/${employeeDetails.user._id}`,
  //     },
  //   };
  // } else {
  //   return { props: { employeeDetails } };
  // }
});
