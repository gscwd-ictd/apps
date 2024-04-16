/* eslint-disable @nx/enforce-module-boundaries */
import { useRouter } from 'next/router';
import { HiOutlineBell, HiOutlineHome, HiOutlineNewspaper } from 'react-icons/hi';
import { ProfileMenuDropdown } from './ProfileMenuDropdown';
import { SideNavLink } from './SideNavLink';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useEffect } from 'react';
import { ManagerMenuDropdown } from './ManagerMenuDropdown';
import { GeneralManagerMenuDropdown } from './GeneralManagerMenuDropdown';
import { CommitteeMenuDropdown } from './CommitteeMenuDropdown';
import { isEmpty, isEqual } from 'lodash';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { HRMenuDropdown } from './HRMenuDropdown';
import { EmployeeDetails } from 'apps/portal/src/types/employee.type';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { ToastNotification } from '@gscwd-apps/oneui';

export type EmployeeLocalStorage = {
  employeeId: string;
  initials: string;
  name: string;
  email: string;
};

type NavDetails = {
  employeeDetails: EmployeeDetails;
};

export const SideNav = ({ employeeDetails }: NavDetails) => {
  const router = useRouter();
  const { windowWidth } = UseWindowDimensions(); //get screen width and height

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

  // const pendingApprovalsCountUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/stats/${employeeDetails.employmentDetails.userId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter
  // const pendingApprovalsCountUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/stats-notifications`;

  // const {
  //   data: swrPendingApprovalsCount,
  //   isLoading: swrPendingApprovalsCountIsLoading,
  //   error: swrPendingApprovalsCountError,
  // } = useSWR(pendingApprovalsCountUrl, fetchWithToken, {
  //   onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
  //     // Only retry up to 10 times.
  //     if (retryCount >= 1) return;
  //   },
  // });

  // // Initial zustand state update
  // useEffect(() => {
  //   if (swrPendingApprovalsCountIsLoading) {
  //     getPendingApprovalsCount(swrPendingApprovalsCountIsLoading);
  //   }
  // }, [swrPendingApprovalsCountIsLoading]);

  // // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrPendingApprovalsCount)) {
  //     getPendingApprovalsCountSuccess(swrPendingApprovalsCountIsLoading, swrPendingApprovalsCount);
  //   }

  //   if (!isEmpty(swrPendingApprovalsCountError)) {
  //     getPendingApprovalsCountFail(swrPendingApprovalsCountIsLoading, swrPendingApprovalsCountError.message);
  //   }
  // }, [swrPendingApprovalsCount, swrPendingApprovalsCountError]);

  return (
    <>
      {/* Approval List Load Failed Error */}
      {/* {!isEmpty(errorPendingApprovalsCount) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorPendingApprovalsCount}: Failed to load Pending Approval Count.`}
        />
      ) : null} */}

      <nav className="fixed z-30 flex justify-start lg:justify-center w-screen lg:w-24 h-auto">
        <ul className="z-30 flex flex-col items-center gap-2 text-gray-600 mt-14">
          <li className="mb-3 lg:mb-5 ml-10 lg:ml-0">
            <ProfileMenuDropdown right employeeDetails={employeeDetails} />
          </li>

          {windowWidth > 1024 ? (
            <>
              <SideNavLink
                icon={<HiOutlineHome className="w-6 h-6 text-indigo-500" />}
                destination={`/${router.query.id}`}
              />
              {/* GENERAL MANAGER */}
              {isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER) ||
              isEqual(employeeDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ? (
                <>
                  <li className="ml-10 lg:ml-0">
                    {isEmpty(errorPendingApprovalsCount) &&
                    pendingApprovalsCount.pendingGmApprovalCount > 0 &&
                    pendingApprovalsCount.pendingGmApprovalCount != null ? (
                      <span className="absolute w-3 h-3 mt-1 ml-8 z-50 bg-red-600 rounded-full select-none" />
                    ) : null}
                    <GeneralManagerMenuDropdown right />
                  </li>

                  <li className="ml-10 lg:ml-0">
                    {isEmpty(errorPendingApprovalsCount) &&
                    (pendingApprovalsCount.pendingPassSlipsCount > 0 ||
                      pendingApprovalsCount.pendingLeavesCount > 0 ||
                      pendingApprovalsCount.pendingOvertimesCount > 0 ||
                      pendingApprovalsCount.pendingDtrCorrectionsApprovals > 0 ||
                      // pendingApprovalsCount.pendingTrainingNominationCount > 0 ||
                      pendingApprovalsCount.prfsForApprovalCount > 0 ||
                      pendingApprovalsCount.pendingApplicantEndorsementsCount > 0) ? (
                      <span className="absolute w-3 h-3 mt-1 ml-8 z-30 bg-red-600 rounded-full select-none" />
                    ) : null}
                    <ManagerMenuDropdown right />
                  </li>
                </>
              ) : null}

              {/* ASSISTANT GENERAL MANAGER */}
              {isEqual(employeeDetails.employmentDetails.userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
              isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ? (
                <>
                  <li className="ml-10 lg:ml-0">
                    {isEmpty(errorPendingApprovalsCount) &&
                    (pendingApprovalsCount.pendingPassSlipsCount > 0 ||
                      pendingApprovalsCount.pendingLeavesCount > 0 ||
                      pendingApprovalsCount.pendingOvertimesCount > 0 ||
                      pendingApprovalsCount.pendingDtrCorrectionsApprovals > 0 ||
                      // pendingApprovalsCount.pendingTrainingNominationCount > 0 ||
                      pendingApprovalsCount.prfsForApprovalCount > 0 ||
                      pendingApprovalsCount.pendingApplicantEndorsementsCount > 0) ? (
                      <span className="absolute w-3 h-3 mt-1 ml-8 z-40 bg-red-600 rounded-full select-none" />
                    ) : null}
                    <ManagerMenuDropdown right />
                  </li>
                </>
              ) : null}

              {/* DEPARTMENT MANAGER */}
              {isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
              isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER) ? (
                <>
                  <li className="ml-10 lg:ml-0">
                    {isEmpty(errorPendingApprovalsCount) &&
                    (pendingApprovalsCount.pendingPassSlipsCount > 0 ||
                      pendingApprovalsCount.pendingLeavesCount > 0 ||
                      pendingApprovalsCount.pendingOvertimesCount > 0 ||
                      pendingApprovalsCount.pendingDtrCorrectionsApprovals > 0 ||
                      // pendingApprovalsCount.pendingTrainingNominationCount > 0 ||
                      pendingApprovalsCount.prfsForApprovalCount > 0 ||
                      pendingApprovalsCount.pendingApplicantEndorsementsCount > 0) ? (
                      <span className="absolute w-3 h-3 mt-1 ml-8 z-40 bg-red-600 rounded-full select-none" />
                    ) : null}
                    <ManagerMenuDropdown right />
                  </li>
                </>
              ) : null}

              {/* DIVISION MANAGER */}
              {isEqual(employeeDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER) ||
              isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER) ? (
                <>
                  <li className="ml-10 lg:ml-0">
                    {isEmpty(errorPendingApprovalsCount) &&
                    (pendingApprovalsCount.pendingPassSlipsCount > 0 ||
                      pendingApprovalsCount.pendingLeavesCount > 0 ||
                      pendingApprovalsCount.pendingOvertimesCount > 0 ||
                      pendingApprovalsCount.pendingDtrCorrectionsApprovals > 0 ||
                      // pendingApprovalsCount.pendingTrainingNominationCount > 0 ||
                      pendingApprovalsCount.prfsForApprovalCount > 0 ||
                      pendingApprovalsCount.pendingApplicantEndorsementsCount > 0) ? (
                      <span className="absolute w-3 h-3 mt-1 ml-8 z-40 bg-red-600 rounded-full select-none" />
                    ) : null}
                    <ManagerMenuDropdown right />
                  </li>
                </>
              ) : null}

              {/* DEPARTMENT MANAGER HR LEAVE APPROVAL */}
              {isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
              isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER) ? (
                employeeDetails.employmentDetails.assignment.name === 'Recruitment and Personnel Welfare Division' ||
                employeeDetails.employmentDetails.assignment.name === 'Human Resource Department' ? (
                  <li className="ml-10 lg:ml-0">
                    {isEmpty(errorPendingApprovalsCount) && pendingApprovalsCount.forHrdmApprovalLeaves > 0 ? (
                      <span className="absolute w-3 h-3 mt-1 ml-8 z-40 bg-red-600 rounded-full select-none" />
                    ) : null}
                    <HRMenuDropdown right />
                  </li>
                ) : null
              ) : null}

              {/* DIVISION MANAGER HR LEAVE APPROVAL */}
              {isEqual(employeeDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER) ||
              isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER) ? (
                employeeDetails.employmentDetails.assignment.name === 'Recruitment and Personnel Welfare Division' ||
                employeeDetails.employmentDetails.assignment.name === 'Human Resource Department' ? (
                  <li className="ml-10 lg:ml-0">
                    {isEmpty(errorPendingApprovalsCount) && pendingApprovalsCount.forHrdmApprovalLeaves > 0 ? (
                      <span className="absolute w-3 h-3 mt-1 ml-8 z-40 bg-red-600 rounded-full select-none" />
                    ) : null}
                    <HRMenuDropdown right />
                  </li>
                ) : null
              ) : null}

              {/* PSB / OVERTIME SUPERVISOR / PDC */}
              {Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ||
              employeeDetails.employmentDetails.overtimeImmediateSupervisorId != null ||
              (!isEqual(employeeDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE) &&
                !isEqual(employeeDetails.employmentDetails.userRole, UserRole.JOB_ORDER)) ? (
                <li className="ml-10 lg:ml-0">
                  {isEmpty(errorPendingApprovalsCount) &&
                  ((pendingApprovalsCount.pendingPdcChairmanApprovalCount > 0 &&
                    pendingApprovalsCount.pendingPdcChairmanApprovalCount != null) ||
                    (pendingApprovalsCount.pendingPdcSecretariatApprovalCount > 0 &&
                      pendingApprovalsCount.pendingPdcSecretariatApprovalCount != null)) ? (
                    <span className="absolute w-3 h-3 mt-1 ml-8 z-40 bg-red-600 rounded-full select-none" />
                  ) : null}
                  <CommitteeMenuDropdown right />
                </li>
              ) : null}

              <SideNavLink
                icon={<HiOutlineBell className="w-6 h-6 text-indigo-500" />}
                destination={`/${router.query.id}/inbox`}
              />

              <SideNavLink
                icon={<HiOutlineNewspaper className="w-6 h-6 text-indigo-500" />}
                destination={`/${router.query.id}/vacancies`}
              />
            </>
          ) : null}
        </ul>
        <div className="z-20 block lg:hidden fixed bg-white w-screen h-20 opacity-95"></div>
      </nav>
    </>
  );
};

export default SideNav;
