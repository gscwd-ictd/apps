import Head from 'next/head';
import { useEffect, useState } from 'react';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { ToastNotification } from '@gscwd-apps/oneui';
import React from 'react';
import { useApprovalStore } from '../../../store/approvals.store';
import useSWR from 'swr';
import { employeeDummy } from '../../../types/employee.type';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { TabHeader } from 'apps/portal/src/components/fixed/tab/TabHeader';
import { HiQuestionMarkCircle } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';

export default function Approvals({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    errorPendingApprovalsCount,
    pendingApprovalsCount,
    getPendingApprovalsCount,
    getPendingApprovalsCountSuccess,
    getPendingApprovalsCountFail,
  } = useApprovalStore((state) => ({
    tab: state.tab,
    errorPendingApprovalsCount: state.error.errorPendingApprovalsCount,
    pendingApprovalsCount: state.pendingApprovalsCount,
    getPendingApprovalsCount: state.getPendingApprovalsCount,
    getPendingApprovalsCountSuccess: state.getPendingApprovalsCountSuccess,
    getPendingApprovalsCountFail: state.getPendingApprovalsCountFail,
  }));
  const router = useRouter();

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);
  // set state for employee store
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails, setEmployeeDetails]);

  const pendingApprovalsCountUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/stats/${employeeDetails.employmentDetails.userId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrPendingApprovalsCount,
    isLoading: swrPendingApprovalsCountIsLoading,
    error: swrPendingApprovalsCountError,
    mutate: mutatePassSlips,
  } = useSWR(pendingApprovalsCountUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrPendingApprovalsCountIsLoading) {
      getPendingApprovalsCount(swrPendingApprovalsCountIsLoading);
    }
  }, [swrPendingApprovalsCountIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPendingApprovalsCount)) {
      getPendingApprovalsCountSuccess(swrPendingApprovalsCountIsLoading, swrPendingApprovalsCount);
    }

    if (!isEmpty(swrPendingApprovalsCountError)) {
      getPendingApprovalsCountFail(swrPendingApprovalsCountIsLoading, swrPendingApprovalsCountError.message);
    }
  }, [swrPendingApprovalsCount, swrPendingApprovalsCountError]);

  return (
    <>
      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Approvals</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        {/* Leave List Load Failed Error */}
        {!isEmpty(errorPendingApprovalsCount) ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorPendingApprovalsCount}: Failed to load Pending Approval Count.`}
          />
        ) : null}

        <MainContainer>
          <div className="w-full pl-4 pr-4 lg:pl-32 lg:pr-32">
            <ContentHeader
              title="Employee Approvals"
              subtitle="Approve Employee Pass Slips, Leaves and Overtimes"
              backUrl={`/${router.query.id}`}
            ></ContentHeader>

            <ContentBody>
              <>
                <ul className="flex flex-col md:flex-row lg:flex-col text-gray-500 w-1/2">
                  <TabHeader
                    tab={0}
                    tabIndex={1}
                    title="Pass Slip Requests"
                    icon={<HiQuestionMarkCircle size={26} />}
                    subtitle="Show all Pass Slips requests"
                    notificationCount={
                      pendingApprovalsCount.pendingPassSlipsCount != 0 ? pendingApprovalsCount.pendingPassSlipsCount : 0
                    }
                    className="bg-indigo-500"
                    onClick={() => router.push(`/${router.query.id}/manager-approvals/pass-slips`)}
                  />
                  <TabHeader
                    tab={0}
                    tabIndex={2}
                    title="Leave Requests"
                    icon={<HiQuestionMarkCircle size={26} />}
                    subtitle="Show all Leave requests"
                    notificationCount={
                      pendingApprovalsCount.pendingLeavesCount != 0 ? pendingApprovalsCount.pendingLeavesCount : 0
                    }
                    className="bg-indigo-500"
                    onClick={() => router.push(`/${router.query.id}/manager-approvals/leaves`)}
                  />
                  <TabHeader
                    tab={0}
                    tabIndex={3}
                    title="Overtime Requests"
                    icon={<HiQuestionMarkCircle size={26} />}
                    subtitle="Show all Overtime requests"
                    notificationCount={
                      pendingApprovalsCount.pendingOvertimesCount != 0 ? pendingApprovalsCount.pendingOvertimesCount : 0
                    }
                    className="bg-indigo-500"
                    onClick={() => router.push(`/${router.query.id}/manager-approvals/overtimes`)}
                  />
                </ul>
              </>
            </ContentBody>
          </div>
        </MainContainer>
      </EmployeeProvider>
    </>
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

  // check if user role is rank_and_file or job order = kick out
  if (
    employeeDetails.employmentDetails.userRole === UserRole.RANK_AND_FILE ||
    employeeDetails.employmentDetails.userRole === UserRole.JOB_ORDER
  ) {
    // if true, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${employeeDetails.user._id}`,
      },
    };
  } else {
    return { props: { employeeDetails } };
  }
});
