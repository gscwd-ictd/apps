import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import {
  getUserDetails,
  withCookieSession,
  withSession,
} from '../../../../utils/helpers/session';
import React from 'react';
import DtrPdf from '../../../../../src/components/fixed/dtr/DtrPdf';

export default function PassSlipPage({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    employeeDetails && (
      <>
        <Head>
          <title>Employee DTR</title>
        </Head>
        <DtrPdf />
        test
      </>
    )
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();

    return { props: { employeeDetails } };
  }
);
