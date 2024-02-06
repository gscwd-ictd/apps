/* eslint-disable @nx/enforce-module-boundaries */
import { useRouter } from 'next/router';
import { HiExclamationCircle, HiOutlineBell, HiOutlineHome, HiOutlineNewspaper } from 'react-icons/hi';
import { ProfileMenuDropdown } from './ProfileMenuDropdown';
import { SideNavLink } from './SideNavLink';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useEffect, useState } from 'react';
import { ManagerMenuDropdown } from './ManagerMenuDropdown';
import { GeneralManagerMenuDropdown } from './GeneralManagerMenuDropdown';
import { CommitteeMenuDropdown } from './CommitteeMenuDropdown';
import { isEqual } from 'lodash';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { HRMenuDropdown } from './HRMenuDropdown';
import { EmployeeDetails } from 'apps/portal/src/types/employee.type';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';

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
  // const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { pendingApprovalsCount } = useApprovalStore((state) => ({
    pendingApprovalsCount: state.pendingApprovalsCount,
  }));

  return (
    <>
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
                    <GeneralManagerMenuDropdown right />
                  </li>

                  <li className="ml-10 lg:ml-0">
                    <ManagerMenuDropdown right />
                  </li>
                </>
              ) : null}

              {/* ASSISTANT GENERAL MANAGER */}
              {isEqual(employeeDetails.employmentDetails.userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
              isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ? (
                <>
                  <li className="ml-10 lg:ml-0">
                    <ManagerMenuDropdown right />
                  </li>
                </>
              ) : null}

              {/* DEPARTMENT MANAGER */}
              {isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
              isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER) ? (
                <>
                  <li className="ml-10 lg:ml-0">
                    <ManagerMenuDropdown right />
                    {pendingApprovalsCount.pendingPassSlipsCount != 0 ||
                    pendingApprovalsCount.pendingLeavesCount != 0 ||
                    pendingApprovalsCount.pendingOvertimesCount != 0 ? (
                      <HiExclamationCircle className="w-3 h-3 text-red-600 animate-ping" />
                    ) : null}
                  </li>
                </>
              ) : null}

              {/* DIVISION MANAGER */}
              {isEqual(employeeDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER) ||
              isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER) ? (
                <>
                  <li className="ml-10 lg:ml-0">
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
                    <HRMenuDropdown right />
                  </li>
                ) : null
              ) : null}

              {/* PSB / OVERTIME SUPERVISOR */}
              {Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ||
              employeeDetails.employmentDetails.overtimeImmediateSupervisorId != null ||
              (!isEqual(employeeDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE) &&
                !isEqual(employeeDetails.employmentDetails.userRole, UserRole.JOB_ORDER)) ? (
                <li className="ml-10 lg:ml-0">
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
