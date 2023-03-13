import { Button } from '@gscwd-apps/oneui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { useEffect } from 'react';
import {
  getUserDetails,
  withCookieSession,
  withSession,
} from '../../../utils/helpers/session';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { PdsTabs } from '../../../components/fixed/pds/PdsTabs';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { useEmployeeStore } from '../../../store/employee.store';
import { usePdsStore } from '../../../store/pds.store';

export default function Pds({
  employeeDetails,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const tab = usePdsStore((state) => state.tab);

  const router = useRouter();

  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );

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

  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, []);

  return (
    <>
      <Head>
        <title>Personal Data Sheet</title>
      </Head>

      <SideNav />

      <MainContainer>
        <div className="w-full h-full px-32">
          <ContentHeader
            title="Personal Data Sheet"
            subtitle="Create or view your PDS"
          >
            {tab === 2 && (
              <div className="w-[12rem]">
                <Button>Updated selected</Button>
              </div>
            )}
          </ContentHeader>
          <ContentBody>
            <>
              <div className="flex w-full">
                <div className="w-[58rem]">
                  <PdsTabs tab={tab} userId={userId} />
                </div>
                <div className="invisible w-full">TEST</div>
              </div>
            </>
          </ContentBody>
        </div>
      </MainContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const userDetails = getUserDetails();

    return { props: { userDetails, userId: context.query.id } };
  }
);
