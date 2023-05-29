/* eslint-disable @nx/enforce-module-boundaries */
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { SideNav } from '../../components/fixed/nav/SideNav';
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

export default function Dashboard({
  userDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const setAllowedModules = useAllowedModulesStore(
    (state) => state.setAllowedModules
  );
  const setEmployee = useEmployeeStore((state) => state.setEmployeeDetails);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function hydration() {
    setLocalStorage(userDetails);

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

  console.log(swrFaceScan);

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
      <SideNav />
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
                <div className="col-span-1 md:col-span-3 md:order-last lg:col-span-2 order-last lg:order-1">
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
                      <AttendanceCard
                        timeIn={swrFaceScan ? swrFaceScan.timeIn : '-'}
                        lunchOut={swrFaceScan ? swrFaceScan.lunchOut : '-'}
                        lunchIn={swrFaceScan ? swrFaceScan.lunchIn : '-'}
                        timeOut={swrFaceScan ? swrFaceScan.timeOut : '-'}
                        dateNow={`${new Date()}`}
                      />
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

              {/* ORIGINAL DESKTOP */}
              {isLoading ? (
                <>
                  {/* desktop */}
                  <div className="flex flex-row w-full h-full gap-4 pb-24 overflow-x-hidden">
                    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden pointer-events-none opacity-10 z-1">
                      <Image
                        src={'/gwdlogo.png'}
                        className="w-2/4 "
                        alt={''}
                        width={'500'}
                        height={'500'}
                      />
                    </div>
                    <div className="w-2/5 h-full mt-1">
                      <Carousel />
                    </div>
                    <div className="z-10 flex flex-col w-full h-full gap-5 mt-1 ">
                      {/* 3 PANELS */}
                      <div>
                        <div className="flex flex-row gap-5">
                          <StatsCard name={'Total Lates'} count={10} />
                          <StatsCard name={'Total Absents'} count={10} />
                          <StatsCard name={'Total Leaves'} count={10} />
                        </div>
                      </div>
                      {/* ATTENDANCE */}
                      <AttendanceCard
                        timeIn={swrFaceScan ? swrFaceScan.timeIn : '08:04:20'}
                        lunchOut={swrFaceScan ? swrFaceScan.lunchOut : '-'}
                        lunchIn={swrFaceScan ? swrFaceScan.lunchIn : '-'}
                        timeOut={swrFaceScan ? swrFaceScan.timeOut : '-'}
                        dateNow={`${new Date()}`}
                      />
                      {/* REMINDERS */}
                      <RemindersCard reminders={''} />
                      {/* CALENDAR */}
                      <div className="flex flex-col w-full h-full gap-2 p-4 pb-10 mb-2 bg-white rounded-md shadow">
                        <EmployeeCalendar />
                      </div>
                    </div>
                    <div className="z-20 flex flex-col w-1/5 h-screen gap-5 pr-5 mt-1 mb-20">
                      <ProfileCard
                        firstName={userDetails.profile.firstName}
                        lastName={userDetails.profile.lastName}
                        position={
                          userDetails.employmentDetails.assignment.positionTitle
                        }
                        division={userDetails.employmentDetails.assignment.name}
                        photoUrl={userDetails.profile.photoUrl}
                      />
                      <EmployeeDashboard />
                    </div>
                  </div>
                </>
              ) : null}
            </>
          )}
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
//     // console.log(userDetails);
//     return { props: { userDetails } };
//   }
// );
