import Head from 'next/head';
import { useEffect, useState } from 'react';
import { SideNav } from '../../../components/fixed/nav/SideNav';
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
import { getUserDetails, withSession } from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { format } from 'date-fns';
import { HiOutlineSearch } from 'react-icons/hi';
import Link from 'next/link';
import { DtrDateSelect } from '../../../../src/components/fixed/dtr/DtrDateSelect';
import { useDtrStore } from '../../../../src/store/dtr.store';
import { DtrTable } from '../../../../src/components/fixed/dtr/DtrTable';

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

  return (
    <>
      <>
        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Daily Time Record</title>
          </Head>

          <SideNav />

          <MainContainer>
            <div className="w-full h-full px-32">
              <ContentHeader
                title="Daily Time Record"
                subtitle="View schedules, time in and time out"
              >
                <DtrDateSelect />
              </ContentHeader>

              <ContentBody>
                {isLoading ? (
                  <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                    <SpinnerDotted
                      speed={70}
                      thickness={70}
                      className="w-full flex h-full transition-all "
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

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();

    return { props: { employeeDetails } };
  }
);
