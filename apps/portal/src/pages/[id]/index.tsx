/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @nx/enforce-module-boundaries */
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import SideNav from '../../components/fixed/nav/SideNav';
import { MainContainer } from '../../components/modular/custom/containers/MainContainer';
import { useAllowedModulesStore } from '../../store/allowed-modules.store';
import { getUserDetails, withCookieSession } from '../../utils/helpers/session';
import { useEmployeeStore } from '../../store/employee.store';
import { EmployeeDashboard } from '../../components/fixed/dashboard/EmployeeDashboard';
import { setModules } from '../../utils/helpers/modules';
import Carousel from '../../components/fixed/home/carousel/Carousel';
import Image from 'next/image';
import EmployeeCalendar from '../../components/fixed/home/calendar/Calendar';
import { ProfileCard } from '../../components/fixed/home/profile/ProfileCard';
import { RemindersCard } from '../../components/fixed/home/reminders/RemindersCard';
import { AttendanceCard } from '../../components/fixed/home/attendance/AttendanceCard';
import { StatsCard } from '../../components/fixed/home/stats/StatsCard';
import { fetchWithToken } from '../../utils/hoc/fetcher';
import useSWR from 'swr';
import { format } from 'date-fns';
import { ToastNotification } from '@gscwd-apps/oneui';
import { isEmpty } from 'lodash';
import { useTimeLogStore } from '../../store/timelogs.store';
import { useDtrStore } from '../../store/dtr.store';
import { HiCalendar, HiCash, HiClock, HiDocument } from 'react-icons/hi';
import { useLeaveLedgerStore } from '../../store/leave-ledger.store';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import LeaveCreditMonetizationCalculatorModal from '../../components/fixed/leave-credit-monetization-calculator/LeaveCreditMonetizationCalculatorModal';
import { useLeaveMonetizationCalculatorStore } from '../../store/leave-monetization-calculator.store';
import dayjs from 'dayjs';
import { usePassSlipStore } from '../../store/passslip.store';

export type NavDetails = {
  fullName: string;
  initials: string;
  profile: string;
};

export default function Dashboard({ userDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const setAllowedModules = useAllowedModulesStore((state) => state.setAllowedModules);
  const setEmployee = useEmployeeStore((state) => state.setEmployeeDetails);
  const employee = useEmployeeStore((state) => state.employeeDetails);

  const employeeName = `${userDetails?.profile?.firstName} ${userDetails?.profile?.lastName}`;
  const sgAmount = userDetails?.employmentDetails?.salaryGradeAmount;
  const sgIncrement = userDetails?.employmentDetails?.salaryGrade;

  const [leaveCreditMultiplier, setLeaveCreditMultiplier] = useState<number>(0.0481927);
  const [leaveCredits, setLeaveCredits] = useState<number>(0);
  const [estimatedAmount, setEstimatedAmount] = useState<number>(0);

  const {
    leaveCalculatorModalIsOpen,
    setLeaveCalculatorModalIsOpen,
    monetizationConstant,
    errorMonetizationConstant,
    getMonetizationConstant,
    getMonetizationConstantSuccess,
    getMonetizationConstantFail,
  } = useLeaveMonetizationCalculatorStore((state) => ({
    leaveCalculatorModalIsOpen: state.leaveCalculatorModalIsOpen,
    setLeaveCalculatorModalIsOpen: state.setLeaveCalculatorModalIsOpen,
    monetizationConstant: state.monetizationConstant,
    errorMonetizationConstant: state.error.errorMonetizationConstant,
    getMonetizationConstant: state.getMonetizationConstant,
    getMonetizationConstantSuccess: state.getMonetizationConstantSuccess,
    getMonetizationConstantFail: state.getMonetizationConstantFail,
  }));

  const { dtr, schedule, loadingTimeLogs, errorTimeLogs, getTimeLogs, getTimeLogsSuccess, getTimeLogsFail } =
    useTimeLogStore((state) => ({
      dtr: state.dtr,
      schedule: state.schedule,
      loadingTimeLogs: state.loading.loadingTimeLogs,
      errorTimeLogs: state.error.errorTimeLogs,
      getTimeLogs: state.getTimeLogs,
      getTimeLogsSuccess: state.getTimeLogsSuccess,
      getTimeLogsFail: state.getTimeLogsFail,
    }));

  const { getEmployeeDtr, getEmployeeDtrSuccess, getEmployeeDtrFail, setSelectedYear, setSelectedMonth } = useDtrStore(
    (state) => ({
      getEmployeeDtr: state.getEmployeeDtr,
      getEmployeeDtrSuccess: state.getEmployeeDtrSuccess,
      getEmployeeDtrFail: state.getEmployeeDtrFail,
      setSelectedYear: state.setSelectedYear,
      setSelectedMonth: state.setSelectedMonth,
    })
  );

  const { getPassSlipCount, getPassSlipCountSuccess, getPassSlipCountFail } = usePassSlipStore((state) => ({
    getPassSlipCount: state.getPassSlipCount,
    getPassSlipCountSuccess: state.getPassSlipCountSuccess,
    getPassSlipCountFail: state.getPassSlipCountFail,
  }));

  const { errorLedger, getLeaveLedger, getLeaveLedgerSuccess, getLeaveLedgerFail } = useLeaveLedgerStore((state) => ({
    errorLedger: state.error.errorLeaveLedger,
    getLeaveLedger: state.getLeaveLedger,
    getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
    getLeaveLedgerFail: state.getLeaveLedgerFail,
  }));

  const [forcedLeaveBalance, setForcedLeaveBalance] = useState<number>(0);
  const [vacationLeaveBalance, setVacationLeaveBalance] = useState<number>(0);
  const [sickLeaveBalance, setSickLeaveBalance] = useState<number>(0);
  const [specialPrivilegeLeaveBalance, setSpecialPrivilegeLeaveBalance] = useState<number>(0);

  async function hydration() {
    if (schedule && userDetails) {
      const modules = await setModules(userDetails, schedule);
      setAllowedModules(modules);
      console.log(userDetails);
    }
  }

  // get the latest balance by last index value
  const getLatestBalance = (leaveLedger: Array<LeaveLedgerEntry>) => {
    const lastIndexValue = leaveLedger[leaveLedger.length - 1];
    setForcedLeaveBalance(lastIndexValue.forcedLeaveBalance);
    setVacationLeaveBalance(lastIndexValue.vacationLeaveBalance ?? 0);
    setSickLeaveBalance(lastIndexValue.sickLeaveBalance ?? 0);
    setSpecialPrivilegeLeaveBalance(lastIndexValue.specialPrivilegeLeaveBalance ?? 0);
  };

  //fetch leave monetization settings (monetization constant)
  const leaveMonetizationUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/ems-settings/monetization`;

  const {
    data: swrLeaveMonetization,
    isLoading: swrLeaveMonetizationLoading,
    error: swrLeaveMonetizationError,
  } = useSWR(leaveMonetizationUrl, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrLeaveMonetizationLoading) {
      getMonetizationConstant(swrLeaveMonetizationLoading);
    }
  }, [swrLeaveMonetizationLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveMonetization)) {
      getMonetizationConstantSuccess(swrLeaveMonetizationLoading, swrLeaveMonetization);
    }

    if (!isEmpty(swrLeaveMonetizationError)) {
      getMonetizationConstantFail(swrLeaveMonetizationLoading, swrLeaveMonetizationError.message);
    }
  }, [swrLeaveMonetization, swrLeaveMonetizationError]);

  //fetch employee leave ledger
  const leaveLedgerUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/ledger/${userDetails.user._id}/${userDetails.profile.companyId}`;

  const {
    data: swrLeaveLedger,
    isLoading: swrLeaveLedgerLoading,
    error: swrLeaveLedgerError,
  } = useSWR(userDetails.user._id && userDetails.profile.companyId ? leaveLedgerUrl : null, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrLeaveLedgerLoading) {
      getLeaveLedger(swrLeaveLedgerLoading);
    }
  }, [swrLeaveLedgerLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveLedger)) {
      getLeaveLedgerSuccess(swrLeaveLedgerLoading, swrLeaveLedger);
      getLatestBalance(swrLeaveLedger);
    }

    if (!isEmpty(swrLeaveLedgerError)) {
      getLeaveLedgerFail(swrLeaveLedgerLoading, swrLeaveLedgerError.message);
    }
  }, [swrLeaveLedger, swrLeaveLedgerError]);

  const faceScanUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${
    userDetails.employmentDetails.companyId
  }/${format(new Date(), 'yyyy-MM-dd')}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrFaceScan,
    isLoading: swrFaceScanIsLoading,
    error: swrFaceScanError,
    mutate: mutateFaceScanUrl,
  } = useSWR(userDetails.employmentDetails.companyId ? faceScanUrl : null, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: true,
  });

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

  const monthNow = format(new Date(), 'M');
  const yearNow = format(new Date(), 'yyyy');

  const dtrUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${userDetails.employmentDetails.companyId}/${yearNow}/${monthNow}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrDtr,
    isLoading: swrDtrIsLoading,
    error: swrDtrError,
    mutate: mutateDtrUrl,
  } = useSWR(userDetails.employmentDetails.companyId ? dtrUrl : null, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: true,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrDtrIsLoading) {
      getEmployeeDtr(swrDtrIsLoading);
    }
  }, [swrDtrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrDtr)) {
      setSelectedYear(yearNow);
      setSelectedMonth(monthNow);
      getEmployeeDtrSuccess(swrDtrIsLoading, swrDtr);
    }

    if (!isEmpty(swrDtrError)) {
      getEmployeeDtrFail(swrDtrIsLoading, swrDtrError.message);
    }
  }, [swrDtr, swrDtrError]);

  //pass slip count
  const passSlipCountUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/pass-slips/used/count`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrPassSlipCount,
    isLoading: swrPassSlipCountIsLoading,
    error: swrPassSlipCountError,
    mutate: mutatePassSlipCount,
  } = useSWR(userDetails.employmentDetails.companyId ? passSlipCountUrl : null, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: true,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrPassSlipCountIsLoading) {
      getPassSlipCount(swrPassSlipCountIsLoading);
    }
  }, [swrPassSlipCountIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPassSlipCount)) {
      getPassSlipCountSuccess(swrPassSlipCountIsLoading, swrPassSlipCount);
    }

    if (!isEmpty(swrPassSlipCountError)) {
      getPassSlipCountFail(swrPassSlipCountIsLoading, swrPassSlipCountError.message);
    }
  }, [swrPassSlipCount, swrPassSlipCountError]);

  //store server side props (userDetails) to store
  //run hydration function which displays allowed modules of employee
  //requirements - userDetails(server-side) and schedule(swr)
  useEffect(() => {
    if (userDetails) {
      setEmployee(userDetails);
      hydration();
    }
  }, [userDetails, schedule]);

  const { windowHeight } = UseWindowDimensions();

  //add all leave credits
  useEffect(() => {
    setLeaveCredits(Number(vacationLeaveBalance) + Number(forcedLeaveBalance) + Number(sickLeaveBalance));
  }, [vacationLeaveBalance, forcedLeaveBalance, sickLeaveBalance]);

  //compute max leave credits
  useEffect(() => {
    if (leaveCredits && monetizationConstant) {
      setEstimatedAmount(sgAmount * leaveCredits * monetizationConstant);
    } else {
      setEstimatedAmount(0);
    }
  }, [leaveCredits, monetizationConstant]);

  const closeLeaveCalculator = async () => {
    setLeaveCalculatorModalIsOpen(false);
  };

  const openLeaveCalculator = async () => {
    if (vacationLeaveBalance && forcedLeaveBalance && sickLeaveBalance && sgAmount && sgIncrement) {
      setLeaveCalculatorModalIsOpen(true);
    }
  };

  //get month and day only
  const dateNow = dayjs(dayjs().toDate().toDateString()).format('MM-DD');
  const employeeBirthday = dayjs(employee.profile.birthDate).format('MM-DD');

  return (
    <>
      {/* Falling Hearts Effect for February Only */}
      {dateNow == '02-14' ? (
        <div className="wrapper absolute">
          <div className="heart x1"></div>
          <div className="heart x2"></div>
          <div className="heart x3"></div>
          <div className="heart x4"></div>
          <div className="heart x5"></div>
          <div className="altheart x6"></div>
        </div>
      ) : null}

      {/* Balloon Effect for Birthday */}
      {dateNow === employeeBirthday && employee ? (
        <div className="wrapper absolute">
          <div className="balloon1 x1"></div>
          <div className="balloon2 x2"></div>
          <div className="balloon1 x3"></div>
          <div className="balloon2 x4"></div>
          <div className="balloon1 x5"></div>
          <div className="balloon2 x6"></div>
        </div>
      ) : null}

      {/* Leave Monetization Constant Load Failed */}
      {!isEmpty(errorMonetizationConstant) ? (
        <>
          <ToastNotification
            toastType="error"
            notifMessage={`${errorMonetizationConstant}: Failed to load Monetization Constant and compute Leave Monetization.`}
          />
        </>
      ) : null}

      {/* Leave Ledger Load Failed */}
      {!isEmpty(errorLedger) ? (
        <>
          <ToastNotification toastType="error" notifMessage={`${errorLedger}: Failed to load Leave Ledger.`} />
        </>
      ) : null}

      {!isEmpty(swrFaceScanError) ? (
        <ToastNotification toastType="error" notifMessage={`Face Scans: ${swrFaceScanError.message}.`} />
      ) : null}

      {!isEmpty(swrDtrError) ? (
        <ToastNotification toastType="error" notifMessage={`DTR: ${swrDtrError.message}.`} />
      ) : null}

      {!isEmpty(swrPassSlipCountError) ? (
        <ToastNotification toastType="error" notifMessage={`Pass Slip Count: ${swrPassSlipCountError.message}.`} />
      ) : null}

      <Head>
        <title>{employeeName}</title>
      </Head>
      <SideNav employeeDetails={userDetails} />

      <LeaveCreditMonetizationCalculatorModal
        modalState={leaveCalculatorModalIsOpen}
        setModalState={setLeaveCalculatorModalIsOpen}
        closeModalAction={closeLeaveCalculator}
        vacationLeave={vacationLeaveBalance}
        forcedLeave={forcedLeaveBalance}
        sickLeave={sickLeaveBalance}
        sgAmount={employee.employmentDetails.salaryGradeAmount}
        sgIncrement={employee.employmentDetails.salaryGrade}
        estimatedMaxAmount={estimatedAmount}
        monetizationConstant={monetizationConstant}
      />

      <MainContainer>
        <>
          <>
            <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full overflow-hidden pointer-events-none opacity-10">
              <Image src={'/gwdlogo.png'} priority className="w-2/4 " alt={''} width={'500'} height={'500'} />
            </div>
            <div className="pt-2 md:pt-0 grid grid-cols-1 gap-4 px-4 md:grid-cols-3 lg:grid-cols-5">
              <div className="z-10 order-1 col-span-1 md:col-span-5 lg:col-span-5 lg:order-1">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 ">
                  <div className="order-1 col-span-2 md:order-1 md:col-span-2 md:row-span-2 lg:row-span-2 lg:col-span-1 lg:order-1 ">
                    <ProfileCard
                      fullName={userDetails.employmentDetails.employeeFullName}
                      position={userDetails.employmentDetails.assignment.positionTitle}
                      division={userDetails.employmentDetails.assignment.name}
                      photoUrl={userDetails.profile.photoUrl}
                    />
                  </div>
                  <div className="order-2 col-span-2 md:col-span-2 md:order-3 lg:col-span-2 lg:order-2">
                    <AttendanceCard timeLogData={swrFaceScan} swrFaceScanIsLoading={swrFaceScanIsLoading} />
                  </div>
                  <div className="order-8 col-span-2 row-span-4 md:col-span-4 md:order-8 lg:col-span-2 lg:order-3">
                    <Carousel />
                  </div>
                  <div className="order-5 col-span-2 md:row-span-2 lg:row-span-4 md:col-span-2 md:order-4 lg:col-span-1 lg:order-5">
                    <EmployeeDashboard />
                  </div>
                  <div className="grid grid-cols-2 gap-4 order-3 col-span-2 md:order-3 md:col-span-2 lg:col-span-2 lg:order-4">
                    <StatsCard
                      name={'Lates Count'}
                      count={swrDtr?.summary?.noOfTimesLate ?? 0}
                      isLoading={swrDtrIsLoading}
                      width={'w-full'}
                      height={windowHeight > 820 ? 'h-52' : 'h-36'}
                      svg={<HiClock className="w-7 h-7 text-indigo-500" />}
                      svgBgColor={'bg-indigo-100'}
                    />
                    <StatsCard
                      name={'Pass Slip Count'}
                      count={swrPassSlipCount?.passSlipCount}
                      isLoading={swrDtrIsLoading}
                      width={'w-full'}
                      height={windowHeight > 820 ? 'h-52' : 'h-36'}
                      svg={<HiDocument className="w-7 h-7 text-indigo-500" />}
                      svgBgColor={'bg-indigo-100'}
                    />
                  </div>
                  <div className="order-4 col-span-2 md:col-span-2 md:order-5 lg:col-span-2 lg:order-6">
                    <div className="grid grid-cols-2 gap-4">
                      <StatsCard
                        name={'Force Leave'}
                        count={forcedLeaveBalance}
                        isLoading={swrLeaveLedgerLoading}
                        width={'w-full'}
                        height={windowHeight > 820 ? 'h-32' : 'h-28'}
                        svg={<HiCalendar className="w-7 h-7 text-rose-500" />}
                        svgBgColor={'bg-rose-100'}
                      />
                      <StatsCard
                        name={'Special Privilege Leave'}
                        count={specialPrivilegeLeaveBalance}
                        isLoading={swrLeaveLedgerLoading}
                        width={'w-full'}
                        height={windowHeight > 820 ? 'h-32' : 'h-28'}
                        svg={<HiCalendar className="w-7 h-7 text-orange-500" />}
                        svgBgColor={'bg-orange-100'}
                      />
                      <StatsCard
                        name={'Vacation Leave'}
                        count={vacationLeaveBalance}
                        isLoading={swrLeaveLedgerLoading}
                        width={'w-full'}
                        height={windowHeight > 820 ? 'h-32' : 'h-28'}
                        svg={<HiCalendar className="w-7 h-7 text-lime-500" />}
                        svgBgColor={'bg-lime-100'}
                      />
                      <StatsCard
                        name={'Sick Leave'}
                        count={sickLeaveBalance}
                        isLoading={swrLeaveLedgerLoading}
                        width={'w-full'}
                        height={windowHeight > 820 ? 'h-32' : 'h-28'}
                        svg={<HiCalendar className="w-7 h-7 text-pink-500" />}
                        svgBgColor={'bg-pink-100'}
                      />
                    </div>
                  </div>

                  <div className="order-4 col-span-2 md:col-span-2 md:order-5 lg:col-span-2 lg:order-6">
                    <div className="w-full" onClick={openLeaveCalculator}>
                      <StatsCard
                        name={'Max Leave Credit Monetization'}
                        count={estimatedAmount}
                        isLoading={swrLeaveLedgerLoading}
                        width={'w-auto'}
                        height={windowHeight > 820 ? 'h-32' : 'h-32'}
                        svg={<HiCash className="w-7 h-7 text-green-500" />}
                        svgBgColor={'bg-green-100'}
                        canHover={true}
                      />
                    </div>
                  </div>

                  <div className="order-6 md:order-5 lg:order-7 col-span-2 row-span-2">
                    <div className="w-full h-full gap-2 p-4 pb-10 mb-2 bg-white rounded-md shadow">
                      <EmployeeCalendar />
                    </div>
                  </div>

                  <div className="order-7 col-span-2 row-span-1 md:col-span-2 md:order-6 lg:col-span-2 lg:order-8">
                    <RemindersCard reminders={''} />
                  </div>
                </div>
              </div>
            </div>
          </>
        </>
      </MainContainer>
    </>
  );
}

//use for official user
export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const userDetails = getUserDetails();
  return { props: { userDetails } };
});
