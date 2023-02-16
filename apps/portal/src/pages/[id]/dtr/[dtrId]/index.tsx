import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { getUserDetails, withSession } from '../../../../utils/helpers/session';
import React from 'react';
import DtrPdf from '../../../../../src/components/fixed/dtr/DtrPdf';

export default function PassSlipPage( {
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
   

  return (
    employeeDetails && (
      <>
        <Head>
          <title>Employee DTR</title>
        </Head>
        <DtrPdf />
      </>
    )
  );
}

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();

    return { props: { employeeDetails } };
  }
);
