/* eslint-disable @nx/enforce-module-boundaries */
import { Menu, Transition } from '@headlessui/react';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { UserRole } from 'libs/utils/src/lib/enums/user-roles.enum';
import { isEmpty, isEqual } from 'lodash';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import {
  HiAcademicCap,
  HiClock,
  HiDocumentText,
  HiOutlineBadgeCheck,
  HiOutlineQuestionMarkCircle,
  HiQuestionMarkCircle,
  HiUserGroup,
} from 'react-icons/hi';

type MenuDropdownProps = {
  right?: boolean;
  className?: string;
  labelColor?: string;
};

export const ManualMenuDropdown = ({
  className,
  labelColor = 'text-white',
  right = false,
}: MenuDropdownProps): JSX.Element => {
  const router = useRouter();
  const { employeeSalaryGrade, setEmployeeSalaryGrade } = useEmployeeStore((state) => ({
    employeeSalaryGrade: state.employeeSalaryGrade,
    setEmployeeSalaryGrade: state.setEmployeeSalaryGrade,
  }));
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  return (
    <>
      <Menu as="div" className={`z-10 -mt-10 -ml-6 fixed lg:relative lg:-mt-0 lg:ml-0 inline-block text-left`}>
        <div>
          <Menu.Button
            className={`${className} h-10 w-10 rounded flex justify-center items-center bg-white outline-none transition-colors ease-in-out hover:bg-slate-200 hover:text-slate-500 `}
          >
            <HiOutlineQuestionMarkCircle className="w-6 h-6 text-indigo-500" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {/* translate-x-full */}
          <Menu.Items
            className={`${
              right ? 'right-[2.5rem] translate-x-full' : 'right-10'
            } shadow-gray absolute mt-2 w-auto origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div>
              <Menu.Item>
                {({ active }) => (
                  <div className={`${active ? 'bg-slate-50' : null} cursor-pointer rounded-md p-4`}>
                    <div>
                      <h5 className="truncate font-semibold ">User Manuals</h5>
                    </div>
                  </div>
                )}
              </Menu.Item>
            </div>
            <div>
              <>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={`${process.env.NEXT_PUBLIC_PORTAL_USER_MANUAL}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${
                        active ? 'bg-slate-100' : 'text-gray-900'
                      } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                    >
                      <HiQuestionMarkCircle className="w-6 h-6 text-indigo-600" />
                      <span className="text-sm tracking-tight text-gray-700 text-left">
                        Employee Portal User Manual
                      </span>
                    </a>
                  )}
                </Menu.Item>

                {
                  // GENERAL MANAGER
                  isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER) ||
                  isEqual(employeeDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                  /* ASSISTANT GENERAL MANAGER */
                  isEqual(employeeDetails.employmentDetails.userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
                  isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ||
                  /* DEPARTMENT MANAGER */
                  isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
                  isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER) ||
                  /* DIVISION MANAGER */
                  isEqual(employeeDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER) ||
                  isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER) ||
                  // Officer of the Day OR SG16+
                  employeeDetails.employmentDetails.officerOfTheDay.length > 0 ||
                  employeeSalaryGrade >= 16 ? (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href={`${process.env.NEXT_PUBLIC_PORTAL_MANAGER_ACTIONS_MANUAL}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`${
                            active ? 'bg-slate-100' : 'text-gray-900'
                          } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                        >
                          <HiQuestionMarkCircle className="w-6 h-6 text-indigo-600" />
                          <span className="text-sm tracking-tight text-gray-700 text-left">
                            Manager Actions User Manual
                          </span>
                        </a>
                      )}
                    </Menu.Item>
                  ) : null
                }
              </>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
