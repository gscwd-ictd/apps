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
import React, { useEffect } from 'react';
import { employeeDummy } from '../../../../types/employee.type';
import LeavePdf from '../../../../../src/components/fixed/leaves/LeavePdf';
import { useLeaveStore } from '../../../../../src/store/leave.store';

export default function LeavePdfPage({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    leaveIndividualDetail,
    leaveId,
    loadingLeaveDetails,
    errorLeaveDetails,
    completedLeaveModalIsOpen,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    completedLeaveModalIsOpen: state.completedLeaveModalIsOpen,
  }));

  useEffect(() => {
    console.log(employeeDetails, 'test');
  }, [employeeDetails]);

  return (
    employeeDetails && (
      <>
        <Head>
          <title>Employee Leave</title>
        </Head>

        {/* <LeavePdf employeeDetails={employeeDetails} leaveDetails={leaveIndividualDetail} /> */}
      </>
    )
  );
}

export const getServerSideProps: GetServerSideProps =
  // withCookieSession
  async (context: GetServerSidePropsContext) => {
    // const employeeDetails = getUserDetails();
    const employeeDetails = employeeDummy;
    return { props: { employeeDetails } };
  };
