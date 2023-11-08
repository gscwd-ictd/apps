import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getUserDetails, withCookieSession } from '../../../../utils/helpers/session';
import React, { useEffect } from 'react';
import { employeeDummy } from '../../../../types/employee.type';
import LeavePdf from '../../../../../src/components/fixed/leaves/LeavePdf';
import { useLeaveStore } from '../../../../../src/store/leave.store';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import { fetchWithToken } from '../../../../../src/utils/hoc/fetcher';
import { SpinnerDotted } from 'spinners-react';
import { ToastNotification } from '@gscwd-apps/oneui';

export default function LeavePdfPage({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

  const router = useRouter();

  const leaveDetailPdf = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/details/${employeeDetails.user._id}/${router.query.leaveId}`;
  const {
    data: swrLeaveDetailsPdf,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(leaveDetailPdf, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getLeaveIndividualDetail(true);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveDetailsPdf)) {
      getLeaveIndividualDetailSuccess(swrIsLoading, swrLeaveDetailsPdf);
    }

    if (!isEmpty(swrError)) {
      getLeaveIndividualDetailFail(swrIsLoading, swrError.message);
    }
  }, [swrLeaveDetailsPdf, swrError]);

  return (
    employeeDetails &&
    leaveIndividualDetail && (
      <>
        <Head>
          <title>Employee Leave</title>
        </Head>

        {/* Individual Leave Details Load Failed Error ONGOING MODAL */}
        {!isEmpty(errorLeaveDetails) ? (
          <>
            <ToastNotification toastType="error" notifMessage={`${errorLeaveDetails}: Failed to load Leave Details.`} />
          </>
        ) : null}

        {swrIsLoading ? (
          <div className="w-full h-screen  static flex flex-col justify-center items-center place-items-center">
            <SpinnerDotted
              speed={70}
              thickness={70}
              className="w-full flex h-full transition-all "
              color="slateblue"
              size={100}
            />
          </div>
        ) : (
          <>
            <LeavePdf employeeDetails={employeeDetails} leaveDetails={swrLeaveDetailsPdf} />
          </>
        )}
      </>
    )
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  return { props: { employeeDetails } };
});
