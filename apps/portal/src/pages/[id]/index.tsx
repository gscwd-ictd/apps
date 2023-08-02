/* eslint-disable @nx/enforce-module-boundaries */
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import SideNav from '../../components/fixed/nav/SideNav';
import { MainContainer } from '../../components/modular/custom/containers/MainContainer';
import { useAllowedModulesStore } from '../../store/allowed-modules.store';
import {
  withSession,
  getUserDetails,
  withCookieSession,
} from '../../utils/helpers/session';
import { useEmployeeStore } from '../../store/employee.store';
import { EmployeeDashboard } from '../../components/fixed/dashboard/EmployeeDashboard';
import { SpinnerDotted } from 'spinners-react';
import { setModules } from '../../utils/helpers/modules';
import { setLocalStorage } from '../../utils/helpers/local-storage';
import Carousel from '../../components/fixed/home/carousel/Carousel';
import Image from 'next/image';
import EmployeeCalendar from '../../components/fixed/home/calendar/Calendar';
import { ProfileCard } from '../../components/fixed/home/profile/ProfileCard';
import { RemindersCard } from '../../components/fixed/home/reminders/RemindersCard';
import { AttendanceCard } from '../../components/fixed/home/attendance/AttendanceCard';
import { StatsCard } from '../../components/fixed/home/stats/StatsCard';
import { employeeDummy } from '../../types/employee.type';
import { fetchWithToken } from '../../utils/hoc/fetcher';
import useSWR from 'swr';
import { format } from 'date-fns';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { ToastNotification } from '@gscwd-apps/oneui';
import { isEmpty } from 'lodash';
import { useTimeLogStore } from '../../store/timelogs.store';
import { UseNameInitials } from '../../utils/hooks/useNameInitials';
import { useDtrStore } from '../../store/dtr.store';
import {
  HiCalendar,
  HiClock,
  HiDocument,
  HiOutlineClock,
  HiOutlineDocument,
} from 'react-icons/hi';

export type NavDetails = {
  fullName: string;
  initials: string;
  profile: string;
};

export default function Dashboard({
  userDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const setAllowedModules = useAllowedModulesStore(
    (state) => state.setAllowedModules
  );
  const setEmployee = useEmployeeStore((state) => state.setEmployeeDetails);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [navDetails, setNavDetails] = useState<NavDetails>();

  async function hydration() {
    // setLocalStorage(userDetails);
    setNavDetails({
      profile: userDetails.user.email,
      fullName: `${userDetails.profile.firstName} ${userDetails.profile.lastName}`,
      initials: UseNameInitials(
        userDetails.profile.firstName,
        userDetails.profile.lastName
      ),
    });

    const modules = await setModules(userDetails);

    setAllowedModules(modules);

    return setIsLoading(false);
  }

  useEffect(() => {
    setEmployee(userDetails);
    setIsLoading(true);
    hydration();
  }, []);

  const employeeName = `${userDetails.profile.firstName} ${userDetails.profile.lastName}`;

  const {
    dtr,
    schedule,
    loadingTimeLogs,
    errorTimeLogs,
    getTimeLogs,
    getTimeLogsSuccess,
    getTimeLogsFail,
  } = useTimeLogStore((state) => ({
    dtr: state.dtr,
    schedule: state.schedule,
    loadingTimeLogs: state.loading.loadingTimeLogs,
    errorTimeLogs: state.error.errorTimeLogs,
    getTimeLogs: state.getTimeLogs,
    getTimeLogsSuccess: state.getTimeLogsSuccess,
    getTimeLogsFail: state.getTimeLogsFail,
  }));

  const { getEmployeeDtr, getEmployeeDtrSuccess, getEmployeeDtrFail } =
    useDtrStore((state) => ({
      getEmployeeDtr: state.getEmployeeDtr,
      getEmployeeDtrSuccess: state.getEmployeeDtrSuccess,
      getEmployeeDtrFail: state.getEmployeeDtrFail,
    }));

  // const  = useDtrStore((state) => state.getEmployeeDtr);
  // const getEmployeeDtrSuccess = useDtrStore(
  //   (state) => state.getEmployeeDtrSuccess
  // );
  // const getEmployeeDtrFail = useDtrStore((state) => state.getEmployeeDtrFail);

  const faceScanUrl = `${
    process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL
  }/v1/daily-time-record/employees/${
    userDetails.employmentDetails.companyId
  }/${format(new Date(), 'yyyy-MM-dd')}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrFaceScan,
    isLoading: swrFaceScanIsLoading,
    error: swrFaceScanError,
    mutate: mutateFaceScanUrl,
  } = useSWR(faceScanUrl, fetchWithToken, {
    shouldRetryOnError: false,
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
  } = useSWR(dtrUrl, fetchWithToken, {
    shouldRetryOnError: false,
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
      getEmployeeDtrSuccess(swrDtrIsLoading, swrDtr);
    }

    if (!isEmpty(swrDtrError)) {
      getEmployeeDtrFail(swrDtrIsLoading, swrDtrError.message);
    }
  }, [swrDtr, swrDtrError]);

  return (
    <>
      {!isEmpty(swrFaceScanError) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`Face Scans: ${swrFaceScanError.message}.`}
        />
      ) : null}

      {!isEmpty(swrDtrError) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`DTR: ${swrDtrError.message}.`}
        />
      ) : null}

      <Head>
        <title>{employeeName}</title>
      </Head>
      <SideNav navDetails={navDetails} employeeDetails={userDetails} />

      <MainContainer>
        <>
          <>
            <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full overflow-hidden pointer-events-none opacity-10">
              <Image
                src={'/gwdlogo.png'}
                className="w-2/4 "
                alt={''}
                width={'500'}
                height={'500'}
              />
            </div>
            <div className="pt-2 md:pt-0 grid grid-cols-1 gap-4 px-4 md:grid-cols-3 lg:grid-cols-5">
              <div className="z-10 order-1 col-span-1 md:col-span-5 lg:col-span-5 lg:order-1">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5 ">
                  <div className="order-1 col-span-2 md:order-1 md:col-span-2 md:row-span-2 lg:row-span-2 lg:col-span-1 lg:order-1 ">
                    <ProfileCard
                      firstName={userDetails.profile.firstName}
                      lastName={userDetails.profile.lastName}
                      position={
                        userDetails.employmentDetails.assignment.positionTitle
                      }
                      division={userDetails.employmentDetails.assignment.name}
                      photoUrl={userDetails.profile.photoUrl}
                    />
                  </div>
                  <div className="order-2 col-span-2 md:col-span-2 md:order-3 lg:col-span-2 lg:order-2">
                    <AttendanceCard
                      timeLogData={swrFaceScan}
                      swrFaceScanIsLoading={swrFaceScanIsLoading}
                    />
                  </div>
                  <div className="order-8 col-span-2 row-span-4 md:col-span-4 md:order-8 lg:col-span-2 lg:order-3">
                    <Carousel />
                  </div>
                  <div className="order-5 col-span-2 row-span-4 md:col-span-2 md:order-4 lg:col-span-1 lg:order-5">
                    <EmployeeDashboard />
                  </div>
                  <div className="grid grid-cols-2 gap-4 order-3 col-span-2 md:order-3 md:col-span-2 lg:col-span-2 lg:order-4">
                    <StatsCard
                      name={'Lates Count'}
                      count={swrDtr?.summary?.noOfTimesLate ?? 0}
                      isLoading={swrDtrIsLoading}
                      width={'w-full'}
                      height={''}
                      svg={<HiClock className="w-8 h-8 text-indigo-500" />}
                      svgBgColor={'bg-indigo-100'}
                    />
                    <StatsCard
                      name={'Pass Slip Count'}
                      count={0}
                      isLoading={swrDtrIsLoading}
                      width={'w-full'}
                      height={''}
                      svg={<HiDocument className="w-8 h-8 text-indigo-500" />}
                      svgBgColor={'bg-indigo-100'}
                    />
                  </div>
                  <div className="order-4 col-span-2 md:col-span-2 md:order-5 lg:col-span-2 lg:order-6">
                    <div className="grid grid-cols-2 gap-4">
                      <StatsCard
                        name={'Force Leave'}
                        count={0}
                        isLoading={swrDtrIsLoading}
                        width={'w-full'}
                        height={'h-28'}
                        svg={<HiCalendar className="w-8 h-8 text-rose-500" />}
                        svgBgColor={'bg-rose-100'}
                      />
                      <StatsCard
                        name={'Special Privilege Leave'}
                        count={0}
                        isLoading={swrDtrIsLoading}
                        width={'w-full'}
                        height={'h-28'}
                        svg={<HiCalendar className="w-8 h-8 text-orange-500" />}
                        svgBgColor={'bg-orange-100'}
                      />
                      <StatsCard
                        name={'Vacation Leave'}
                        count={0}
                        isLoading={swrDtrIsLoading}
                        width={'w-full'}
                        height={'h-28'}
                        svg={<HiCalendar className="w-8 h-8 text-lime-500" />}
                        svgBgColor={'bg-lime-100'}
                      />
                      <StatsCard
                        name={'Special Privilege Benefit'}
                        count={0}
                        isLoading={swrDtrIsLoading}
                        width={'w-full'}
                        height={'h-28'}
                        svg={<HiCalendar className="w-8 h-8 text-pink-500" />}
                        svgBgColor={'bg-pink-100'}
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

//use for dummy login only
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const userDetails = employeeDummy;
  return { props: { userDetails } };
};

//use for official user
// export const getServerSideProps: GetServerSideProps = withCookieSession(
//   async (context: GetServerSidePropsContext) => {
//     const userDetails = getUserDetails();

//     return { props: { userDetails } };
//   }
// );
