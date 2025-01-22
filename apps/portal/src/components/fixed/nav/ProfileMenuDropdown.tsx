/* eslint-disable @nx/enforce-module-boundaries */
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import {
  HiAcademicCap,
  HiBadgeCheck,
  HiClipboardCheck,
  HiClipboardList,
  HiClock,
  HiCollection,
  HiKey,
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineNewspaper,
  HiOutlineQuestionMarkCircle,
  HiPuzzle,
  HiUserGroup,
} from 'react-icons/hi';
import axios from 'axios';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { EmployeeDetails } from 'apps/portal/src/types/employee.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';
import { isEmpty, isEqual } from 'lodash';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import ChangePasswordModal from '../change-password/ChangePasswordModal';
import { useChangePasswordStore } from 'apps/portal/src/store/change-password.store';
import { ToastNotification } from '@gscwd-apps/oneui';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { SalaryGradeConverter } from 'libs/utils/src/lib/functions/SalaryGradeConverter';
import { useInboxStore } from 'apps/portal/src/store/inbox.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { NomineeStatus } from 'libs/utils/src/lib/enums/training.enum';

type MenuDropdownProps = {
  right?: boolean;
  className?: string;
  labelColor?: string;
  employeeDetails?: EmployeeDetails;
};

export const ProfileMenuDropdown = ({
  className,
  labelColor = 'text-white',
  right = false,
  employeeDetails,
}: MenuDropdownProps): JSX.Element => {
  // intialize royter
  const router = useRouter();
  const employeeInitials = UseNameInitials(employeeDetails.profile.firstName, employeeDetails.profile.lastName);
  // method call to handle logout action
  const handleLogout = async () => {
    // perform http request to invalidate session from the server
    // const signout = await postData(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users/web/signout`, null);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users/web/signout`, null, { withCredentials: true });
      localStorage.clear();
      // deleteCookie
    } catch (error) {}

    // remove employee object from local storage
    localStorage.removeItem('employee');

    // reload the page to redirect back to login
    router.reload();
  };
  const { windowWidth } = UseWindowDimensions();

  const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] = useState<boolean>(false);

  const { responseChangePassword, emptyResponseAndError } = useChangePasswordStore((state) => ({
    responseChangePassword: state.response.responseChangePassword,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const { pendingApprovalsCount, errorPendingApprovalsCount } = useApprovalStore((state) => ({
    pendingApprovalsCount: state.pendingApprovalsCount,
    errorPendingApprovalsCount: state.error.errorPendingApprovalsCount,
  }));

  // close Change Password Modal
  const closeChangePasswordModal = async () => {
    setChangePasswordModalIsOpen(false);
  };

  useEffect(() => {
    if (!isEmpty(responseChangePassword)) {
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    }
  }, [responseChangePassword]);

  const { employeeSalaryGrade, setEmployeeSalaryGrade } = useEmployeeStore((state) => ({
    employeeSalaryGrade: state.employeeSalaryGrade,
    setEmployeeSalaryGrade: state.setEmployeeSalaryGrade,
  }));

  useEffect(() => {
    if (employeeDetails) {
      //convert salary grade to number
      const finalSalaryGrade = SalaryGradeConverter(employeeDetails.employmentDetails.salaryGrade);
      setEmployeeSalaryGrade(finalSalaryGrade);
    }
  }, [employeeDetails]);

  //FOR INBOX NOTIF
  const {
    patchResponseApply,
    putResponseApply,
    psbMessages,
    trainingMessages,
    getPsbMessageList,
    getPsbMessageListSuccess,
    getPsbMessageListFail,

    getTrainingMessageList,
    getTrainingMessageListSuccess,
    getTrainingMessageListFail,

    emptyResponseAndErrorNotif,
  } = useInboxStore((state) => ({
    patchResponseApply: state.response.patchResponseApply,
    putResponseApply: state.response.putResponseApply,
    psbMessages: state.message.psbMessages,
    trainingMessages: state.message.trainingMessages,

    getPsbMessageList: state.getPsbMessageList,
    getPsbMessageListSuccess: state.getPsbMessageListSuccess,
    getPsbMessageListFail: state.getPsbMessageListFail,

    getTrainingMessageList: state.getTrainingMessageList,
    getTrainingMessageListSuccess: state.getTrainingMessageListSuccess,
    getTrainingMessageListFail: state.getTrainingMessageListFail,

    emptyResponseAndErrorNotif: state.emptyResponseAndError,
  }));

  //For Inbox Notification - red dot
  const [currentPendingPsbCount, setcurrentPendingPsbCount] = useState<number>(0);
  const [currentPendingTrainingCount, setcurrentPendingTrainingCount] = useState<number>(0);

  // const unacknowledgedPsbUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/psb/schedules/${employeeDetails.employmentDetails.userId}/unacknowledged`;
  // // use useSWR, provide the URL and fetchWithSession function as a parameter

  // const {
  //   data: swrPsbMessages,
  //   isLoading: swrIsLoadingPsbMessages,
  //   error: swrPsbMessageError,
  //   mutate: mutatePsbMessages,
  // } = useSWR(
  //   Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ? unacknowledgedPsbUrl : null,
  //   fetchWithToken
  // );

  // // Initial zustand state update
  // useEffect(() => {
  //   if (swrIsLoadingPsbMessages) {
  //     getPsbMessageList(swrIsLoadingPsbMessages);
  //   }
  // }, [swrIsLoadingPsbMessages]);

  // // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrPsbMessages)) {
  //     getPsbMessageListSuccess(swrIsLoadingPsbMessages, swrPsbMessages);
  //   }

  //   if (!isEmpty(swrPsbMessageError)) {
  //     getPsbMessageListFail(swrIsLoadingPsbMessages, swrPsbMessageError.message);
  //   }
  // }, [swrPsbMessages, swrPsbMessageError]);

  //count any pending psb inbox action
  useEffect(() => {
    let pendingPsb = [];
    pendingPsb = psbMessages?.filter((e) => !e.details.acknowledgedSchedule && !e.details.declinedSchedule);
    setcurrentPendingPsbCount(pendingPsb?.length);
  }, [patchResponseApply, psbMessages]);

  // const trainingMessagesUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/employees/${employeeDetails.employmentDetails.userId}`;
  // // use useSWR, provide the URL and fetchWithSession function as a parameter

  // const {
  //   data: swrTrainingMessages,
  //   isLoading: swrIsLoadingTrainingMessages,
  //   error: swrTrainingMessageError,
  //   mutate: mutateTrainingMessages,
  // } = useSWR(employeeDetails.employmentDetails.userId ? trainingMessagesUrl : null, fetchWithToken);

  // // Initial zustand state update
  // useEffect(() => {
  //   if (swrIsLoadingTrainingMessages) {
  //     getTrainingMessageList(swrIsLoadingTrainingMessages);
  //   }
  // }, [swrIsLoadingTrainingMessages]);

  // // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrTrainingMessages)) {
  //     getTrainingMessageListSuccess(swrIsLoadingTrainingMessages, swrTrainingMessages);
  //   }

  //   if (!isEmpty(swrTrainingMessageError)) {
  //     getTrainingMessageListFail(swrIsLoadingTrainingMessages, swrTrainingMessageError.message);
  //   }
  // }, [swrTrainingMessages, swrTrainingMessageError]);

  useEffect(() => {
    let pendingTraining = [];
    pendingTraining = trainingMessages?.filter((e) => e.nomineeStatus === NomineeStatus.PENDING);
    setcurrentPendingTrainingCount(pendingTraining?.length);
  }, [putResponseApply, trainingMessages]);

  // useEffect(() => {
  //   if (!isEmpty(patchResponseApply) || !isEmpty(putResponseApply)) {
  //     mutatePsbMessages();
  //     mutateTrainingMessages();
  //   }
  // }, [patchResponseApply, putResponseApply]);

  return (
    <>
      {employeeDetails ? (
        <>
          {/* Change Password Success */}
          {!isEmpty(responseChangePassword) ? (
            <ToastNotification toastType="success" notifMessage={`Employee Portal Password Changed Successfully`} />
          ) : null}

          <ChangePasswordModal
            modalState={changePasswordModalIsOpen}
            setModalState={setChangePasswordModalIsOpen}
            closeModalAction={closeChangePasswordModal}
            userEmail={employeeDetails.profile.email}
          />

          <Menu as="div" className={`z-50 -mt-10 -ml-6 fixed lg:relative lg:-mt-0 lg:ml-0 inline-block text-left`}>
            <div>
              <Menu.Button
                className={`${className} h-10 w-10 rounded bg-indigo-500 outline-none transition-colors ease-in-out hover:bg-indigo-600 `}
              >
                <p className={`text-sm font-bold ${labelColor}`}>{employeeInitials}</p>
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
                  right ? 'right-[3.5rem] translate-x-full' : 'right-0'
                } shadow-gray absolute mt-2 w-screen md:w-80 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none`}
              >
                <Menu.Item>
                  {({ active }) => (
                    <div className={`${active ? 'bg-slate-50' : null} cursor-pointer rounded-md p-5`}>
                      <div>
                        <h5 className="truncate font-semibold">
                          {`${employeeDetails.employmentDetails.employeeFullName}  
                          `}
                        </h5>
                        <p className="truncate text-xs text-gray-500">
                          {employeeDetails.employmentDetails.assignment.positionTitle}
                        </p>
                      </div>
                    </div>
                  )}
                </Menu.Item>

                <div className="max-h-[28rem] overflow-y-auto lg:overflow-y-hidden">
                  {windowWidth < 1024 ? null : (
                    <>
                      <Menu.Item>
                        <button className={`group flex w-full items-center gap-3 bg-emerald-50 px-3 py-3 text-sm`}>
                          <HiOutlineCheck className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm font-medium tracking-tight text-emerald-600">
                            Terms & Conditions
                          </span>
                        </button>
                      </Menu.Item>
                    </>
                  )}

                  {windowWidth < 1024 ? (
                    <div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-slate-100' : 'text-gray-900'
                            } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                            onClick={() => router.push(`/${router.query.id}`, undefined, { shallow: true })}
                          >
                            <HiOutlineHome className="h-5 w-5 text-slate-600" />
                            <div className="flex w-full items-end justify-between">
                              <span className="text-sm tracking-tight text-slate-500 text-left">Dashboard</span>
                            </div>
                          </button>
                        )}
                      </Menu.Item>

                      {/* GENERAL MANAGER */}
                      {isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ? (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-slate-100' : 'text-gray-900'
                                } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                                onClick={() =>
                                  router.push(`/${router.query.id}/appointing-authority-selection`, undefined, {
                                    shallow: true,
                                  })
                                }
                              >
                                <HiClipboardCheck className="h-5 w-5 text-slate-600" />
                                <div className="flex w-full items-end justify-between">
                                  <span className="text-sm tracking-tight text-slate-500 text-left">
                                    Appointing Authority Selection
                                  </span>
                                </div>
                                {isEmpty(errorPendingApprovalsCount) &&
                                pendingApprovalsCount.pendingAppointingAuthoritySelection > 0 ? (
                                  <span className="absolute w-3 h-3 right-5 z-40 bg-red-600 rounded-full select-none" />
                                ) : null}
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-slate-100' : 'text-gray-900'
                                } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                                onClick={() =>
                                  router.push(`/${router.query.id}/pdc-gm-approvals`, undefined, { shallow: true })
                                }
                              >
                                <HiAcademicCap className="w-5 h-5 text-slate-600" />
                                <div className="flex w-full items-end justify-between">
                                  <span className="text-sm tracking-tight text-slate-500 text-left">
                                    Training Approvals
                                  </span>
                                </div>
                                {isEmpty(errorPendingApprovalsCount) &&
                                pendingApprovalsCount.pendingGmApprovalCount > 0 &&
                                pendingApprovalsCount.pendingGmApprovalCount != null ? (
                                  <span className="absolute w-3 h-3 right-5 z-40 bg-red-600 rounded-full select-none" />
                                ) : null}
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : null}

                      {/* MANAGERIAL ACTIONS + Officer of the Day/SG16 */}
                      {isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER) ||
                      // Officer of the Day OR SG16+
                      employeeDetails.employmentDetails.officerOfTheDay.length > 0 ||
                      employeeSalaryGrade >= 16 ||
                      employeeDetails.employmentDetails.userId === 'af7bbec8-b26e-11ed-a79b-000c29f95a80' ? (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-slate-100' : 'text-gray-900'
                                } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                                onClick={() =>
                                  router.push(`/${router.query.id}/manager-approvals`, undefined, { shallow: true })
                                }
                              >
                                <HiBadgeCheck className="h-5 w-5 text-slate-600" />
                                <div className="flex w-full items-end justify-between">
                                  <span className="text-sm tracking-tight text-slate-500 text-left">Approvals</span>
                                </div>
                                {isEmpty(errorPendingApprovalsCount) &&
                                (pendingApprovalsCount.pendingPassSlipsCount > 0 ||
                                  pendingApprovalsCount.pendingLeavesCount > 0 ||
                                  pendingApprovalsCount.pendingOvertimesCount > 0 ||
                                  pendingApprovalsCount.pendingOvertimeAccomplishmentsApprovalCount > 0 ||
                                  pendingApprovalsCount.pendingDtrCorrectionsApprovals > 0) ? (
                                  <span className="absolute w-3 h-3 right-5 z-40 bg-red-600 rounded-full select-none" />
                                ) : null}
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : null}

                      {/* MANAGERIAL ACTIONS ONLY */}
                      {isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER) ? (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-slate-100' : 'text-gray-900'
                                } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                                onClick={() =>
                                  router.push(`/${router.query.id}/training-selection`, undefined, { shallow: true })
                                }
                              >
                                <HiAcademicCap className="h-5 w-5 text-slate-600" />
                                <div className="flex w-full items-end justify-between">
                                  <span className="text-sm tracking-tight text-slate-500 text-left">
                                    Training Attendee Selection
                                  </span>
                                </div>
                                {isEmpty(errorPendingApprovalsCount) &&
                                pendingApprovalsCount.pendingTrainingNominationCount > 0 ? (
                                  <span className="absolute w-3 h-3 right-5 z-40 bg-red-600 rounded-full select-none" />
                                ) : null}
                              </button>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-slate-100' : 'text-gray-900'
                                } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                                onClick={() => router.push(`/${router.query.id}/prf`, undefined, { shallow: true })}
                              >
                                <HiCollection className="h-5 w-5 text-slate-600" />
                                <div className="flex w-full items-end justify-between">
                                  <span className="text-sm tracking-tight text-slate-500 text-left">
                                    Position Request Form
                                  </span>
                                </div>
                                {isEmpty(errorPendingApprovalsCount) &&
                                pendingApprovalsCount.prfsForApprovalCount > 0 ? (
                                  <span className="absolute w-3 h-3 right-5 z-40 bg-red-600 rounded-full select-none" />
                                ) : null}
                              </button>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-slate-100' : 'text-gray-900'
                                } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                                onClick={() =>
                                  router.push(`/${router.query.id}/applicant-endorsement`, undefined, { shallow: true })
                                }
                              >
                                <HiClipboardList className="h-5 w-5 text-slate-600" />
                                <div className="flex w-full items-end justify-between">
                                  <span className="text-sm tracking-tight text-slate-500 text-left">
                                    Applicant Endorsement
                                  </span>
                                </div>
                                {isEmpty(errorPendingApprovalsCount) &&
                                pendingApprovalsCount.pendingApplicantEndorsementsCount > 0 ? (
                                  <span className="absolute w-3 h-3 right-5 z-40 bg-red-600 rounded-full select-none" />
                                ) : null}
                              </button>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-slate-100' : 'text-gray-900'
                                } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                                onClick={() =>
                                  router.push(`/${router.query.id}/duties-and-responsibilities`, undefined, {
                                    shallow: true,
                                  })
                                }
                              >
                                <HiPuzzle className="h-5 w-5 text-slate-600" />
                                <div className="flex w-full items-end justify-between">
                                  <span className="text-sm tracking-tight text-slate-500 text-left">
                                    Position Duties, Responsibilities & Competencies
                                  </span>
                                </div>
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : null}

                      {/* HR FINAL LEAVE APPROVAL */}
                      {isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.DIVISION_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DIVISION_MANAGER) ? (
                        employeeDetails.employmentDetails.assignment.name ===
                          'Recruitment and Personnel Welfare Division' ||
                        employeeDetails.employmentDetails.assignment.name === 'Human Resource Department' ? (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`${
                                  active ? 'bg-slate-100' : 'text-gray-900'
                                } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                                onClick={() =>
                                  router.push(`/${router.query.id}/final-leave-approvals`, undefined, { shallow: true })
                                }
                              >
                                <HiBadgeCheck className="h-5 w-5 text-slate-600" />
                                <div className="flex w-full items-end justify-between">
                                  <span className="text-sm tracking-tight text-slate-500 text-left">
                                    Final Leave Approval
                                  </span>
                                </div>
                                {isEmpty(errorPendingApprovalsCount) &&
                                pendingApprovalsCount.forHrdmApprovalLeaves > 0 ? (
                                  <span className="absolute w-3 h-3 right-5 z-40 bg-red-600 rounded-full select-none" />
                                ) : null}
                              </button>
                            )}
                          </Menu.Item>
                        ) : null
                      ) : null}

                      {employeeDetails.employmentDetails.isPdcChairman ||
                      employeeDetails.employmentDetails.isPdcSecretariat ? (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-slate-100' : 'text-gray-900'
                              } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                              onClick={() =>
                                router.push(`/${router.query.id}/pdc-approvals`, undefined, { shallow: true })
                              }
                            >
                              <HiAcademicCap className="w-5 h-5 text-slate-600" />
                              <div className="flex w-full items-end justify-between">
                                <span className="text-sm tracking-tight text-slate-500 text-left">PDC Approvals</span>
                              </div>
                              {isEmpty(errorPendingApprovalsCount) &&
                              ((pendingApprovalsCount.pendingPdcChairmanApprovalCount > 0 &&
                                pendingApprovalsCount.pendingPdcChairmanApprovalCount != null) ||
                                (pendingApprovalsCount.pendingPdcSecretariatApprovalCount > 0 &&
                                  pendingApprovalsCount.pendingPdcSecretariatApprovalCount != null)) ? (
                                <span className="absolute w-3 h-3 right-5 z-40 bg-red-600 rounded-full select-none" />
                              ) : null}
                            </button>
                          )}
                        </Menu.Item>
                      ) : null}

                      {employeeDetails.employmentDetails.overtimeImmediateSupervisorId != null ||
                      (!isEqual(employeeDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER) &&
                        !isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER) &&
                        !isEqual(employeeDetails.employmentDetails.userRole, UserRole.ASSISTANT_GENERAL_MANAGER) &&
                        !isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) &&
                        !isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) &&
                        !isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER) &&
                        !isEqual(employeeDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE) &&
                        !isEqual(employeeDetails.employmentDetails.userRole, UserRole.JOB_ORDER)) ? (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-slate-100' : 'text-gray-900'
                              } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                              onClick={() => router.push(`/${router.query.id}/overtime`, undefined, { shallow: true })}
                            >
                              <HiClock className="w-5 h-5 text-slate-600" />
                              <div className="flex w-full items-end justify-between">
                                <span className="text-sm tracking-tight text-slate-500 text-left">
                                  Overtime Application
                                </span>
                              </div>
                            </button>
                          )}
                        </Menu.Item>
                      ) : null}

                      {Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ? (
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href={`${process.env.NEXT_PUBLIC_PSB_URL}/psb/schedule`}
                              target="_blank"
                              rel="noreferrer"
                              className={`${
                                active ? 'bg-slate-100' : 'text-gray-900'
                              } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                            >
                              <HiUserGroup className="h-5 w-5 text-slate-600" />
                              <div className="flex w-full items-end justify-between">
                                <span className="text-sm tracking-tight text-slate-500 text-left">
                                  Personnel Selection Board
                                </span>
                              </div>
                            </a>
                          )}
                        </Menu.Item>
                      ) : null}

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-slate-100' : 'text-gray-900'
                            } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                            onClick={() => router.push(`/${router.query.id}/inbox`, undefined, { shallow: true })}
                          >
                            <HiOutlineBell className="h-5 w-5 text-slate-600" />
                            <div className="flex w-full items-end justify-between">
                              <span className="text-sm tracking-tight text-slate-500 text-left">Notifications</span>
                            </div>
                            {currentPendingPsbCount > 0 || currentPendingTrainingCount > 0 ? (
                              // <span className="absolute w-3 h-3 -mt-8 ml-8 bg-red-600 rounded-full select-none" />
                              <span className="absolute w-3 h-3 right-5 z-40 bg-red-600 rounded-full select-none" />
                            ) : null}
                          </button>
                        )}
                      </Menu.Item>

                      {!isEqual(employeeDetails.employmentDetails.userRole, UserRole.JOB_ORDER) &&
                      !isEqual(employeeDetails.employmentDetails.userRole, UserRole.COS) &&
                      !isEqual(employeeDetails.employmentDetails.userRole, UserRole.COS_JO) ? (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-slate-100' : 'text-gray-900'
                              } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                              onClick={() => router.push(`/${router.query.id}/vacancies`, undefined, { shallow: true })}
                            >
                              <HiOutlineNewspaper className="h-5 w-5 text-slate-600" />
                              <div className="flex w-full items-end justify-between">
                                <span className="text-sm tracking-tight text-slate-500">Vacancies</span>
                              </div>
                            </button>
                          )}
                        </Menu.Item>
                      ) : null}
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href={`${process.env.NEXT_PUBLIC_PORTAL_USER_MANUAL}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`${
                              active ? 'bg-slate-100' : 'text-gray-900'
                            } group flex w-full items-center gap-3 px-3 py-2 text-sm`}
                          >
                            <HiOutlineQuestionMarkCircle className="h-5 w-5 text-gray-600" />
                            <span className="text-sm tracking-tight text-slate-500">User Manual</span>
                          </a>
                        )}
                      </Menu.Item>
                      {isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.ASSISTANT_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_ASSISTANT_GENERAL_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.DEPARTMENT_MANAGER) ||
                      isEqual(employeeDetails.employmentDetails.userRole, UserRole.OIC_DEPARTMENT_MANAGER) ||
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
                              } group flex w-full items-center gap-3 px-3 py-2 text-sm`}
                            >
                              <HiOutlineQuestionMarkCircle className="h-5 w-5 text-gray-600" />
                              <span className="text-sm tracking-tight text-slate-500">Manager Actions User Manual</span>
                            </a>
                          )}
                        </Menu.Item>
                      ) : null}
                    </div>
                  ) : null}

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-slate-100' : 'text-gray-900'
                        } group flex w-full items-center gap-3 px-3 py-3 text-sm`}
                        onClick={() => setChangePasswordModalIsOpen(true)}
                      >
                        <HiKey className="h-5 w-5 text-gray-600" />
                        <span className="text-sm tracking-tight text-slate-500">Change Password</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>

                <div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-slate-100' : 'text-gray-900'
                        } group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm`}
                        onClick={handleLogout}
                      >
                        <HiOutlineLogout className="h-5 w-5 text-rose-600" />
                        <div className="flex w-full items-end justify-between">
                          <span className="text-sm tracking-tight text-rose-500">Logout</span>
                          <p className="font-mono text-xs tracking-tighter text-gray-400">v1.0.0</p>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </>
      ) : null}
    </>
  );
};
