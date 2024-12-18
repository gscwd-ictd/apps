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
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { format } from 'date-fns';
import useSWR from 'swr';
import { DtrDateSelect } from '../../../components/fixed/dtr/DtrDateSelect';
import { useDtrStore } from '../../../store/dtr.store';
import { DtrTable } from '../../../components/fixed/dtr/DtrTable';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';

export default function DailyTimeRecord({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    isErrorDtr,
    isErrorDtrPdf,
    isLoadingDtr,
    errorUpdateEmployeeDtr,
    responseUpdateDtr,
    getEmployeeDtr,
    getEmployeeDtrSuccess,
    getEmployeeDtrFail,
    selectedMonth,
    selectedYear,
    emptyResponseAndError,
  } = useDtrStore((state) => ({
    isErrorDtr: state.error.errorDtr,
    isErrorDtrPdf: state.error.errorDtrPdf,
    isLoadingDtr: state.loading.loadingDtr,
    errorUpdateEmployeeDtr: state.error.errorUpdateEmployeeDtr,
    responseUpdateDtr: state.response.employeeDailyRecord,
    getEmployeeDtr: state.getEmployeeDtr,
    getEmployeeDtrSuccess: state.getEmployeeDtrSuccess,
    getEmployeeDtrFail: state.getEmployeeDtrFail,
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const monthNow = format(new Date(), 'M');
  const yearNow = format(new Date(), 'yyyy');
  const dtrUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${employeeDetails.employmentDetails.companyId}/${selectedYear}/${selectedMonth}`;
  const dtrUrlDefault = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${employeeDetails.employmentDetails.companyId}/${yearNow}/${monthNow}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrDtr,
    isLoading: swrDtrIsLoading,
    error: swrDtrError,
    mutate: mutateDtrUrl,
  } = useSWR(
    employeeDetails.employmentDetails.companyId && selectedYear && selectedMonth
      ? dtrUrl
      : employeeDetails.employmentDetails.companyId
      ? dtrUrlDefault
      : null,
    fetchWithToken,
    {}
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrDtrIsLoading) {
      getEmployeeDtr(swrDtrIsLoading);
    }
  }, [swrDtrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrDtr)) {
      getEmployeeDtrSuccess(swrDtrIsLoading, swrDtr);
    }

    if (!isEmpty(swrDtrError)) {
      getEmployeeDtrFail(swrDtrIsLoading, swrDtrError.message);
    }
  }, [swrDtr, swrDtrError]);

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);

  const router = useRouter();

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails, setEmployeeDetails]);

  useEffect(() => {
    mutateDtrUrl();
  }, [responseUpdateDtr]);

  useEffect(() => {
    if (!isEmpty(responseUpdateDtr) || !isEmpty(errorUpdateEmployeeDtr)) {
      mutateDtrUrl();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [responseUpdateDtr, errorUpdateEmployeeDtr]);

  const [navDetails, setNavDetails] = useState<NavButtonDetails>();

  useEffect(() => {
    setNavDetails({
      profile: employeeDetails.user.email,
      fullName: `${employeeDetails.profile.firstName} ${employeeDetails.profile.lastName}`,
      initials: UseNameInitials(employeeDetails.profile.firstName, employeeDetails.profile.lastName),
    });
  }, []);

  return (
    <>
      <>
        {/* DTR Full Period (web view and pdf) Fetch Error */}
        {!isEmpty(isErrorDtr) ? (
          <ToastNotification toastType="error" notifMessage={`${isErrorDtr}: Failed to load DTR.`} />
        ) : null}

        {/* DTR PDF (1st/2nd period only) Fetch Error */}
        {!isEmpty(isErrorDtrPdf) ? (
          <ToastNotification toastType="error" notifMessage={`${isErrorDtrPdf}: Failed to load DTR.`} />
        ) : null}

        {!isEmpty(errorUpdateEmployeeDtr) ? (
          <>
            <ToastNotification
              toastType="error"
              notifMessage={`${errorUpdateEmployeeDtr}: Failed to submit Time Log Correction request.`}
            />
          </>
        ) : null}

        {!isEmpty(responseUpdateDtr) ? (
          <>
            <ToastNotification
              toastType="success"
              notifMessage={`Time Log Correction request submitted successfully.`}
            />
          </>
        ) : null}

        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Daily Time Record</title>
          </Head>

          <SideNav employeeDetails={employeeDetails} />

          <MainContainer>
            <div className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
              <ContentHeader
                title="Daily Time Record"
                subtitle="View schedules, time in and time out"
                backUrl={`/${router.query.id}`}
              >
                <DtrDateSelect employeeDetails={employeeDetails} />
              </ContentHeader>

              <ContentBody>
                {isLoadingDtr ? (
                  <div className="w-full h-96  static flex flex-col justify-center items-center place-items-center">
                    <LoadingSpinner size={'lg'} />
                    {/* <SpinnerDotted
                      speed={70}
                      thickness={70}
                      className="flex w-full h-full transition-all "
                      color="slateblue"
                      size={100}
                    /> */}
                  </div>
                ) : (
                  <div className="pb-10">
                    <DtrTable employeeDetails={employeeDetails} />
                  </div>
                )}
              </ContentBody>
            </div>
          </MainContainer>
        </EmployeeProvider>
      </>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  return { props: { employeeDetails } };
});
