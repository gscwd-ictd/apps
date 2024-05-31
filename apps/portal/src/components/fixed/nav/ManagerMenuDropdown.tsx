/* eslint-disable @nx/enforce-module-boundaries */
import { Menu, Transition } from '@headlessui/react';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import { OfficerOfTheDay } from 'apps/portal/src/types/employee.type';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { isEmpty, isEqual } from 'lodash';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { HiAcademicCap, HiBadgeCheck, HiClipboardList, HiCollection, HiOutlineFolder, HiPuzzle } from 'react-icons/hi';

type MenuDropdownProps = {
  right?: boolean;
  className?: string;
  labelColor?: string;
  userRole: string;
  salaryGrade: number;
  oic: Array<OfficerOfTheDay>;
};

export const ManagerMenuDropdown = ({
  className,
  labelColor = 'text-white',
  right = false,
  userRole = null,
  salaryGrade = 0,
  oic = [],
}: MenuDropdownProps): JSX.Element => {
  const { pendingApprovalsCount, errorPendingApprovalsCount } = useApprovalStore((state) => ({
    pendingApprovalsCount: state.pendingApprovalsCount,
    errorPendingApprovalsCount: state.error.errorPendingApprovalsCount,
  }));

  const router = useRouter();

  // const { employeeSalaryGrade, setEmployeeSalaryGrade } = useEmployeeStore((state) => ({
  //   employeeSalaryGrade: state.employeeSalaryGrade,
  //   setEmployeeSalaryGrade: state.setEmployeeSalaryGrade,
  // }));

  return (
    <>
      <Menu as="div" className={`z-30 -mt-10 -ml-6 fixed lg:relative lg:-mt-0 lg:ml-0 inline-block text-left`}>
        <div>
          <Menu.Button
            className={`${className} h-10 w-10 rounded flex justify-center items-center bg-white outline-none transition-colors ease-in-out hover:bg-slate-200 hover:text-slate-500 `}
          >
            {
              //red dot
              //if Manager only or Manager and is the Officer of the Day -- all notif

              // GENERAL MANAGER
              (isEqual(userRole, UserRole.OIC_GENERAL_MANAGER) ||
                isEqual(userRole, UserRole.GENERAL_MANAGER) ||
                /* ASSISTANT GENERAL MANAGER */
                isEqual(userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
                isEqual(userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ||
                /* DEPARTMENT MANAGER */
                isEqual(userRole, UserRole.DEPARTMENT_MANAGER) ||
                isEqual(userRole, UserRole.OIC_DEPARTMENT_MANAGER) ||
                /* DIVISION MANAGER */
                isEqual(userRole, UserRole.DIVISION_MANAGER) ||
                isEqual(userRole, UserRole.OIC_DIVISION_MANAGER)) &&
              isEmpty(errorPendingApprovalsCount) &&
              (pendingApprovalsCount.pendingPassSlipsCount > 0 ||
                pendingApprovalsCount.pendingLeavesCount > 0 ||
                pendingApprovalsCount.pendingOvertimesCount > 0 ||
                pendingApprovalsCount.pendingDtrCorrectionsApprovals > 0 ||
                pendingApprovalsCount.pendingTrainingNominationCount > 0 ||
                pendingApprovalsCount.prfsForApprovalCount > 0 ||
                pendingApprovalsCount.pendingApplicantEndorsementsCount > 0) ? (
                <span className="absolute w-3 h-3 -mt-5 ml-9 bg-red-600 rounded-full select-none" />
              ) : //if Officer of the Day and is Rank and File -- Approvals page notifs only
              (isEqual(userRole, UserRole.RANK_AND_FILE) || isEqual(userRole, UserRole.JOB_ORDER)) &&
                oic.length > 0 &&
                isEmpty(errorPendingApprovalsCount) &&
                (pendingApprovalsCount.pendingPassSlipsCount > 0 ||
                  pendingApprovalsCount.pendingLeavesCount > 0 ||
                  pendingApprovalsCount.pendingOvertimesCount > 0 ||
                  pendingApprovalsCount.pendingDtrCorrectionsApprovals > 0) ? (
                <span className="absolute w-3 h-3 -mt-5 ml-9 bg-red-600 rounded-full select-none" />
              ) : //if SG16 and is Rank and File -- Pass Slip Approvals page notifs only
              (isEqual(userRole, UserRole.RANK_AND_FILE) || isEqual(userRole, UserRole.JOB_ORDER)) &&
                salaryGrade >= 16 &&
                isEmpty(errorPendingApprovalsCount) &&
                pendingApprovalsCount.pendingPassSlipsCount > 0 ? (
                <span className="absolute w-3 h-3 -mt-5 ml-9 bg-red-600 rounded-full select-none" />
              ) : null
            }
            <HiOutlineFolder className="w-6 h-6 text-indigo-500" />
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
                      <h5 className="truncate font-semibold">Managerial Actions</h5>
                    </div>
                  </div>
                )}
              </Menu.Item>
            </div>
            <div>
              <>
                {
                  /*  GENERAL MANAGER */
                  isEqual(userRole, UserRole.GENERAL_MANAGER) ||
                  isEqual(userRole, UserRole.OIC_GENERAL_MANAGER) ||
                  /* ASSISTANT GENERAL MANAGER */
                  isEqual(userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
                  isEqual(userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ||
                  /* DEPARTMENT MANAGER */
                  isEqual(userRole, UserRole.DEPARTMENT_MANAGER) ||
                  isEqual(userRole, UserRole.OIC_DEPARTMENT_MANAGER) ||
                  /* DIVISION MANAGER */
                  isEqual(userRole, UserRole.DIVISION_MANAGER) ||
                  isEqual(userRole, UserRole.OIC_DIVISION_MANAGER) ||
                  // Officer of the Day OR SG16+
                  oic?.length > 0 ||
                  salaryGrade >= 16 ? (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-slate-100' : 'text-gray-900'
                          } group flex justify-between w-80 items-center gap-2 px-3 py-3 text-sm`}
                          onClick={() => router.push(`/${router.query.id}/manager-approvals`)}
                        >
                          <div className="flex gap-2">
                            <HiBadgeCheck className="w-6 h-6 text-blue-600" />
                            <span className="text-sm tracking-tight text-gray-700 text-left">Approvals</span>
                          </div>

                          {
                            //red dot
                            //if Manager only or Manager and/or is the Officer of the Day -- all notif

                            /*  GENERAL MANAGER */
                            (isEqual(userRole, UserRole.GENERAL_MANAGER) ||
                              isEqual(userRole, UserRole.OIC_GENERAL_MANAGER) ||
                              /* ASSISTANT GENERAL MANAGER */
                              isEqual(userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
                              isEqual(userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ||
                              /* DEPARTMENT MANAGER */
                              isEqual(userRole, UserRole.DEPARTMENT_MANAGER) ||
                              isEqual(userRole, UserRole.OIC_DEPARTMENT_MANAGER) ||
                              /* DIVISION MANAGER */
                              isEqual(userRole, UserRole.DIVISION_MANAGER) ||
                              isEqual(userRole, UserRole.OIC_DIVISION_MANAGER) ||
                              oic.length > 0) &&
                            isEmpty(errorPendingApprovalsCount) &&
                            (pendingApprovalsCount.pendingPassSlipsCount > 0 ||
                              pendingApprovalsCount.pendingLeavesCount > 0 ||
                              pendingApprovalsCount.pendingOvertimesCount > 0 ||
                              pendingApprovalsCount.pendingDtrCorrectionsApprovals > 0) ? (
                              <span className="absolute w-3 h-3 right-4 z-30 bg-red-600 rounded-full select-none" />
                            ) : //if SG 16 and is Rank and File -- Pass Slip Approvals page notifs only
                            (isEqual(userRole, UserRole.RANK_AND_FILE) || isEqual(userRole, UserRole.JOB_ORDER)) &&
                              salaryGrade >= 16 &&
                              isEmpty(errorPendingApprovalsCount) &&
                              pendingApprovalsCount.pendingPassSlipsCount > 0 ? (
                              <span className="absolute w-3 h-3 right-4 z-30 bg-red-600 rounded-full select-none" />
                            ) : null
                          }
                        </button>
                      )}
                    </Menu.Item>
                  ) : null
                }

                {
                  /*  GENERAL MANAGER */
                  isEqual(userRole, UserRole.GENERAL_MANAGER) ||
                  isEqual(userRole, UserRole.OIC_GENERAL_MANAGER) ||
                  /* ASSISTANT GENERAL MANAGER */
                  isEqual(userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
                  isEqual(userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ||
                  /* DEPARTMENT MANAGER */
                  isEqual(userRole, UserRole.DEPARTMENT_MANAGER) ||
                  isEqual(userRole, UserRole.OIC_DEPARTMENT_MANAGER) ||
                  /* DIVISION MANAGER */
                  isEqual(userRole, UserRole.DIVISION_MANAGER) ||
                  isEqual(userRole, UserRole.OIC_DIVISION_MANAGER) ? (
                    <>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-slate-100' : 'text-gray-900'
                            } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                            onClick={() => router.push(`/${router.query.id}/training-selection`)}
                          >
                            <div className="flex gap-2">
                              <HiAcademicCap className="w-6 h-6 text-rose-600" />
                              <span className="text-sm tracking-tight text-gray-700 text-left">
                                Training Attendee Selection
                              </span>
                            </div>
                            {isEmpty(errorPendingApprovalsCount) &&
                            pendingApprovalsCount.pendingTrainingNominationCount > 0 ? (
                              <span className="absolute w-3 h-3 right-4 z-30 bg-red-600 rounded-full select-none" />
                            ) : null}
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-slate-100' : 'text-gray-900'
                            } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                            onClick={() => router.push(`/${router.query.id}/prf`)}
                          >
                            <div className="flex gap-2">
                              <HiCollection className="w-6 h-6 text-indigo-500" />
                              <span className="text-sm tracking-tight text-gray-700 text-left">
                                Position Request Form
                              </span>
                            </div>
                            {isEmpty(errorPendingApprovalsCount) && pendingApprovalsCount.prfsForApprovalCount > 0 ? (
                              <span className="absolute w-3 h-3 right-4 z-30 bg-red-600 rounded-full select-none" />
                            ) : null}
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-slate-100' : 'text-gray-900'
                            } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                            onClick={() => router.push(`/${router.query.id}/applicant-endorsement`)}
                          >
                            <div className="flex gap-2">
                              <HiClipboardList className="w-6 h-6 text-green-600" />
                              <span className="text-sm tracking-tight text-gray-700 text-left">
                                Applicant Endorsement
                              </span>
                            </div>
                            {isEmpty(errorPendingApprovalsCount) &&
                            pendingApprovalsCount.pendingApplicantEndorsementsCount > 0 ? (
                              <span className="absolute w-3 h-3 right-4 z-30 bg-red-600 rounded-full select-none" />
                            ) : null}
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-slate-100' : 'text-gray-900'
                            } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                            onClick={() => router.push(`/${router.query.id}/duties-and-responsibilities`)}
                          >
                            <HiPuzzle className="w-6 h-6 text-orange-800" />
                            <span className="text-sm tracking-tight text-gray-700 text-left">
                              Position Duties, Responsibilities & Competencies
                            </span>
                          </button>
                        )}
                      </Menu.Item>
                    </>
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
