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
import { ListDef, LoadingSpinner, Select, ToastNotification } from '@gscwd-apps/oneui';
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
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
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
    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,
    setSelectedMonth: state.setSelectedMonth,
    setSelectedYear: state.setSelectedYear,
    setPendingOvertimeAccomplishmentModalIsOpen: state.setPendingOvertimeAccomplishmentModalIsOpen,
    setCompletedOvertimeAccomplishmentModalIsOpen: state.setCompletedOvertimeAccomplishmentModalIsOpen,
    emptyResponseAndError: state.emptyResponseAndError,
    getOvertimeAccomplishmentList: state.getOvertimeAccomplishmentList,
    getOvertimeAccomplishmentListSuccess: state.getOvertimeAccomplishmentListSuccess,
    getOvertimeAccomplishmentListFail: state.getOvertimeAccomplishmentListFail,
  }));

  const { getTimeLogs, getTimeLogsSuccess, getTimeLogsFail, errorTimeLogs } = useTimeLogStore((state) => ({
    getTimeLogs: state.getTimeLogs,
    getTimeLogsSuccess: state.getTimeLogsSuccess,
    getTimeLogsFail: state.getTimeLogsFail,
    errorTimeLogs: state.error.errorTimeLogs,
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

  type Month = { month: string; code: string };
  type Year = { year: string };

  const monthNow = format(new Date(), 'M');
  const yearNow = format(new Date(), 'yyyy');

  const months = [
    { month: 'January', code: '01' },
    { month: 'February', code: '02' },
    { month: 'March', code: '03' },
    { month: 'April', code: '04' },
    { month: 'May', code: '05' },
    { month: 'June', code: '06' },
    { month: 'July', code: '07' },
    { month: 'August', code: '08' },
    { month: 'September', code: '09' },
    { month: 'October', code: '10' },
    { month: 'November', code: '11' },
    { month: 'December', code: '12' },
  ] as Month[];

  const years = [{ year: `${yearNow}` }, { year: `${Number(yearNow) - 1}` }] as Year[];

  //month select
  const list: ListDef<Month> = {
    key: 'month',
    render: (info, state) => (
      <div className={`${state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200' : ''} pl-2 cursor-pointer`}>
        {info.month}
      </div>
    ),
  };

  //year select
  const yearList: ListDef<Year> = {
    key: 'year',
    render: (info, state) => (
      <div className={`${state.active ? 'bg-indigo-200' : state.selected ? 'bg-slate-200 ' : ''} pl-4 cursor-pointer`}>
        {info.year}
      </div>
    ),
  };

  const onChangeMonth = (month: string) => {
    setSelectedMonth(month);
  };

  const onChangeYear = (year: string) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    setSelectedYear(format(new Date(), 'yyyy'));
    setSelectedMonth(format(new Date(), 'M'));
  }, []);

  const overtimeAccomplishmentUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/employees/${employeeDetails.employmentDetails.userId}/accomplishments/`;

  const {
    data: swrOvertimeAccomplishmentList,
    isLoading: swrOvertimeAccomplishmentListIsLoading,
    error: swrOvertimeAccomplishmentListError,
    mutate: mutateOvertimeAccomplishments,
  } = useSWR(employeeDetails.employmentDetails.userId ? overtimeAccomplishmentUrl : null, fetchWithToken, {});

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
      {!isEmpty(errorTimeLogs) ? (
        <ToastNotification toastType="error" notifMessage={`Face Scans: ${errorTimeLogs}.`} />
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
            >
              <div className="flex flex-row justify-end gap-2">
                {/* <Select
                  className="w-36 md:w-40"
                  data={months}
                  initial={months[Number(monthNow) - 1]}
                  listDef={list}
                  onSelect={(selectedItem) => onChangeMonth(selectedItem.code)}
                />
                <Select
                  className="w-36 md:w-28"
                  data={years}
                  initial={years[0]}
                  listDef={yearList}
                  onSelect={(selectedItem) => onChangeYear(selectedItem.year)}
                /> */}
              </div>
            </ContentHeader>
            {swrOvertimeAccomplishmentListIsLoading ? (
              <div className="w-full h-96 static flex flex-col justify-center items-center place-items-center">
                <LoadingSpinner size={'lg'} />
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
});
