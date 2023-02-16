import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { getUserDetails, withSession } from '../../../../utils/helpers/session';
import { usePassSlipStore } from '../../../../store/passslip.store';
import React from 'react';
import { PassSlipPdf } from '../../../../components/fixed/passslip/PassSlipPdf';

export default function PassSlipPage({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const selectedPassSlip = usePassSlipStore((state) => state.selectedPassSlip);

  console.log(selectedPassSlip);

  return (
    employeeDetails && (
      <>
        <Head>
          <title>Employee Pass Slips</title>
        </Head>
        <PassSlipPdf employeeDetails={employeeDetails} />;
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
