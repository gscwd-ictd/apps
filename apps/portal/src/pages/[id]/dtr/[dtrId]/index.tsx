import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getUserDetails, withCookieSession } from '../../../../utils/helpers/session';
import React from 'react';
import DtrPdf from '../../../../../src/components/fixed/dtr/DtrPdf';
import { employeeDummy } from '../../../../../src/types/employee.type';

export default function PassSlipPage({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const employeeDetails = employeeDummy;

//   return { props: { employeeDetails } };
// };

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  return { props: { employeeDetails } };
});
