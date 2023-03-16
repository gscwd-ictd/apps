/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import DrcModal from 'apps/portal/src/components/fixed/dr/modal/DrcModal';
import { SideNav } from 'apps/portal/src/components/fixed/nav/SideNav';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import {
  getUserDetails,
  withCookieSession,
} from 'apps/portal/src/utils/helpers/session';
import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';

export default function DutiesResponsibilities() {
  //   {
  //   employeeDetails,
  // }: InferGetServerSidePropsType<typeof getServerSideProps>

  const { modal } = useModalStore((state) => ({ modal: state.modal }));

  return (
    <>
      <Head>
        <title>Setup Duties and Responsibilities</title>
      </Head>

      <SideNav />

      <DrcModal />
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = withCookieSession(
//   async (context: GetServerSidePropsContext) => {
//     const employeeDetails = getUserDetails();

//     return { props: {} };
//   }
// );
