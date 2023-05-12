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

  return (
    <>
      <Head>
        <title>{employeeName}</title>
      </Head>
      <SideNav />
      <MainContainer>
        <>
          {isLoading ? (
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
            <div className="flex flex-row w-full h-full gap-4 pb-24 overflow-x-hidden">
              <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-hidden pointer-events-none opacity-10 z-1">
                {/* <img className="w-2/4 overflow-hidden" src="/gwdlogo.png"></img> */}
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
                  timeIn={'8:04 AM'}
                  lunchOut={'12:05 PM'}
                  lunchIn={'12:32 PM'}
                  timeOut={'5:11 PM'}
                  dateNow={`${new Date()}`}
                />
                {/* REMINDERS */}
                <RemindersCard reminders={''} />
                {/* CALENDAR */}
                <div className="flex flex-col w-full h-full gap-2 p-4 pb-10 mb-2 bg-white rounded-md shadow">
                  <EmployeeCalendar />
                </div>
              </div>
              <div className="z-20 flex flex-col w-1/5 h-screen gap-5 mt-1 mb-20">
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
          )}
        </>
      </MainContainer>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const userDetails = employeeDummy;

//   return { props: { userDetails } };
// };

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const userDetails = getUserDetails();
    // console.log(userDetails);
    return { props: { userDetails } };
  }
);
