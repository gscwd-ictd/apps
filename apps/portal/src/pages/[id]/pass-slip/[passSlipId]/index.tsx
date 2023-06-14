import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { getUserDetails, withSession } from '../../../../utils/helpers/session';
import { usePassSlipStore } from '../../../../store/passslip.store';
import React, { useEffect } from 'react';
import { PassSlipPdfView } from '../../../../components/fixed/passslip/PassSlipPdf';
import { employeeDummy } from '../../../../../src/types/employee.type';
import { useLeaveStore } from '../../../../../src/store/leave.store';
import useSWR from 'swr';
import { fetchWithToken } from '../../../../../src/utils/hoc/fetcher';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { ToastNotification } from '@gscwd-apps/oneui';

export default function PassSlipPage({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    passSlip,
    loading,
    errorPassSlips,
    getPassSlipList,
    getPassSlipListSuccess,
    getPassSlipListFail,
    emptyResponseAndError,
  } = usePassSlipStore((state) => ({
    passSlip: state.passSlips,
    loading: state.loading.loadingPassSlips,
    errorPassSlips: state.error.errorPassSlips,

    getPassSlipList: state.getPassSlipList,
    getPassSlipListSuccess: state.getPassSlipListSuccess,
    getPassSlipListFail: state.getPassSlipListFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const router = useRouter();

  // const passSlipUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/pass-slip/${employeeDetails.employmentDetails.userId}`;
  const passSlipUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/pass-slip/details/${router.query.passSlipId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrPassSlipDetailsPdf,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutatePassSlips,
  } = useSWR(passSlipUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getPassSlipList(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPassSlipDetailsPdf)) {
      console.log(swrPassSlipDetailsPdf);
      getPassSlipListSuccess(swrIsLoading, swrPassSlipDetailsPdf);
    }

    if (!isEmpty(swrError)) {
      getPassSlipListFail(swrIsLoading, swrError.message);
    }
  }, [swrPassSlipDetailsPdf, swrError]);

  return (
    employeeDetails &&
    swrPassSlipDetailsPdf && (
      <>
        {/* Pass Slip List Load Failed Error */}
        {!isEmpty(errorPassSlips) ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorPassSlips}: Failed to load Pass Slip data.`}
          />
        ) : null}
        <Head>
          <title>Employee Pass Slips</title>
        </Head>
        <PassSlipPdfView
          employeeDetails={employeeDetails}
          passSlipDetails={swrPassSlipDetailsPdf}
        />
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
