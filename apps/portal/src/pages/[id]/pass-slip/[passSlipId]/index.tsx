import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { getUserDetails, withSession } from '../../../../utils/helpers/session';
import { usePassSlipStore } from '../../../../store/passslip.store';
import React, { useEffect } from 'react';
import { PassSlipPdf } from '../../../../components/fixed/passslip/PassSlipPdf';
import { employeeDummy } from '../../../../../src/types/employee.type';

export default function PassSlipPage({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { passSlip } = usePassSlipStore((state) => ({
    passSlip: state.passSlip,
  }));

  return (
    employeeDetails && (
      <>
        <Head>
          <title>Employee Pass Slips</title>
        </Head>
        <PassSlipPdf
          employeeDetails={employeeDetails}
          passSlipDetails={passSlip}
        />
        ;
      </>
    )
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const employeeDetails = employeeDummy;

  return { props: { employeeDetails } };
};

// export const getServerSideProps: GetServerSideProps = withSession(
//   async (context: GetServerSidePropsContext) => {
//     const employeeDetails = getUserDetails();

//     return { props: { employeeDetails } };
//   }
// );
