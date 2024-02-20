/* eslint-disable @nx/enforce-module-boundaries */
import { Menu, Transition } from '@headlessui/react';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { UserRole } from 'libs/utils/src/lib/enums/user-roles.enum';
import { isEqual } from 'lodash';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import {
  HiAcademicCap,
  HiBadgeCheck,
  HiClock,
  HiOutlineBadgeCheck,
  HiOutlineIdentification,
  HiUserGroup,
} from 'react-icons/hi';

type MenuDropdownProps = {
  right?: boolean;
  className?: string;
  labelColor?: string;
};

type EmployeeDetails = {
  fullName: string;
  initials: string;
  profile: string;
};

export const CommitteeMenuDropdown = ({
  className,
  labelColor = 'text-white',
  right = false,
}: MenuDropdownProps): JSX.Element => {
  const router = useRouter();

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  return (
    <>
      <Menu as="div" className={`z-10 -mt-10 -ml-6 fixed lg:relative lg:-mt-0 lg:ml-0 inline-block text-left`}>
        <div>
          <Menu.Button
            className={`${className} h-10 w-10 rounded flex justify-center items-center bg-white outline-none transition-colors ease-in-out hover:bg-slate-200 hover:text-slate-500 `}
          >
            <HiOutlineBadgeCheck className="w-6 h-6 text-indigo-500" />
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
                      <h5 className="truncate font-semibold ">Committee Actions</h5>
                    </div>
                  </div>
                )}
              </Menu.Item>
            </div>
            <div>
              <>
                {Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ? (
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={`${process.env.NEXT_PUBLIC_PSB_URL}/psb/schedule`}
                        target="_blank"
                        rel="noreferrer"
                        className={`${
                          active ? 'bg-slate-100' : 'text-gray-900'
                        } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                      >
                        <HiUserGroup className="w-6 h-6 text-indigo-600" />
                        <span className="text-sm tracking-tight text-gray-700 text-left">
                          Personnel Selection Board
                        </span>
                      </a>
                    )}
                  </Menu.Item>
                ) : null}

                {/* show overtime application link if OT immediate supervisor or is a manager*/}
                {employeeDetails.employmentDetails.overtimeImmediateSupervisorId !== null ||
                employeeDetails.employmentDetails.overtimeImmediateSupervisorId ||
                (!isEqual(employeeDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE) &&
                  !isEqual(employeeDetails.employmentDetails.userRole, UserRole.JOB_ORDER)) ? (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-slate-100' : 'text-gray-900'
                        } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                        onClick={() => router.push(`/${router.query.id}/overtime`)}
                      >
                        <div>
                          <HiClock className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm tracking-tight text-gray-700 text-left">Overtime Application</span>
                      </button>
                    )}
                  </Menu.Item>
                ) : null}

                {/* show pdc */}
                {employeeDetails.employmentDetails.isPdcChairman ||
                employeeDetails.employmentDetails.isPdcSecretariat ? (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-slate-100' : 'text-gray-900'
                        } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                        onClick={() => router.push(`/${router.query.id}/pdc-approvals`)}
                      >
                        <div>
                          <HiAcademicCap className="w-6 h-6 text-rose-600" />
                        </div>
                        <span className="text-sm tracking-tight text-gray-700 text-left">PDC Approvals</span>
                      </button>
                    )}
                  </Menu.Item>
                ) : null}
              </>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
