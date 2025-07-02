/* eslint-disable @nx/enforce-module-boundaries */
import { useRouter } from 'next/router';
import { HiOutlineBell, HiOutlineHome, HiOutlineNewspaper, HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { ProfileMenuDropdown } from './ProfileMenuDropdown';
import { SideNavLink } from './SideNavLink';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useEffect, useState } from 'react';
import { ManagerMenuDropdown } from './ManagerMenuDropdown';
import { GeneralManagerMenuDropdown } from './GeneralManagerMenuDropdown';
import { CommitteeMenuDropdown } from './CommitteeMenuDropdown';
import { isEmpty, isEqual } from 'lodash';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { HRMenuDropdown } from './HRMenuDropdown';
import { EmployeeDetails } from 'apps/portal/src/types/employee.type';
import { useApprovalStore } from '../../../store/approvals.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEmployeeStore } from '../../../store/employee.store';
import { SalaryGradeConverter } from 'libs/utils/src/lib/functions/SalaryGradeConverter';
import { useFinalLeaveApprovalStore } from '../../../store/final-leave-approvals.store';
import { usePrfStore } from '../../../store/prf.store';
import { useAppSelectionStore } from '../../../store/selection.store';
import { useAppEndStore } from '../../../store/endorsement.store';
import { useInboxStore } from '../../../store/inbox.store';
import { NomineeStatus } from 'libs/utils/src/lib/enums/training.enum';
import { usePdcApprovalsStore } from 'apps/portal/src/store/pdc-approvals.store';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import { ManualMenuDropdown } from './ManualMenuDropDown';

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

  const { getPendingApprovalsCount, getPendingApprovalsCountSuccess, getPendingApprovalsCountFail } = useApprovalStore(
    (state) => ({
      getPendingApprovalsCount: state.getPendingApprovalsCount,
      getPendingApprovalsCountSuccess: state.getPendingApprovalsCountSuccess,
      getPendingApprovalsCountFail: state.getPendingApprovalsCountFail,
    })
  );

  const { employeeSalaryGrade, setEmployeeSalaryGrade } = useEmployeeStore((state) => ({
    employeeSalaryGrade: state.employeeSalaryGrade,
    setEmployeeSalaryGrade: state.setEmployeeSalaryGrade,
  }));

  //Manager Approval
  const {
    patchResponsePassSlip,
    patchResponseAccomplishment,
    patchResponseOvertime,
    patchResponseLeave,
    patchResponseDtrCorrection,
  } = useApprovalStore((state) => ({
    patchResponsePassSlip: state.response.patchResponsePassSlip,
    patchResponseAccomplishment: state.response.patchResponseAccomplishment,
    patchResponseOvertime: state.response.patchResponseOvertime,
    patchResponseLeave: state.response.patchResponseLeave,
    patchResponseDtrCorrection: state.response.patchResponseDtrCorrection,
  }));

  //PDC Approval
  const { patchResponsePdc } = usePdcApprovalsStore((state) => ({
    patchResponsePdc: state.response.patchResponseApply,
  }));

  //Final Leave Approval
  const { patchResponseFinalLeaveApproval } = useFinalLeaveApprovalStore((state) => ({
    patchResponseFinalLeaveApproval: state.response.patchResponseLeave,
  }));

  //PRF
  const { patchResponsePrf } = usePrfStore((state) => ({
    patchResponsePrf: state.response.patchResponse,
  }));

  //Applicant Endorsement
  const { updateResponseAppEnd } = useAppEndStore((state) => ({
    updateResponseAppEnd: state.publicationResponse.updateResponse,
  }));

  //Applicant Selection
  const { patchResponseAppSelection } = useAppSelectionStore((state) => ({
    patchResponseAppSelection: state.response.patchResponseApply,
  }));

  //GM Applicant Selection
  const { patchResponseApplicantSelection } = useAppSelectionStore((state) => ({
    patchResponseApplicantSelection: state.response.patchResponseApply,
  }));

  //Training Nomination
  const { postResponseTrainingNomination } = useTrainingSelectionStore((state) => ({
    postResponseTrainingNomination: state.response.postResponseApply,
  }));

  // const pendingApprovalsCountUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/stats/${employeeDetails.employmentDetails.userId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter
  const pendingApprovalsCountUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/stats-notifications`;

  const {
    data: swrPendingApprovalsCount,
    isLoading: swrPendingApprovalsCountIsLoading,
    error: swrPendingApprovalsCountError,
    mutate: mutateApprovalCounts,
  } = useSWR(pendingApprovalsCountUrl, fetchWithToken, {
    // shouldRetryOnError: true,
    // revalidateOnFocus: false,
    // onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    //   // Only retry up to 10 times.
    //   if (retryCount >= 1) return;
    // },
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

  useEffect(() => {
    if (employeeDetails) {
      //convert salary grade to number
      const finalSalaryGrade = SalaryGradeConverter(employeeDetails.employmentDetails.salaryGrade);
      setEmployeeSalaryGrade(finalSalaryGrade);
    }
  }, [employeeDetails]);

  useEffect(() => {
    mutateApprovalCounts();
  }, [
    patchResponsePassSlip,
    patchResponseAccomplishment,
    patchResponseOvertime,
    patchResponseLeave,
    patchResponseDtrCorrection,
    patchResponseFinalLeaveApproval,
    patchResponsePrf,
    patchResponseApplicantSelection,
    updateResponseAppEnd,
    patchResponseAppSelection,
    patchResponsePdc,
    postResponseTrainingNomination,
  ]);

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

    emptyResponseAndError,
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

    emptyResponseAndError: state.emptyResponseAndError,
  }));

  //For Inbox Notification - red dot
  const [currentPendingPsbCount, setcurrentPendingPsbCount] = useState<number>(0);
  const [currentPendingTrainingCount, setcurrentPendingTrainingCount] = useState<number>(0);

  const unacknowledgedPsbUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/vacant-position-postings/psb/schedules/${employeeDetails.employmentDetails.userId}/unacknowledged`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrPsbMessages,
    isLoading: swrIsLoadingPsbMessages,
    error: swrPsbMessageError,
    mutate: mutatePsbMessages,
  } = useSWR(
    Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ? unacknowledgedPsbUrl : null,
    fetchWithToken,
    {}
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoadingPsbMessages) {
      getPsbMessageList(swrIsLoadingPsbMessages);
    }
  }, [swrIsLoadingPsbMessages]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPsbMessages)) {
      getPsbMessageListSuccess(swrIsLoadingPsbMessages, swrPsbMessages);
    }

    if (!isEmpty(swrPsbMessageError)) {
      getPsbMessageListFail(swrIsLoadingPsbMessages, swrPsbMessageError.message);
    }
  }, [swrPsbMessages, swrPsbMessageError]);

  //count any pending psb inbox action
  useEffect(() => {
    let pendingPsb = [];
    pendingPsb = swrPsbMessages?.filter((e) => !e.details.acknowledgedSchedule && !e.details.declinedSchedule);
    setcurrentPendingPsbCount(pendingPsb?.length);
  }, [patchResponseApply, swrPsbMessages]);

  const trainingMessagesUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/employees/${employeeDetails.employmentDetails.userId}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrTrainingMessages,
    isLoading: swrIsLoadingTrainingMessages,
    error: swrTrainingMessageError,
    mutate: mutateTrainingMessages,
  } = useSWR(employeeDetails.employmentDetails.userId ? trainingMessagesUrl : null, fetchWithToken, {});

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoadingTrainingMessages) {
      getTrainingMessageList(swrIsLoadingTrainingMessages);
    }
  }, [swrIsLoadingTrainingMessages]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrTrainingMessages)) {
      getTrainingMessageListSuccess(swrIsLoadingTrainingMessages, swrTrainingMessages);
    }

    if (!isEmpty(swrTrainingMessageError)) {
      getTrainingMessageListFail(swrIsLoadingTrainingMessages, swrTrainingMessageError.message);
    }
  }, [swrTrainingMessages, swrTrainingMessageError]);

  useEffect(() => {
    let pendingTraining = [];
    pendingTraining = swrTrainingMessages?.filter((e) => e.nomineeStatus === NomineeStatus.PENDING);
    setcurrentPendingTrainingCount(pendingTraining?.length);
  }, [putResponseApply, swrTrainingMessages]);

  useEffect(() => {
    mutatePsbMessages();
    mutateTrainingMessages();
  }, [patchResponseApply, putResponseApply]);

  return (
    <>
      {/* Approval List Load Failed Error */}
      {/* {!isEmpty(errorPendingApprovalsCount) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorPendingApprovalsCount}: Failed to load Pending Approval Count.`}
        />
      ) : null} */}

      <nav className="fixed z-20 flex justify-start lg:justify-center w-screen lg:w-24 h-auto">
        <ul className="z-40 flex flex-col items-center gap-2 text-gray-600 mt-14">
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
                </>
              ) : null}

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
                employeeSalaryGrade >= 16 ||
                employeeDetails.employmentDetails.userId === 'af7bbec8-b26e-11ed-a79b-000c29f95a80' ? (
                  <>
                    <li className="ml-10 lg:ml-0">
                      <ManagerMenuDropdown
                        userRole={employeeDetails.employmentDetails.userRole}
                        salaryGrade={employeeSalaryGrade}
                        officerOfTheDay={employeeDetails.employmentDetails.officerOfTheDay}
                        employeeId={employeeDetails.employmentDetails.userId}
                        right
                      />
                    </li>
                  </>
                ) : null
              }

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

              {/* PSB / OVERTIME SUPERVISOR / PDC */}
              {Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ||
              employeeDetails.employmentDetails.overtimeImmediateSupervisorId != null ||
              (!isEqual(employeeDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE) &&
                !isEqual(employeeDetails.employmentDetails.userRole, UserRole.JOB_ORDER) &&
                !isEqual(employeeDetails.employmentDetails.userRole, UserRole.COS) &&
                !isEqual(employeeDetails.employmentDetails.userRole, UserRole.COS_JO)) ? (
                <li className="ml-10 lg:ml-0">
                  <CommitteeMenuDropdown right />
                </li>
              ) : null}

              <div>
                <SideNavLink
                  icon={<HiOutlineBell className="w-6 h-6 text-indigo-500" />}
                  destination={`/${router.query.id}/inbox`}
                />
                {currentPendingPsbCount > 0 || currentPendingTrainingCount > 0 ? (
                  <span className="absolute w-3 h-3 -mt-8 ml-8 bg-red-600 rounded-full select-none" />
                ) : null}
              </div>

              {/* VACANCIES */}
              {!isEqual(employeeDetails.employmentDetails.userRole, UserRole.COS) ? (
                <div>
                  <SideNavLink
                    icon={<HiOutlineNewspaper className="w-6 h-6 text-indigo-500" />}
                    destination={`/${router.query.id}/vacancies`}
                  />
                </div>
              ) : null}
              {/* USER MANUAL  */}
              <li className="ml-10 lg:ml-0">
                <ManualMenuDropdown right />
              </li>
            </>
          ) : null}
        </ul>
        <div className="z-20 block lg:hidden fixed bg-white w-screen h-20 opacity-95"></div>
      </nav>
    </>
  );
};

export default SideNav;
