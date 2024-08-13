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
import React from 'react';
import { useApprovalStore } from '../../../store/approvals.store';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { TabHeader } from 'apps/portal/src/components/fixed/tab/TabHeader';
import { HiCalendar, HiClipboard, HiClock, HiDocumentText } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { SalaryGradeConverter } from 'libs/utils/src/lib/functions/SalaryGradeConverter';

export default function Approvals({
  employeeDetails,
  finalSalaryGrade,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { pendingApprovalsCount } = useApprovalStore((state) => ({
    pendingApprovalsCount: state.pendingApprovalsCount,
  }));
  const router = useRouter();

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);
  const [finalOvertimeApprovals, setFinalOvertimeApprovals] = useState<number>(0);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails, setEmployeeDetails]);

  //checking NULL for only pending OT and pending OT accomplishment counts
  // const checkNull = () => {
  //   let tempOvertimeCount;
  //   let tempOvertimeAccomplishmentCount;
  //   if (pendingApprovalsCount.pendingOvertimesCount == null) {
  //     tempOvertimeCount = 0;
  //   } else {
  //     tempOvertimeCount = pendingApprovalsCount.pendingOvertimesCount;
  //   }
  //   if (pendingApprovalsCount.pendingOvertimeAccomplishmentsApprovalCount == null) {
  //     tempOvertimeAccomplishmentCount = 0;
  //   } else {
  //     tempOvertimeAccomplishmentCount = pendingApprovalsCount.pendingOvertimeAccomplishmentsApprovalCount;
  //   }
  //   setFinalOvertimeApprovals(tempOvertimeCount + tempOvertimeAccomplishmentCount);
  // };

  // useEffect(() => {
  //   checkNull();
  // }, [pendingApprovalsCount]);

  return (
    <>
      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Approvals</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        <MainContainer>
          <div className="w-full pl-4 pr-4 lg:pl-32 lg:pr-32">
            <ContentHeader
              title="Employee Approvals"
              subtitle="Approve or Disapprove Pass Slips, Leaves, Overtimes and DTR Corrections"
              backUrl={`/${router.query.id}`}
            ></ContentHeader>

            <ContentBody>
              <ul className="flex flex-col lg:flex-col text-gray-500 w-full md:w-1/2 justify-center items-center">
                {/* show pass slip link if user is SG16+, an Officer of the Day, or not Rank and File */}
                {finalSalaryGrade >= 16 ||
                employeeDetails.employmentDetails.officerOfTheDay.length > 0 ||
                employeeDetails.employmentDetails.userId === 'af7bbec8-b26e-11ed-a79b-000c29f95a80' ||
                employeeDetails.employmentDetails.userRole !== UserRole.RANK_AND_FILE ||
                employeeDetails.employmentDetails.userRole !== UserRole.JOB_ORDER ? (
                  <TabHeader
                    tab={0}
                    tabIndex={1}
                    title="Pass Slip Requests"
                    icon={<HiDocumentText size={26} />}
                    subtitle="Show all Pass Slips requests"
                    notificationCount={
                      pendingApprovalsCount.pendingPassSlipsCount >= 0 &&
                      pendingApprovalsCount.pendingPassSlipsCount != null
                        ? pendingApprovalsCount.pendingPassSlipsCount
                        : 0
                    }
                    className="bg-indigo-500"
                    onClick={() => router.push(`/${router.query.id}/manager-approvals/pass-slips`)}
                  />
                ) : null}

                {/* show other links if user is not Rank and File */}
                {employeeDetails.employmentDetails.userRole !== UserRole.RANK_AND_FILE &&
                employeeDetails.employmentDetails.userRole !== UserRole.JOB_ORDER ? (
                  <>
                    <TabHeader
                      tab={0}
                      tabIndex={2}
                      title="Leave Requests"
                      icon={<HiCalendar size={26} />}
                      subtitle="Show all Leave requests"
                      notificationCount={
                        pendingApprovalsCount.pendingLeavesCount >= 0 &&
                        pendingApprovalsCount.pendingLeavesCount != null
                          ? pendingApprovalsCount.pendingLeavesCount
                          : 0
                      }
                      className="bg-indigo-500"
                      onClick={() => router.push(`/${router.query.id}/manager-approvals/leaves`)}
                    />
                    <TabHeader
                      tab={0}
                      tabIndex={3}
                      title="Overtime Requests"
                      icon={<HiClipboard size={26} />}
                      subtitle="Show all Overtime requests"
                      // notificationCount={finalOvertimeApprovals ?? 0}
                      notificationCount={
                        (pendingApprovalsCount.pendingOvertimesCount != null
                          ? pendingApprovalsCount.pendingOvertimesCount
                          : 0) +
                        (pendingApprovalsCount.pendingOvertimeAccomplishmentsApprovalCount != null
                          ? pendingApprovalsCount.pendingOvertimeAccomplishmentsApprovalCount
                          : 0)
                      }
                      className="bg-indigo-500"
                      onClick={() => router.push(`/${router.query.id}/manager-approvals/overtimes`)}
                    />

                    <TabHeader
                      tab={0}
                      tabIndex={4}
                      title="Time Log Requests"
                      icon={<HiClock size={26} />}
                      subtitle="Show all Time Log Correction requests"
                      notificationCount={
                        pendingApprovalsCount.pendingDtrCorrectionsApprovals >= 0 &&
                        pendingApprovalsCount.pendingDtrCorrectionsApprovals != null
                          ? pendingApprovalsCount.pendingDtrCorrectionsApprovals
                          : 0
                      }
                      className="bg-indigo-500"
                      onClick={() => router.push(`/${router.query.id}/manager-approvals/timelogs`)}
                    />
                  </>
                ) : null}
              </ul>
            </ContentBody>
          </div>
        </MainContainer>
      </EmployeeProvider>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  //convert salary grade to number
  const finalSalaryGrade = SalaryGradeConverter(employeeDetails.employmentDetails.salaryGrade);

  // check if user role is rank_and_file or job order, or not Officer of the Day or not SG16 and up = kick out
  if (
    (employeeDetails.employmentDetails.userRole === UserRole.RANK_AND_FILE ||
      employeeDetails.employmentDetails.userRole === UserRole.JOB_ORDER ||
      employeeDetails.employmentDetails.userRole === UserRole.COS ||
      employeeDetails.employmentDetails.userRole === UserRole.COS_JO) &&
    employeeDetails.employmentDetails.officerOfTheDay.length <= 0 &&
    finalSalaryGrade < 16 &&
    employeeDetails.employmentDetails.userId !== 'af7bbec8-b26e-11ed-a79b-000c29f95a80' //charlene pe
  ) {
    // if true, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${employeeDetails.user._id}`,
      },
    };
  } else {
    return { props: { employeeDetails, finalSalaryGrade } };
  }
});
