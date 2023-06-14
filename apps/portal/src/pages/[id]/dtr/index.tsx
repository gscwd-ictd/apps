import Head from 'next/head';
import { useEffect, useState } from 'react';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import {
  getUserDetails,
  withCookieSession,
  withSession,
} from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { format } from 'date-fns';
import { HiOutlineSearch } from 'react-icons/hi';
import Link from 'next/link';
import { DtrDateSelect } from '../../../../src/components/fixed/dtr/DtrDateSelect';
import { useDtrStore } from '../../../../src/store/dtr.store';
import { DtrTable } from '../../../../src/components/fixed/dtr/DtrTable';
import { employeeDummy } from '../../../../src/types/employee.type';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';

export default function DailyTimeRecord({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
    setIsLoading(true);
  }, [employeeDetails, setEmployeeDetails]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading]);

  const [navDetails, setNavDetails] = useState<NavButtonDetails>();

  useEffect(() => {
    setNavDetails({
      profile: employeeDetails.user.email,
      fullName: `${employeeDetails.profile.firstName} ${employeeDetails.profile.lastName}`,
      initials: UseNameInitials(
        employeeDetails.profile.firstName,
        employeeDetails.profile.lastName
      ),
    });
  }, []);

  return (
    <>
      <>
        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Daily Time Record</title>
          </Head>

          <SideNav navDetails={navDetails} />

          <MainContainer>
            <div className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
              <ContentHeader
                title="Daily Time Record"
                subtitle="View schedules, time in and time out"
              >
                <DtrDateSelect employeeDetails={employeeDetails} />
              </ContentHeader>

              <ContentBody>
                {isLoading ? (
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
                  <DtrTable employeeDetails={employeeDetails} />
                )}
              </ContentBody>
            </div>
          </MainContainer>
        </EmployeeProvider>
      </>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const employeeDetails = employeeDummy;

  return { props: { employeeDetails } };
};

// export const getServerSideProps: GetServerSideProps = withCookieSession(
//   async (context: GetServerSidePropsContext) => {
//     const employeeDetails = getUserDetails();

//     return { props: { employeeDetails } };
//   }
// );
