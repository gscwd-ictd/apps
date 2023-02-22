import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { getUserDetails, withSession } from '../../../../utils/helpers/session';
import React from 'react';
import { employeeDummy } from '../../../../types/employee.type';
import LeavePdf from '../../../../../src/components/fixed/leaves/LeavePdf';

export default function PassSlipPage(    {
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {


  return (
    employeeDetails && (
      <>
        <Head>
          <title>Employee Leave</title>
        </Head>
        <LeavePdf />
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
