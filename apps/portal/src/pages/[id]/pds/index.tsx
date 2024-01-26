import { Button } from '@gscwd-apps/oneui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { useEffect, useState } from 'react';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import SideNav from '../../../components/fixed/nav/SideNav';
import { PdsTabs } from '../../../components/fixed/pds/PdsTabs';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { useEmployeeStore } from '../../../store/employee.store';
import { usePdsStore } from '../../../store/pds.store';
import { employeeDummy } from 'apps/portal/src/types/employee.type';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';

export default function Pds({ employeeDetails, userId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const tab = usePdsStore((state) => state.tab);

  const router = useRouter();

  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);

  const tabAction = () => {
    let link = '';
    if (tab === 1) {
      link = `${process.env.NEXT_PUBLIC_PDS}/pds/${userId}`;
    } else if (tab === 2) {
      router.reload();
    } else if (tab === 3) {
      link = `${process.env.NEXT_PUBLIC_PDS}/pds/${userId}`;
    }
    return (location.href = link);
  };

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
      <Head>
        <title>Personal Data Sheet</title>
      </Head>

      <SideNav employeeDetails={employeeDetails} />

      <MainContainer>
        <div className={`w-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
          <ContentHeader title="Personal Data Sheet" subtitle="Create or view your PDS" backUrl={''}>
            {tab === 2 && (
              <div className="w-[12rem]">
                <Button>Updated selected</Button>
              </div>
            )}
          </ContentHeader>
          <ContentBody>
            <>
              <div className={`w-full flex lg:flex-row flex-col`}>
                <div className={`lg:w-[32rem] md:w-[58rem] sm:w-full`}>
                  <PdsTabs tab={tab} userId={userId} />
                </div>
              </div>
            </>
          </ContentBody>
        </div>
      </MainContainer>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const employeeDetails = employeeDummy;

//   return { props: { employeeDetails } };
// };

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  // check if user role is rank_and_file or job order = kick out
  if (employeeDetails.employmentDetails.userRole === UserRole.JOB_ORDER) {
    // if true, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${employeeDetails.user._id}`,
      },
    };
  } else {
    return { props: { employeeDetails, userId: context.query.id } };
  }
});
