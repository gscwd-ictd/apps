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
    console.log(userDetails);
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
      // console.log(swrFaceScan);
      getTimeLogsSuccess(swrFaceScanIsLoading, swrFaceScan);
    }

    if (!isEmpty(swrFaceScanError)) {
      getTimeLogsFail(swrFaceScanIsLoading, swrFaceScanError.message);
    }
  }, [swrFaceScan, swrFaceScanError]);

  return (
    <>
      {!isEmpty(swrFaceScanError) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`Face Scans: ${swrFaceScanError.message}.`}
        />
      ) : null}

      <Head>
        <title>{employeeName}</title>
      </Head>
      <SideNav navDetails={navDetails} />

      <MainContainer>
        <>
          {swrFaceScanIsLoading ? (
            <>
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="flex w-full h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
          ) : (
            <>
              <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden pointer-events-none opacity-10 z-0">
                <Image
                  src={'/gwdlogo.png'}
                  className="w-2/4 "
                  alt={''}
                  width={'500'}
                  height={'500'}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
                <div className="h-[24rem] sm:h-[35rem] md:h-full col-span-1 md:col-span-3 md:order-last lg:col-span-2 order-last lg:order-1">
                  <Carousel />
                </div>

                <div className="col-span-1 md:col-span-3 lg:col-span-3 order-1 lg:order-2 z-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
                    <div className="col-span-2 order-3 md:col-span-2 md:order-1 lg:col-span-2 lg:order-1">
                      <div className="flex flex-row gap-4">
                        <StatsCard name={'Total Lates'} count={10} />
                        <StatsCard name={'Total Absents'} count={10} />
                        <StatsCard name={'Total Leaves'} count={10} />
                      </div>
                    </div>
                    <div className="col-span-2 order-1 md:order-2 md:col-span-1 md:row-span-2 lg:row-span-2 lg:col-span-1 lg:order-2 ">
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
                    <div className="col-span-2 order-2 md:col-span-2 md:order-3 lg:col-span-2 lg:order-3">
                      <AttendanceCard timeLogData={swrFaceScan} />
                    </div>
                    <div className="col-span-2 order-5 md:order-4 md:col-span-2 lg:col-span-2 lg:order-4">
                      <RemindersCard reminders={''} />
                    </div>

                    <div className="col-span-2 row-span-3 order-4 md:col-span-1 md:order-5 lg:col-span-1 lg:order-5">
                      <EmployeeDashboard />
                    </div>
                    <div className="col-span-2 order-6">
                      <div className="w-full h-full gap-2 p-4 pb-10 mb-2 bg-white rounded-md shadow">
                        <EmployeeCalendar />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      </MainContainer>
    </>
  );
}

//use for dummy login only
// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const userDetails = employeeDummy;
//   return { props: { userDetails } };
// };

//use for official user
export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const userDetails = getUserDetails();
    // console.log(userDetails);
    return { props: { userDetails } };
  }
);
