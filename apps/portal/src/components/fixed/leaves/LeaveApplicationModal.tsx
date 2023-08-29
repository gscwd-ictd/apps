/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { postPortal } from '../../../../src/utils/helpers/portal-axios-helper';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import Calendar from './LeaveCalendar';
import { LeaveBenefitOptions } from '../../../../../../libs/utils/src/lib/types/leave-benefits.type';
import { CalendarDate, LeaveApplicationForm } from '../../../../../../libs/utils/src/lib/types/leave-application.type';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveName } from 'libs/utils/src/lib/enums/leave.enum';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';

type LeaveApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type Item = {
  label: string;
  value: string;
};

const leaveLocation: Array<SelectOption> = [
  { label: 'Within the Philippines', value: 'Philippines' },
  { label: 'Abroad (Specify)', value: 'Abroad' },
];

const leaveHospital: Array<SelectOption> = [
  {
    label: 'In Hospital (Specify Illness)',
    value: 'inHospital',
  },
  {
    label: 'Out Patient (Specify Illness)',
    value: 'outPatient',
  },
];

const leaveStudy: Array<SelectOption> = [
  {
    label: `Completion of Master's Degree`,
    value: `master`,
  },
  {
    label: 'BAR/Board Examination Review',
    value: 'bar',
  },
  { label: 'Other', value: 'other' },
];

const leaveOther: Array<SelectOption> = [
  {
    label: `Monetization of Leave Credits`,
    value: `Monetization of Leave Credits`,
  },
  {
    label: 'Terminal Leave',
    value: 'Terminal Leave',
  },
];

const leaveCommutation: Array<SelectOption> = [
  {
    label: `Not Requested`,
    value: `Not Requested`,
  },
  {
    label: 'Requested',
    value: 'Requested',
  },
];

export const LeaveApplicationModal = ({ modalState, setModalState, closeModalAction }: LeaveApplicationModalProps) => {
  // // forced leave balance
  // const [forcedLeaveBalance, setForcedLeaveBalance] = useState<number>(0);
  // // vacation leave balance
  // const [vacationLeaveBalance, setVacationLeaveBalance] = useState<number>(0);
  // // sick leave balance
  // const [sickLeaveBalance, setSickLeaveBalance] = useState<number>(0);
  // // special privilege leave balance
  // const [specialPrivilegeLeaveBalance, setSpecialPrivilegeLeaveBalance] = useState<number>(0);

  //zustand initialization to access Leave store
  const {
    pendingleavesList,
    loadingResponse,
    leaveDates,
    applyLeaveModalIsOpen,

    leaveDateFrom,
    leaveDateTo,
    overlappingLeaveCount,

    postLeave,
    postLeaveSuccess,
    postLeaveFail,

    getLeaveTypes,
    getLeaveTypesSuccess,
    getLeaveTypesFail,

    setLeaveDates,
    setLeaveDateFrom,
    setLeaveDateTo,
  } = useLeaveStore((state) => ({
    pendingleavesList: state.leaves.onGoing,
    loadingResponse: state.loading.loadingResponse,

    leaveDates: state.leaveDates,
    applyLeaveModalIsOpen: state.applyLeaveModalIsOpen,

    leaveDateFrom: state.leaveDateFrom,
    leaveDateTo: state.leaveDateTo,
    overlappingLeaveCount: state.overlappingLeaveCount,

    postLeave: state.postLeave,
    postLeaveSuccess: state.postLeaveSuccess,
    postLeaveFail: state.postLeaveFail,

    getLeaveTypes: state.getLeaveTypes,
    getLeaveTypesSuccess: state.getLeaveTypesSuccess,
    getLeaveTypesFail: state.getLeaveTypesFail,
    setLeaveDates: state.setLeaveDates,

    setLeaveDateFrom: state.setLeaveDateFrom,
    setLeaveDateTo: state.setLeaveDateTo,
  }));

  const {
    vacationLeaveBalance,
    forcedLeaveBalance,
    sickLeaveBalance,
    specialPrivilegeLeaveBalance,
    setVacationLeaveBalance,
    setForcedLeaveBalance,
    setSickLeaveBalance,
    setSpecialPrivilegeLeaveBalance,
    getLeaveLedger,
    getLeaveLedgerSuccess,
    getLeaveLedgerFail,
  } = useLeaveLedgerStore((state) => ({
    vacationLeaveBalance: state.vacationLeaveBalance,
    forcedLeaveBalance: state.forcedLeaveBalance,
    sickLeaveBalance: state.sickLeaveBalance,
    specialPrivilegeLeaveBalance: state.specialPrivilegeLeaveBalance,
    setVacationLeaveBalance: state.setVacationLeaveBalance,
    setForcedLeaveBalance: state.setForcedLeaveBalance,
    setSickLeaveBalance: state.setSickLeaveBalance,
    setSpecialPrivilegeLeaveBalance: state.setSpecialPrivilegeLeaveBalance,
    getLeaveLedger: state.getLeaveLedger,
    getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
    getLeaveLedgerFail: state.getLeaveLedgerFail,
  }));

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const [leaveReminder, setLeaveReminder] = useState<string>(
    'For leave of absence for thirty (30) calendar days or more and terminal leave, application shall be accompanied by a clearance from money, property, and work-related accountabilities (pursuant to CSC Memorandum Circular No. 2, s. 1985).'
  );
  const [finalVacationLeaveBalance, setFinalVacationLeaveBalance] = useState<number>(0);
  const [finalForcedLeaveBalance, setFinalForcedLeaveBalance] = useState<number>(0);
  const [finalSickLeaveBalance, setFinalSickLeaveBalance] = useState<number>(0);
  const [finalSpecialPrivilegekBalance, setFinalSpecialPrivilegekBalance] = useState<number>(0);
  const [leaveObject, setLeaveObject] = useState<string>('');
  const [selectedStudy, setSelectedStudy] = useState<string>('');
  const [hasPendingLeave, setHasPendingLeave] = useState<boolean>(false);

  // get the latest balance by last index value
  const getLatestBalance = (leaveLedger: Array<LeaveLedgerEntry>) => {
    const lastIndexValue = leaveLedger[leaveLedger.length - 1];
    setForcedLeaveBalance(lastIndexValue.forcedLeaveBalance);
    setVacationLeaveBalance(lastIndexValue.vacationLeaveBalance ?? 0);
    setSickLeaveBalance(lastIndexValue.sickLeaveBalance ?? 0);
    setSpecialPrivilegeLeaveBalance(lastIndexValue.specialPrivilegeLeaveBalance ?? 0);
  };

  // Set state for leave credits in table below of modal
  useEffect(() => {
    setFinalVacationLeaveBalance(vacationLeaveBalance - leaveDates.length);
    setFinalSickLeaveBalance(sickLeaveBalance - leaveDates.length);
    setFinalForcedLeaveBalance(forcedLeaveBalance - leaveDates.length);
    setFinalSpecialPrivilegekBalance(specialPrivilegeLeaveBalance - leaveDates.length);
  }, [leaveDates]);

  //fetch employee leave ledger
  const leaveLedgerUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/ledger/${employeeDetails.user._id}/${employeeDetails.profile.companyId}`;

  const {
    data: swrLeaveLedger,
    isLoading: swrLeaveLedgerLoading,
    error: swrLeaveLedgerError,
  } = useSWR(employeeDetails.user._id && employeeDetails.profile.companyId ? leaveLedgerUrl : null, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrLeaveLedgerLoading) {
      getLeaveLedger(swrLeaveLedgerLoading);
    }
  }, [swrLeaveLedgerLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveLedger)) {
      getLeaveLedgerSuccess(swrLeaveLedgerLoading, swrLeaveLedger);
      getLatestBalance(swrLeaveLedger);
    }

    if (!isEmpty(swrLeaveLedgerError)) {
      getLeaveLedgerFail(swrLeaveLedgerLoading, swrLeaveLedgerError.message);
    }
  }, [swrLeaveLedger, swrLeaveLedgerError]);

  //fetch leave benefits list
  const leaveTypeUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-benefits`;
  const {
    data: swrLeaveTypes,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(leaveTypeUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getLeaveTypes(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveTypes)) {
      getLeaveTypesSuccess(swrIsLoading, swrLeaveTypes);
    }

    if (!isEmpty(swrError)) {
      getLeaveTypesFail(swrIsLoading, swrError.message);
    }
  }, [swrLeaveTypes, swrError]);

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<LeaveApplicationForm>({
    mode: 'onChange',
    defaultValues: {
      typeOfLeaveDetails: {
        id: '',
        leaveName: '',
      },
      forMastersCompletion: null,
      forBarBoardReview: null,
      studyLeaveOther: null,
    },
  });

  const handleTypeOfLeave = (e: string) => {
    setLeaveObject(e);
    const leave = JSON.parse(e) as LeaveBenefitOptions;
    setValue('typeOfLeaveDetails', leave);
    setLeaveDateFrom(null);
    setLeaveDateTo(null);
  };

  //check if there are pending leaves of the same name being filed, return true/false
  useEffect(() => {
    if (pendingleavesList?.some((leave) => leave.leaveName === watch('typeOfLeaveDetails.leaveName'))) {
      setHasPendingLeave(true);
    } else {
      setHasPendingLeave(false);
    }
  }, [watch('typeOfLeaveDetails.leaveName')]);

  useEffect(() => {
    setValue('employeeId', employeeDetails.employmentDetails.userId);
  }, [leaveObject]);

  const handleStudy = (e: string) => {
    setSelectedStudy(e);
    if (e === `master`) {
      setValue('forMastersCompletion', true);
      setValue('forBarBoardReview', null);
      setValue('studyLeaveOther', null);
    } else if (e === `bar`) {
      setValue('forMastersCompletion', null);
      setValue('forBarBoardReview', true);
      setValue('studyLeaveOther', null);
    } else {
      setValue('forMastersCompletion', null);
      setValue('forBarBoardReview', null);
    }
  };

  useEffect(() => {
    setValue('leaveApplicationDates', leaveDates);
  }, [leaveDates]);

  useEffect(() => {
    setValue('leaveApplicationDatesRange.from', leaveDateFrom);
  }, [leaveDateFrom]);

  useEffect(() => {
    setValue('leaveApplicationDatesRange.to', leaveDateTo);
  }, [leaveDateTo]);

  useEffect(() => {
    if (!applyLeaveModalIsOpen) {
      reset();
      setLeaveObject('');
    }
  }, [applyLeaveModalIsOpen]);

  const onSubmit: SubmitHandler<LeaveApplicationForm> = (data: LeaveApplicationForm) => {
    let dataToSend;
    if (
      data.typeOfLeaveDetails.leaveName === LeaveName.VACATION ||
      data.typeOfLeaveDetails.leaveName === LeaveName.SPECIAL_PRIVILEGE
    ) {
      if (data.inPhilippinesOrAbroad === 'Philippines') {
        dataToSend = {
          leaveBenefitsId: data.typeOfLeaveDetails.id,
          employeeId: data.employeeId,
          inPhilippines: data.location,
          leaveApplicationDates: data.leaveApplicationDates,
        };
      } else {
        dataToSend = {
          leaveBenefitsId: data.typeOfLeaveDetails.id,
          employeeId: data.employeeId,
          abroad: data.location,
          leaveApplicationDates: data.leaveApplicationDates,
        };
      }
    } else if (data.typeOfLeaveDetails.leaveName === LeaveName.SICK) {
      if (data.hospital === 'inHospital') {
        dataToSend = {
          leaveBenefitsId: data.typeOfLeaveDetails.id,
          employeeId: data.employeeId,
          inHospital: data.illness,
          leaveApplicationDates: data.leaveApplicationDates,
        };
      } else {
        dataToSend = {
          leaveBenefitsId: data.typeOfLeaveDetails.id,
          employeeId: data.employeeId,
          outPatient: data.illness,
          leaveApplicationDates: data.leaveApplicationDates,
        };
      }
    } else if (data.typeOfLeaveDetails.leaveName === LeaveName.STUDY) {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        employeeId: data.employeeId,
        leaveApplicationDates: data.leaveApplicationDatesRange,
        forMastersCompletion: data.forMastersCompletion,
        forBarBoardReview: data.forBarBoardReview,
        studyLeaveOther: data.studyLeaveOther,
      };
    } else if (data.typeOfLeaveDetails.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN) {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        employeeId: data.employeeId,
        leaveApplicationDates: data.leaveApplicationDatesRange,
        splWomen: data.specialLeaveWomenIllness,
      };
    } else if (
      data.typeOfLeaveDetails.leaveName === LeaveName.MATERNITY ||
      data.typeOfLeaveDetails.leaveName === LeaveName.STUDY ||
      data.typeOfLeaveDetails.leaveName === LeaveName.REHABILITATION ||
      data.typeOfLeaveDetails.leaveName === LeaveName.ADOPTION
    ) {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        employeeId: data.employeeId,
        leaveApplicationDates: data.leaveApplicationDatesRange,
      };
    } else if (data.typeOfLeaveDetails.leaveName === LeaveName.OTHERS) {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        employeeId: data.employeeId,
        leaveApplicationDates: data.leaveApplicationDates,
        other: data.other,
        commutation: data.commutation ? data.commutation : null,
      };
    } else {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        employeeId: data.employeeId,
        leaveApplicationDates: data.leaveApplicationDates,
      };
    }
    //check first if leave dates or leave date range are filled
    if (
      (!isEmpty(watch('leaveApplicationDates')) &&
        watch('typeOfLeaveDetails.leaveName') !== LeaveName.MATERNITY &&
        watch('typeOfLeaveDetails.leaveName') !== LeaveName.STUDY &&
        watch('typeOfLeaveDetails.leaveName') !== LeaveName.REHABILITATION &&
        watch('typeOfLeaveDetails.leaveName') !== LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN &&
        watch('typeOfLeaveDetails.leaveName') !== LeaveName.ADOPTION) ||
      (!isEmpty(watch('leaveApplicationDatesRange')) &&
        (watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY ||
          watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY ||
          watch('typeOfLeaveDetails.leaveName') === LeaveName.REHABILITATION ||
          watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
          watch('typeOfLeaveDetails.leaveName') === LeaveName.ADOPTION))
    ) {
      handlePostResult(dataToSend);
      postLeave();
    }
  };

  const handlePostResult = async (data: LeaveApplicationForm) => {
    const { error, result } = await postPortal('/v1/leave-application', data);

    if (error) {
      postLeaveFail(result);
    } else {
      postLeaveSuccess(result);
      reset();
      setLeaveObject('');
      closeModalAction();
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Leave Application</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {/* Notifications */}
          {loadingResponse ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}
          <form id="ApplyLeaveForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full h-full flex flex-col gap-2 ">
              <div className="w-full flex flex-col gap-2 p-4 rounded">
                <div className="w-full flex flex-col gap-0">
                  {/* Has Existing Pending Leave of the Same Name - cannot file a new one */}
                  {hasPendingLeave ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="You have a pending leave application of the same type"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Female Specific Leave Benefit Notification */}
                  {employeeDetails.profile.sex === 'Male' &&
                  (watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.VAWC ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN) ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="You are not allowed to file this type of leave"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Male Specific Leave Benefit Notification */}
                  {employeeDetails.profile.sex === 'Female' &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.PATERNITY ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="You are not allowed to file this type of leave"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Notifications */}
                  {isEmpty(leaveDates) &&
                  !isEmpty(watch('typeOfLeaveDetails.leaveName')) &&
                  watch('typeOfLeaveDetails.leaveName') !== LeaveName.MATERNITY &&
                  watch('typeOfLeaveDetails.leaveName') !== LeaveName.STUDY &&
                  watch('typeOfLeaveDetails.leaveName') !== LeaveName.REHABILITATION &&
                  watch('typeOfLeaveDetails.leaveName') !== LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN &&
                  watch('typeOfLeaveDetails.leaveName') !== LeaveName.ADOPTION ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Please select date of leave"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                  {/* Notifications */}
                  {leaveDateTo < leaveDateFrom &&
                  (watch('typeOfLeaveDetails.leaveName') == LeaveName.MATERNITY ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.STUDY ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.REHABILITATION ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.ADOPTION) ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Please select an acceptable date of leave"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                  {/* Vacation Leave Credits Notifications */}
                  {finalVacationLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Insufficient Vacation Leave Credits"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                  {/* Vacation Leave Credits Notifications */}
                  {finalForcedLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Insufficient Forced Leave Credits"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                  {/* Sick Leave Credits Notifications */}
                  {finalSickLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Insufficient Sick Leave Credits"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                  {/* Special Privilege Leave Credits Notifications */}
                  {finalSpecialPrivilegekBalance < 0 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Insufficient Special Privilege Leave Credits"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                  {/* Overlapping Leaves Notifications */}
                  {overlappingLeaveCount > 0 &&
                  (watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.REHABILITATION ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.ADOPTION) ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="There are overlapping leaves in your application"
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-1">
                  <div className="flex flex-row justify-between items-center w-full">
                    <label className="pt-2 text-slate-500 text-md font-medium">Leave Type:</label>
                    {swrIsLoading ? <LoadingSpinner size="xs" /> : null}
                  </div>

                  <div className="flex gap-2 w-full items-center">
                    <select
                      className="text-slate-500 w-full h-14 rounded text-md border-slate-300"
                      required
                      defaultValue={''}
                      onChange={(e) => handleTypeOfLeave(e.target.value as unknown as string)}
                    >
                      <option value="" disabled>
                        Select Type Of Leave:
                      </option>
                      {
                        // typeOfLeave
                        swrLeaveTypes
                          ? swrLeaveTypes.map((item: LeaveBenefitOptions, idx: number) => (
                              <option value={`{"id":"${item.id}", "leaveName":"${item.leaveName}"}`} key={idx}>
                                {item.leaveName}
                              </option>
                            ))
                          : null
                      }
                    </select>
                  </div>
                </div>

                <div>
                  {watch('typeOfLeaveDetails.leaveName') ? (
                    <div className="flex flex-col gap-1 w-full bg-slate-100 text-sm p-2">
                      <span className="font-bold">{watch('typeOfLeaveDetails.leaveName')}</span>
                      <span>
                        {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION
                          ? 'It shall be filed five(5) days in advance, whenever possible, of the effective date of such leave. Vacation leave within the Phillipines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from the money and work accountabilities.'
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED
                          ? 'Annual five-day vacatuin leave shall be forfeited if not taken during the year. In case the scheduled leave has been cancelled in the exigency of the service by the head of agency, it shall no longer be deducted from the accumulated vacation leave. Availment of one (1) day or more Vacation Leave (VL) shall be considered for complying the mandatory/forced leave subject to the conditions under Section 25, Rule XVI of the Omnibus Rules Implementing E.O. No. 292.'
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK
                          ? `It shall be filed immediately upon employee's return from such leave. If filed in advance or exceeding the five (5) days, application shall be accompanied by a medical certificate. In case medical consultation was not availed of, an affidavit should be executed by an applicant.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY
                          ? `Proof of pregnancy e.g. ultrasound, doctor's certificate on the expected data of delivery. Accomplished Notice of Allocation of Maternity Leave Credits (CS Form No. 6a), if needed. Seconded female employees shall enjoy maternity leave with full pay in the recipient agency.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.PATERNITY
                          ? `Proof of child's delivery e.g. birth certificate, medical certificate and marriage contract.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                          ? `It shall be filed/approved for at least one (1) week prior to availment, except on emergency cases. Special privilege leave within the Philippines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from money and work accountabilities.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.SOLO_PARENT
                          ? `It shall be filed in advance or whenever possible five (5) days before going on such leave with updated Solo Parent Identification Card.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY
                          ? `Shall meet the agency's internal requirements, if any; Contract between the agency head or authorized representative and the employee concerned.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.VAWC
                          ? `It shall be filed in advance or immediately upon the woman employee's return from such leave. It shall be accompanied by any of the following supporting documents: a. Barangay Protection Order (BPO) obtained from the barangay; b. Temporary/Permanent Protection Order (TPO/PPO) obtained from the court; c. If the protection order is not yet issued by the barangay or the court, a certification issued by the Punong Barangay/Kagawad or Prosecutor or the Clerk of Court that the application for the BPO, TPO, or PPO has been filed with the said office shall be sufficient to support the application for the ten-day leave; or d. In the absence of the BPO/TPO/PPO or the certification, a police report specifying the details of the occurence of violence on the victim and medical certificate may be considered, at the discretion of the immediate supervisor of the woman employee concerned.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.REHABILITATION
                          ? `Application shall be made within one (1) week from the time of the accident except when a longer period is warranted. Letter request supported by relevant reports such as the police report, if any. Medical certificate on the nature of the injuries, the course of treatment involved, and the need to undergo rest, recuperation, and rehabilitation, as the case may be. Written concurrence of a government physician should be obtained relative to the recommendation for rehabilitation if the attending physician is a private practitioner, praticularly on the duration of the period of rehabilitation.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                          ? `The application may be filed in advance, that is, at least five (5) days prior to the scheduled date of the gynecological surgery that will be undergone by the employee. In case of emergency, the application for special leave shall be filed immediately upon employee's return but during confinement the agency shall be notified of said surgery. The application shall be accompanied by a medical certificate filled out by the proper medical authorities, e.g. the attending surgeon accompanied by a clinical summary reflecting the gynecological disorder which shall be addressed or was addressed by the said surgery; the histopathological report; the operative technique used for the surgery; the duration of the surgery including the perioperative period (period of confinement around surgery); as well as the employee's estimate period of recuperation of the same.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_EMERGENCY_CALAMITY
                          ? `The special emergency leave can be applied for a maximum of five (5) straight working days or staggered basis within thirty (30) days from the actual occurence of the natural calamity/disaster. Said privilege shall be enjoyed once a year, not in every instance of calamity or disaster. The head of office shall take full responsibility for teh grant of special emergency leave and verification of teh employee's eligibility to be granted thereof. Said verification shall include: validation of place of residence based on latest available records of the affected employee; verification that the place of residence is covered in the declaration of calamity area by the proper government agency, and such other proofs as may be necessary.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.ADOPTION
                          ? `Application for adoption leave shall be filed with an authenticated copy of the Pre-Adoptive Placement Authority issued by the Department of Scoial Welfare and Development (DSWD).`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.OTHERS
                          ? `For Monetization of Leave Credits, application for monetization of fifthy percent (50%) or more of the accumulated leave credits shall be accompanied by letter request to the head of the agency stating the valid and justifiable reasons. For Terminal Leave, proof of employee's resignation or retirement or separation from the service.`
                          : ``}
                      </span>
                    </div>
                  ) : null}
                </div>

                {watch('typeOfLeaveDetails.leaveName') ? (
                  <>
                    {/* <label className="-mb-2 text-slate-500 text-xl font-medium w-full">
                      Details of Leave:
                    </label> */}
                    <div className="flex flex-col md:flex-row justify-between items-center w-full">
                      <div className="flex flex-row justify-between items-center w-full">
                        <label className="pt-2 text-slate-500 text-md font-medium">
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                          watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                            ? 'Location:'
                            : watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK
                            ? 'Hospitalization:'
                            : watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY
                            ? 'Study:'
                            : watch('typeOfLeaveDetails.leaveName') === LeaveName.OTHERS
                            ? 'Other Purpose: '
                            : null}
                        </label>
                      </div>

                      <div className="flex gap-2 w-full items-center">
                        {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE ? (
                          <>
                            <select
                              id="inPhilippinesOrAbroad"
                              className="text-slate-500 w-full h-14 rounded text-md border-slate-300"
                              required
                              defaultValue={''}
                              {...register('inPhilippinesOrAbroad')}
                            >
                              <option value="" disabled>
                                Select Location:
                              </option>
                              {leaveLocation.map((item: Item, idx: number) => (
                                <option value={item.value} key={idx}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : null}

                        {watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ? (
                          <>
                            <select
                              id="hospital"
                              className="text-slate-500 w-full h-16 rounded text-md border-slate-300"
                              required
                              defaultValue={''}
                              {...register('hospital')}
                            >
                              <option value="" disabled>
                                Select Hosptitalization:
                              </option>
                              {leaveHospital.map((item: Item, idx: number) => (
                                <option value={item.value} key={idx}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : null}

                        {watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY ? (
                          <>
                            <select
                              id="study"
                              className="text-slate-500 w-full h-16 rounded text-md border-slate-300"
                              required
                              defaultValue={''}
                              // {...register('study')}
                              onChange={(e) => handleStudy(e.target.value as unknown as string)}
                            >
                              <option value="" disabled>
                                Select Study Purpose:
                              </option>
                              {leaveStudy.map((item: Item, idx: number) => (
                                <option value={item.value} key={idx}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : null}

                        {watch('typeOfLeaveDetails.leaveName') === LeaveName.OTHERS ? (
                          <>
                            <select
                              id="others"
                              className="text-slate-500 w-full h-16 rounded text-md border-slate-300"
                              required
                              defaultValue={''}
                              {...register('other')}
                            >
                              <option value="" disabled>
                                Select Other:
                              </option>
                              {leaveOther.map((item: Item, idx: number) => (
                                <option value={item.value} key={idx}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {watch('typeOfLeaveDetails.leaveName') === LeaveName.OTHERS &&
                    watch('other') === 'Monetization of Leave Credits' ? (
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                          <label className="pt-2 text-slate-500 text-md font-medium">Commutation</label>
                        </div>

                        <div className="flex gap-2 w-full items-center">
                          {watch('other') === 'Monetization of Leave Credits' ? (
                            <div className="w-full">
                              <select
                                id="commutation"
                                className="text-slate-500 w-full h-16 rounded text-md border-slate-300"
                                required
                                defaultValue={''}
                                {...register('commutation')}
                              >
                                <option value="" disabled>
                                  Select Other:
                                </option>
                                {leaveCommutation.map((item: Item, idx: number) => (
                                  <option value={item.value} key={idx}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    (watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY && selectedStudy === 'other') ? (
                      <textarea
                        {...(watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                          ? { ...register('location') }
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK
                          ? { ...register('illness') }
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY
                          ? { ...register('studyLeaveOther') }
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                          ? { ...register('specialLeaveWomenIllness') }
                          : null)}
                        required
                        rows={3}
                        placeholder={`${
                          watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                          watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                            ? 'Specify Leave Details'
                            : watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ||
                              watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                            ? 'Specify Illness'
                            : watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY && selectedStudy === 'other'
                            ? 'Specify Study Leave Purpose'
                            : 'Specify Leave Details'
                        }`}
                        className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                      ></textarea>
                    ) : null}
                  </>
                ) : null}

                {watch('typeOfLeaveDetails.leaveName') ? (
                  <>
                    <label className="text-slate-500 text-md font-medium">Select Leave Dates:</label>

                    <div className="w-full p-4 bg-gray-50 rounded">
                      {watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY ||
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY ||
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.REHABILITATION ||
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.ADOPTION ? (
                        <Calendar type={'range'} clickableDate={true} />
                      ) : (
                        <Calendar type={'single'} clickableDate={true} />
                      )}
                    </div>
                  </>
                ) : null}

                <div className="w-full pb-4 pt-2">
                  <span className="text-slate-500 text-md font-medium">Your current Leave Credits:</span>
                  <table className="bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md table-fixed">
                    <tbody>
                      <tr className="border border-slate-400">
                        <td className="border border-slate-400"></td>
                        <td className="border border-slate-400 text-center text-sm p-1">Vacation</td>
                        <td className="border border-slate-400 text-center text-sm p-1">Forced</td>
                        <td className="border border-slate-400 text-center text-sm p-1">Sick</td>
                        <td className="border border-slate-400 text-center text-sm p-1">
                          <label className="hidden sm:block">Special Privilege</label>
                          <label className="block sm:hidden">SPL</label>
                        </td>
                      </tr>
                      <tr className="border border-slate-400">
                        <td className="border border-slate-400 text-sm p-1">Total Earned</td>
                        <td className="border border-slate-400 p-1 text-center text-sm">{vacationLeaveBalance}</td>
                        <td className="border border-slate-400 p-1 text-center text-sm">{forcedLeaveBalance}</td>
                        <td className="border border-slate-400 p-1 text-center text-sm">{sickLeaveBalance}</td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          {specialPrivilegeLeaveBalance}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-400 text-sm p-1">
                          <label className="hidden sm:block">Less this application</label>
                          <label className="block sm:hidden">Less</label>
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ? leaveDates.length : 0}
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ? leaveDates.length : 0}
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ? leaveDates.length : 0}
                        </td>
                        <td className="border border-slate-400 p-1 text-center text-sm">
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                            ? leaveDates.length
                            : 0}
                        </td>
                      </tr>
                      <tr className="border border-slate-400 bg-green-100">
                        <td className="border border-slate-400 text-sm p-1">Balance</td>
                        <td
                          className={`${
                            finalVacationLeaveBalance < 0 &&
                            watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION
                              ? 'bg-red-300'
                              : ''
                          } border border-slate-400 p-1 text-center text-sm`}
                        >
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION
                            ? finalVacationLeaveBalance.toFixed(3)
                            : vacationLeaveBalance}
                        </td>
                        <td
                          className={`${
                            finalForcedLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED
                              ? 'bg-red-300'
                              : ''
                          } border border-slate-400 p-1 text-center text-sm`}
                        >
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED
                            ? finalForcedLeaveBalance.toFixed(3)
                            : forcedLeaveBalance}
                        </td>
                        <td
                          className={`${
                            finalSickLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK
                              ? 'bg-red-300'
                              : ''
                          } border border-slate-400 p-1 text-center text-sm`}
                        >
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK
                            ? finalSickLeaveBalance.toFixed(3)
                            : sickLeaveBalance}
                        </td>
                        <td
                          className={`${
                            finalSpecialPrivilegekBalance < 0 &&
                            watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                              ? 'bg-red-300'
                              : ''
                          } border border-slate-400 p-1 text-center text-sm`}
                        >
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                            ? finalSpecialPrivilegekBalance.toFixed(3)
                            : specialPrivilegeLeaveBalance}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={`flex flex-col gap-2 w-full bg-slate-100 text-sm p-2 mt-1`}>
                  <span>{leaveReminder}</span>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                form="ApplyLeaveForm"
                type="submit"
                disabled={
                  finalVacationLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION
                    ? true
                    : finalForcedLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED
                    ? true
                    : finalSickLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK
                    ? true
                    : finalSpecialPrivilegekBalance < 0 &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                    ? true
                    : overlappingLeaveCount > 0 &&
                      (watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.REHABILITATION ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.ADOPTION)
                    ? true
                    : leaveDates.length <= 0 &&
                      watch('typeOfLeaveDetails.leaveName') !== LeaveName.MATERNITY &&
                      watch('typeOfLeaveDetails.leaveName') !== LeaveName.STUDY &&
                      watch('typeOfLeaveDetails.leaveName') !== LeaveName.REHABILITATION &&
                      watch('typeOfLeaveDetails.leaveName') !== LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN &&
                      watch('typeOfLeaveDetails.leaveName') !== LeaveName.ADOPTION
                    ? true
                    : leaveDateTo < leaveDateFrom &&
                      (watch('typeOfLeaveDetails.leaveName') == LeaveName.MATERNITY ||
                        watch('typeOfLeaveDetails.leaveName') == LeaveName.STUDY ||
                        watch('typeOfLeaveDetails.leaveName') == LeaveName.REHABILITATION ||
                        watch('typeOfLeaveDetails.leaveName') == LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                        watch('typeOfLeaveDetails.leaveName') == LeaveName.ADOPTION)
                    ? true
                    : hasPendingLeave
                    ? true
                    : employeeDetails.profile.sex === 'Male' &&
                      (watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.VAWC ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN)
                    ? true
                    : employeeDetails.profile.sex === 'Female' &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.PATERNITY
                    ? true
                    : false
                }
              >
                Apply Leave
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
