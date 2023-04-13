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
import { useLeaveStore } from '../../../../../src/store/leave.store';

export default function PassSlipPage({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { passSlip } = usePassSlipStore((state) => ({
    passSlip: state.passSlip,
  }));

  const {
    leaveIndividualDetail,
    leaveId,
    loadingLeaveDetails,
    errorLeaveDetails,
    completedLeaveModalIsOpen,

    setLeaveId,
    getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    completedLeaveModalIsOpen: state.completedLeaveModalIsOpen,

    setLeaveId: state.setLeaveId,
    getLeaveIndividualDetail: state.getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess: state.getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail: state.getLeaveIndividualDetailFail,
  }));

  // const passSlipDetailPdf = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/details/${employeeDetails.user._id}/${router.query.passSlipId}`;
  // const {
  //   data: swrPassSlipDetailsPdf,
  //   isLoading: swrIsLoading,
  //   error: swrError,
  // } = useSWR(passSlipDetailPdf, fetchWithToken, {
  //   shouldRetryOnError: false,
  //   revalidateOnFocus: false,
  // });

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

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const employeeDetails = employeeDummy;

//   return { props: { employeeDetails } };
// };

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();

    return { props: { employeeDetails } };
  }
);
