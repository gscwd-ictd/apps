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
// import { withSession, getemployeeDummy } from '../../utils/helpers/session';
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

export default function Dashboard() {
//   {
//   employeeDummy,
// }: InferGetServerSidePropsType<typeof getServerSideProps>
  const setAllowedModules = useAllowedModulesStore(
    (state) => state.setAllowedModules
  );
  const setEmployee = useEmployeeStore((state) => state.setEmployeeDetails);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function hydration() {
    setLocalStorage(employeeDummy);

    const modules = await setModules(employeeDummy);

    setAllowedModules(modules);

    return setIsLoading(false);
  }

  useEffect(() => {
    setEmployee(employeeDummy);
    setIsLoading(true);
    hydration();
  }, []);

  const employeeName = `${employeeDummy.profile.firstName} ${employeeDummy.profile.lastName}`;

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
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-row gap-4 pb-24 overflow-x-hidden">
              <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center opacity-10 overflow-hidden z-1 pointer-events-none">
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
              <div className="w-full h-full z-10 flex flex-col gap-5 mt-1 ">
                {/* 3 PANELS */}
                <div>
                  <div className="flex flex-row gap-5">
                    <StatsCard name={'Total Lates'} count={7} />
                    <StatsCard name={'Total Absents'} count={4} />
                    <StatsCard name={'Total Leaves'} count={5} />
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
                <div className="w-full h-full shadow rounded-md bg-white flex flex-col p-4 gap-2 mb-2 pb-10">
                  <EmployeeCalendar />
                </div>
              </div>
              <div className="w-1/5 h-screen flex flex-col gap-5 z-20 mt-1 mb-20">
                <ProfileCard
                  firstName={employeeDummy.profile.firstName}
                  lastName={employeeDummy.profile.lastName}
                  position={
                    employeeDummy.employmentDetails.assignment.positionTitle
                  }
                  division={employeeDummy.employmentDetails.assignment.name}
                  photoUrl={employeeDummy.profile.photoUrl}
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

// export const getServerSideProps: GetServerSideProps = withSession(
//   async (context: GetServerSidePropsContext) => {
//     const employeeDummy = getemployeeDummy();
//     // console.log(employeeDummy);
//     return { props: { employeeDummy } };
//   }
// );
