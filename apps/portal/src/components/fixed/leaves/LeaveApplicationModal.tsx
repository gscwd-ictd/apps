/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { AlertNotification, Button, Checkbox, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { postPortal } from '../../../../src/utils/helpers/portal-axios-helper';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import Calendar from './LeaveCalendar';
import { LeaveBenefitOptions } from '../../../../../../libs/utils/src/lib/types/leave-benefits.type';
import { LeaveApplicationForm } from '../../../../../../libs/utils/src/lib/types/leave-application.type';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveName, MonetizationType } from 'libs/utils/src/lib/enums/leave.enum';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import { format } from 'date-fns';
import { EditorContent, useEditor } from '@tiptap/react';
import { RichTextMenuBar } from '../../../../../../libs/oneui/src/components/RichTextMenuBar';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

type LeaveApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const leaveMonetizationType: Array<SelectOption> = [
  { label: 'Max 20 Total Leave Balance', value: MonetizationType.MAX20 },
  { label: 'Max 50% Total Leave Balance', value: MonetizationType.MAX50PERCENT },
];

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
    label: `Monetization of Leave Balance`,
    value: `Monetization of Leave Balance`,
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
  //get month now (1 = January, 2 = Feb...)
  const monthNow = format(new Date(), 'M');
  const yearNow = format(new Date(), 'yyyy');

  //zustand initialization to access Leave store
  const {
    pendingleavesList,
    loadingResponse,
    leaveDates,
    applyLeaveModalIsOpen,

    leaveDateFrom,
    leaveDateTo,
    overlappingLeaveCount,

    errorLeaveList,
    errorUnavailableDates,
    errorLeaveTypes,

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

    errorLeaveList: state.error.errorLeaves,
    errorUnavailableDates: state.error.errorUnavailableDates,
    errorLeaveTypes: state.error.errorLeaveTypes,

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
    errorLeaveLedger,

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
    errorLeaveLedger: state.error.errorLeaveLedger,

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

  const [selectedLeaveMonetizationType, setSelectedLeaveMonetizationType] = useState<MonetizationType>();
  const [leaveReminder, setLeaveReminder] = useState<string>(
    'The number of leave days you can apply is the rounded off value of your current Leave Balance. For leave of absence for thirty (30) calendar days or more and terminal leave, application shall be accompanied by a clearance from money, property, and work-related accountabilities (pursuant to CSC Memorandum Circular No. 2, s. 1985). '
  );
  const [finalVacationLeaveBalance, setFinalVacationLeaveBalance] = useState<number>(0);
  const [finalForcedLeaveBalance, setFinalForcedLeaveBalance] = useState<number>(0);
  const [finalSickLeaveBalance, setFinalSickLeaveBalance] = useState<number>(0);
  const [finalSpecialPrivilegekBalance, setFinalSpecialPrivilegekBalance] = useState<number>(0);

  //ROUNDED OFF LEAVE CREDITS
  const [roundedFinalVacationLeaveBalance, setRoundedFinalVacationLeaveBalance] = useState<number>(0);
  const [roundedFinalForcedLeaveBalance, setRoundedFinalForcedLeaveBalance] = useState<number>(0);
  const [roundedFinalSickLeaveBalance, setRoundedFinalSickLeaveBalance] = useState<number>(0);

  const [leaveObject, setLeaveObject] = useState<string>('');
  const [selectedStudy, setSelectedStudy] = useState<string>('');
  const [hasPendingLeave, setHasPendingLeave] = useState<boolean>(false);
  const [finalVacationAndForcedLeaveBalance, setFinalVacationAndForcedLeaveBalance] = useState<number>(0);

  const [lateFiling, setLateFiling] = useState<boolean>(false);

  const [allowedLeaveBenefits, setAllowedLeaveBenefits] = useState<Array<LeaveBenefitOptions>>([]);

  //STORE VALUES OF PENDING LEAVE DATES COUNTS
  const [pendingVacationLeaveDateCount, setPendingVacationLeaveDateCount] = useState<number>(0);
  const [pendingForcedLeaveDateCount, setPendingForcedLeaveDateCount] = useState<number>(0);
  const [pendingSickLeaveDateCount, setPendingSickLeaveDateCount] = useState<number>(0);
  const [pendingSplLeaveDateCount, setPendingSplLeaveDateCount] = useState<number>(0);

  //LESS THIS APPLICATION FOR MONETIZATION
  const [lessVlFl, setLessVlFL] = useState<number>(0);
  const [lessSl, setLessSl] = useState<number>(0);

  // get the latest balance by last index value
  const getLatestBalance = (leaveLedger: Array<LeaveLedgerEntry>) => {
    const lastIndexValue = leaveLedger[leaveLedger.length - 1];
    setForcedLeaveBalance(lastIndexValue.forcedLeaveBalance);
    setVacationLeaveBalance(lastIndexValue.vacationLeaveBalance ?? 0);
    setSickLeaveBalance(lastIndexValue.sickLeaveBalance ?? 0);
    setSpecialPrivilegeLeaveBalance(lastIndexValue.specialPrivilegeLeaveBalance ?? 0);
  };

  //fetch employee leave ledger
  const leaveLedgerUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/ledger/${employeeDetails.user._id}/${employeeDetails.profile.companyId}/${yearNow}`;

  const {
    data: swrLeaveLedger,
    isLoading: swrLeaveLedgerLoading,
    error: swrLeaveLedgerError,
  } = useSWR(employeeDetails.user._id && employeeDetails.profile.companyId ? leaveLedgerUrl : null, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: true,
    errorRetryInterval: 3000,
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
  const leaveTypeUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-benefits/`;
  const {
    data: swrLeaveTypes,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(leaveTypeUrl, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: true,
    errorRetryInterval: 3000,
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
      isLateFiling: false,
    },
  });

  const handleTypeOfLeave = (e: string) => {
    setLeaveObject(e);
    const leave = JSON.parse(e) as LeaveBenefitOptions;
    setValue('typeOfLeaveDetails', leave);
    setLeaveDateFrom(null);
    setLeaveDateTo(null);
  };

  const handleTypeOfFiling = (lateFiling: boolean) => {
    setLateFiling(lateFiling);
    setValue('isLateFiling', lateFiling);
  };

  //check if there are pending leaves of the same name being filed, return true/false
  useEffect(() => {
    //store pending leaves to temporary var if any
    let pendingVl = pendingleavesList?.filter((leave) => leave.leaveName === LeaveName.VACATION);
    let pendingFl = pendingleavesList?.filter((leave) => leave.leaveName === LeaveName.FORCED);
    let pendingSl = pendingleavesList?.filter((leave) => leave.leaveName === LeaveName.SICK);
    let pendingSpl = pendingleavesList?.filter((leave) => leave.leaveName === LeaveName.SPECIAL_PRIVILEGE);

    //store leave dates count per pending leaves
    if (pendingVl.length > 0 && pendingFl.length > 0) {
      //if have both pending VL and FL, combine their leave dates count
      setPendingVacationLeaveDateCount(pendingVl[0]?.leaveDates?.length + pendingFl[0]?.leaveDates?.length);
    } else if (pendingVl.length > 0 && pendingFl.length <= 0) {
      //if only have pending VL, store the VL's date count only
      setPendingVacationLeaveDateCount(pendingVl[0]?.leaveDates?.length);
    } else if (pendingVl.length <= 0 && pendingFl.length > 0) {
      //if only have pending FL, store the FL's date count only
      setPendingVacationLeaveDateCount(pendingFl[0]?.leaveDates?.length);
    } else {
      //if no pending VL/FL, set to 0
      setPendingVacationLeaveDateCount(0);
    }

    if (pendingFl.length > 0) {
      setPendingForcedLeaveDateCount(pendingFl[0]?.leaveDates?.length);
    } else {
      setPendingForcedLeaveDateCount(0);
    }

    if (pendingSl.length > 0) {
      setPendingSickLeaveDateCount(pendingSl[0]?.leaveDates?.length);
    } else {
      setPendingSickLeaveDateCount(0);
    }

    if (pendingSpl.length > 0) {
      setPendingSplLeaveDateCount(pendingSpl[0]?.leaveDates?.length);
    } else {
      setPendingSplLeaveDateCount(0);
    }

    if (pendingleavesList?.some((leave) => leave.leaveName === watch('typeOfLeaveDetails.leaveName'))) {
      //if pending leave applications list includes the same leave type as being applied right now
      setHasPendingLeave(true);
    } else if (
      watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION &&
      pendingleavesList?.some(
        (leave) =>
          leave.leaveName === LeaveName.FORCED ||
          leave.leaveName === LeaveName.VACATION ||
          leave.leaveName === LeaveName.SICK
      )
    ) {
      //if filing for monetization but have pending VL,FL,SL
      setHasPendingLeave(true);
    } else if (
      pendingleavesList?.some((leave) => leave.leaveName === LeaveName.MONETIZATION) &&
      (watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
        watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
        watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK)
    ) {
      //if filing for monetization but have pending VL,FL,SL
      setHasPendingLeave(true);
    } else if (watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL && pendingleavesList.length > 0) {
      //if filing for terminal leave but have pending leaves
      setHasPendingLeave(true);
    } else if (
      watch('typeOfLeaveDetails.leaveName') != LeaveName.TERMINAL &&
      pendingleavesList?.some((leave) => leave.leaveName === LeaveName.TERMINAL)
    ) {
      //if filing for a leave but there's a pending terminal leave
      setHasPendingLeave(true);
    } else {
      setHasPendingLeave(false);
    }

    //reset leave monetization input values
    setLeaveBalanceInput(0);
    setLessSl(0);
    setLessVlFL(0);
    // setSickLeaveInput(0);
    setSelectedLeaveMonetizationType(null);
    setLateFiling(false);
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

  useEffect(() => {
    if (swrLeaveTypes && employeeDetails.profile.sex === 'Male') {
      setAllowedLeaveBenefits(
        swrLeaveTypes?.filter(
          (leave) =>
            leave.leaveName != LeaveName.MATERNITY &&
            leave.leaveName != LeaveName.VAWC &&
            leave.leaveName != LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
        )
      );
    } else {
      setAllowedLeaveBenefits(swrLeaveTypes?.filter((leave) => leave.leaveName != LeaveName.PATERNITY));
    }
  }, [swrLeaveTypes]);

  const onSubmit: SubmitHandler<LeaveApplicationForm> = (data: LeaveApplicationForm) => {
    let dataToSend;
    if (
      data.typeOfLeaveDetails.leaveName === LeaveName.VACATION ||
      data.typeOfLeaveDetails.leaveName === LeaveName.FORCED ||
      data.typeOfLeaveDetails.leaveName === LeaveName.SPECIAL_PRIVILEGE
    ) {
      if (data.inPhilippinesOrAbroad === 'Philippines') {
        dataToSend = {
          leaveBenefitsId: data.typeOfLeaveDetails.id,
          employeeId: data.employeeId,
          inPhilippines: data.location,
          leaveApplicationDates: data.leaveApplicationDates,
          isLateFiling: data.isLateFiling,
          lateFilingJustification: data.lateFilingJustification,
        };
      } else {
        dataToSend = {
          leaveBenefitsId: data.typeOfLeaveDetails.id,
          employeeId: data.employeeId,
          abroad: data.location,
          leaveApplicationDates: data.leaveApplicationDates,
          isLateFiling: data.isLateFiling,
          lateFilingJustification: data.lateFilingJustification,
        };
      }
    } else if (data.typeOfLeaveDetails.leaveName === LeaveName.SICK) {
      if (data.hospital === 'inHospital') {
        dataToSend = {
          leaveBenefitsId: data.typeOfLeaveDetails.id,
          employeeId: data.employeeId,
          inHospital: data.illness,
          leaveApplicationDates: data.leaveApplicationDates,
          isLateFiling: data.isLateFiling,
          lateFilingJustification: data.lateFilingJustification,
        };
      } else {
        dataToSend = {
          leaveBenefitsId: data.typeOfLeaveDetails.id,
          employeeId: data.employeeId,
          outPatient: data.illness,
          leaveApplicationDates: data.leaveApplicationDates,
          isLateFiling: data.isLateFiling,
          lateFilingJustification: data.lateFilingJustification,
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
        isLateFiling: data.isLateFiling,
        lateFilingJustification: data.lateFilingJustification,
      };
    } else if (data.typeOfLeaveDetails.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN) {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        employeeId: data.employeeId,
        leaveApplicationDates: data.leaveApplicationDatesRange,
        splWomen: data.specialLeaveWomenIllness,
        isLateFiling: data.isLateFiling,
        lateFilingJustification: data.lateFilingJustification,
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
        isLateFiling: data.isLateFiling,
        lateFilingJustification: data.lateFilingJustification,
      };
    } else if (data.typeOfLeaveDetails.leaveName === LeaveName.OTHERS) {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        employeeId: data.employeeId,
        leaveApplicationDates: data.leaveApplicationDates,
        other: data.other,
        commutation: data.commutation ? data.commutation : null,
        isLateFiling: data.isLateFiling,
        lateFilingJustification: data.lateFilingJustification,
      };
    } else if (data.typeOfLeaveDetails.leaveName === LeaveName.MONETIZATION) {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        forMonetization: true,
        employeeId: data.employeeId,
        leaveApplicationDates: null,
        leaveMonetization: {
          convertedSl: lessSl,
          convertedVl: lessVlFl,
          monetizationType: selectedLeaveMonetizationType,
          monetizedAmount: estimatedAmount,
        },
      };
    } else if (data.typeOfLeaveDetails.leaveName === LeaveName.TERMINAL) {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        forMonetization: true,
        employeeId: data.employeeId,
        leaveApplicationDates: [leaveDateFrom],
      };
    } else {
      dataToSend = {
        leaveBenefitsId: data.typeOfLeaveDetails.id,
        employeeId: data.employeeId,
        leaveApplicationDates: data.leaveApplicationDates,
        isLateFiling: data.isLateFiling,
        lateFilingJustification: data.lateFilingJustification,
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
          watch('typeOfLeaveDetails.leaveName') === LeaveName.ADOPTION)) ||
      (watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION && estimatedAmount > 0) ||
      (watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL && estimatedAmount > 0)
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

  const leaveCreditMultiplier = Number(process.env.NEXT_PUBLIC_MONETIZATION_CONSTANT);
  const [maxMonetizationAmount, setMaxMonetizationAmount] = useState<number>(0);
  const [leaveBalanceInput, setLeaveBalanceInput] = useState<number>(0);
  // const [sickLeaveInput, setSickLeaveInput] = useState<number>(0);
  const [estimatedAmount, setEstimatedAmount] = useState<number>(0);

  // Set state for leave credits in table below of modal
  useEffect(() => {
    setFinalVacationLeaveBalance(vacationLeaveBalance - leaveDates.length);
    setFinalSickLeaveBalance(Number(sickLeaveBalance - leaveDates.length));
    setFinalForcedLeaveBalance(forcedLeaveBalance - leaveDates.length);
    setFinalSpecialPrivilegekBalance(specialPrivilegeLeaveBalance - leaveDates.length);

    //update rounded off leave credits also
    setRoundedFinalVacationLeaveBalance(Math.round(vacationLeaveBalance) - leaveDates.length);
    setRoundedFinalForcedLeaveBalance(Math.round(forcedLeaveBalance) - leaveDates.length);
    setRoundedFinalSickLeaveBalance(Math.round(sickLeaveBalance) - leaveDates.length);
  }, [leaveDates, watch('typeOfLeaveDetails.leaveName')]);

  //compute leave monetization
  const getLeaveBalanceInput = (credits: number) => {
    const totalLeaveBalance = Number(vacationLeaveBalance) + Number(sickLeaveBalance);
    const totalVlFlBalance = Number(vacationLeaveBalance); //removed forcedLeaveBalance

    setLeaveBalanceInput(credits);
    //start deduct in VL/FL if initial total credits is greater than 10
    if (totalVlFlBalance > 10) {
      if (totalVlFlBalance - credits >= 10) {
        setLessVlFL(credits);
        setLessSl(0);
      } else if (totalVlFlBalance - credits < 10) {
        setLessVlFL(totalVlFlBalance - 10);
        //if VL/FL is exhausted with 10 credits left minimum, switch deduction to SL
        setLessSl(credits - (totalVlFlBalance - 10));
      }
      //VL is already less than 10, go directly to SL deduction
    } else {
      setLessVlFL(0);
      //if VL/FL is exhausted with 10 or less credits left, switch deduction to SL
      setLessSl(credits);
    }
  };

  const computeEstimateAmount = () => {
    const totalVlFlBalance = Number(vacationLeaveBalance); //removed forcedLeaveBalance
    setFinalVacationAndForcedLeaveBalance(totalVlFlBalance - lessVlFl);
    setFinalSickLeaveBalance(sickLeaveBalance - lessSl);
    setMaxMonetizationAmount(
      employeeDetails.employmentDetails.salaryGradeAmount *
        (Number(totalVlFlBalance) + Number(sickLeaveBalance)) *
        leaveCreditMultiplier
    );

    if (watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL) {
      const computedUnearnedCredits =
        Number(format(new Date(leaveDateFrom), 'd')) * Number(process.env.NEXT_PUBLIC_UNEARNED_CREDIT_MULTIPLIER) * 2;

      setEstimatedAmount(
        Math.trunc(
          Number(
            leaveCreditMultiplier *
              employeeDetails.employmentDetails.salaryGradeAmount *
              (computedUnearnedCredits + Number(vacationLeaveBalance) + Number(sickLeaveBalance))
          ) * 100
        ) / 100
      );
    } else {
      setEstimatedAmount(
        Math.trunc(
          Number(
            employeeDetails.employmentDetails.salaryGradeAmount *
              (Number(lessVlFl) + Number(lessSl)) *
              leaveCreditMultiplier
          ) * 100
        ) / 100
      );
    }
  };

  useEffect(() => {
    if (
      watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION ||
      watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL
    ) {
      computeEstimateAmount();
    }
  }, [leaveBalanceInput, leaveDateFrom, watch('typeOfLeaveDetails.leaveName')]);

  //FOR TERMINAL LEAVE AUTO COMPUTE
  useEffect(() => {
    if (watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL) {
      getLeaveBalanceInput(Number(vacationLeaveBalance) + Number(sickLeaveBalance));
    }
  }, [watch('typeOfLeaveDetails.leaveName')]);

  const { windowWidth } = UseWindowDimensions();

  const [lateFilingJustification, setLateFilingJustification] = useState<string>('');

  //Justification Letter Text Editor
  const editor = useEditor({
    immediatelyRender: false,
    content: lateFilingJustification,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        // Use a placeholder:
        // placeholder: 'Write something …',
        // Use different placeholders depending on the node type:
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Dear Sir/Maam, I am writing this letter to inform you that... Sincerely, ...';
          }
          return 'Dear Sir/Maam, I am writing this letter to inform you that... Sincerely, ...';
        },
      }),
    ],

    editorProps: {
      attributes: {
        class: 'border-none outline-none h-30',
      },
    },
    onUpdate: ({ editor }) => {
      setLateFilingJustification(editor.getHTML());
    },
  });

  useEffect(() => {
    setValue('lateFilingJustification', lateFilingJustification);
  }, [lateFilingJustification]);

  //reset late filing justification field if lateFiling is off
  useEffect(() => {
    if (lateFiling === false) {
      setValue('lateFilingJustification', null); //submit form
      setLateFilingJustification(''); //state
      editor?.commands?.clearContent(true); //delete contents of tiptap editor
    }
  }, [lateFiling]);

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'md' : 'full'}`} open={modalState} setOpen={setModalState}>
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
              notifMessage="Submitting Request"
              dismissible={true}
            />
          ) : null}
          <form id="ApplyLeaveForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full h-full flex flex-col gap-2 ">
              <div className="w-full flex flex-col gap-2 px-4 rounded">
                <div className="w-full flex flex-col gap-0">
                  {/* If applying for LWOP but VL/FL is not exhausted */}
                  {Number(vacationLeaveBalance) - Number(pendingVacationLeaveDateCount) >= 0.5 &&
                  Number(sickLeaveBalance) - Number(pendingSickLeaveDateCount) >= 0.5 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.LEAVE_WITHOUT_PAY ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Unable to apply for Leave Without Pay if Vacation or Sick Leave credits are not exhausted."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* If Justification letter is empty */}
                  {(watch('lateFilingJustification') === '' ||
                    watch('lateFilingJustification') === null ||
                    watch('lateFilingJustification') === '<p></p>') &&
                  lateFiling ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Justification Letter for Late Filing is empty."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                  {/* Has Existing Pending Leave of the Same Name - cannot file a new one */}
                  {hasPendingLeave ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage={`
                        ${
                          watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION &&
                          pendingleavesList?.some(
                            (leave) =>
                              leave.leaveName === LeaveName.FORCED ||
                              leave.leaveName === LeaveName.VACATION ||
                              leave.leaveName === LeaveName.SICK ||
                              leave.leaveName === LeaveName.TERMINAL
                          )
                            ? 'Unable to apply for Monetization due to a pending Vacation, Forced, Sick, or Terminal Leave application.'
                            : pendingleavesList?.some((leave) => leave.leaveName === LeaveName.MONETIZATION) &&
                              (watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
                                watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                                watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK)
                            ? 'Unable to apply for this Leave due to a pending Leave Monetization application.'
                            : pendingleavesList?.some((leave) => leave.leaveName === LeaveName.TERMINAL) &&
                              (watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
                                watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                                watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK)
                            ? 'Unable to apply for Leave due to a pending Terminal Leave application.'
                            : pendingleavesList?.length > 0 &&
                              watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL
                            ? 'Unable to apply for this Leave due to other pending Leave applications.'
                            : watch('typeOfLeaveDetails.leaveName') != LeaveName.TERMINAL &&
                              pendingleavesList?.some((leave) => leave.leaveName === LeaveName.TERMINAL)
                            ? 'Unable to apply for this Leave due to a pending Terminal Leave application.'
                            : 'You have a pending Leave application of the same type.'
                        }
                        `}
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Disable Force Leave Application during December */}
                  {monthNow === '12' && watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Forced Leaves cannot be applied during December."
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
                      notifMessage="You are not allowed to file this type of leave."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Male Specific Leave Benefit Notification */}
                  {employeeDetails.profile.sex === 'Female' &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.PATERNITY ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="You are not allowed to file this type of leave."
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
                  watch('typeOfLeaveDetails.leaveName') !== LeaveName.ADOPTION &&
                  watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                  watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Please select date of leave."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                  {/* Empty date of leaves */}
                  {leaveDateTo < leaveDateFrom &&
                  (watch('typeOfLeaveDetails.leaveName') == LeaveName.MATERNITY ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.STUDY ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.REHABILITATION ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    watch('typeOfLeaveDetails.leaveName') == LeaveName.ADOPTION) ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Please select an acceptable date of leave."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                  {/* Vacation Leave Balance Notifications */}
                  {Number(roundedFinalVacationLeaveBalance) - Number(pendingVacationLeaveDateCount) < 0 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Insufficient Vacation Leave Balance."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Forced Leave Balance Notifications */}
                  {Number(roundedFinalForcedLeaveBalance) - Number(pendingForcedLeaveDateCount) < 0 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Insufficient Forced Leave Balance."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Forced Leave Balance Notifications */}
                  {Number(
                    leaveDates.length > Math.round(vacationLeaveBalance) - Number(pendingVacationLeaveDateCount)
                  ) && watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Filed Forced Leave must not exceed the rounded off Vacation Leave Balance."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {Number(vacationLeaveBalance) - Number(pendingVacationLeaveDateCount) < 0.5 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Must have at least 0.5 Vacation Leave Balance to apply for Forced Leave."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Sick Leave Balance Notifications */}
                  {roundedFinalSickLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Insufficient Sick Leave Balance."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Special Privilege Leave Balance Notifications */}
                  {finalSpecialPrivilegekBalance < 0 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Insufficient Special Privilege Leave Balance."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Monetization Notif for insufficient VL/FL */}
                  {finalVacationAndForcedLeaveBalance < 10 &&
                  Number(vacationLeaveBalance) + Number(forcedLeaveBalance) > 10 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Retaining a minimum of 10 Vacation/Forced Leave Credit Balance is required for its monetization."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Monetization Notif for insufficient Sick Leave */}
                  {finalSickLeaveBalance < 15 &&
                  lessSl > 0 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage="Retaining a minimum 15 Sick Leave Credit Balance is required for its monetization."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Monetization Notif for more than 50% amount */}
                  {estimatedAmount > Number(maxMonetizationAmount) / 2 &&
                  selectedLeaveMonetizationType === MonetizationType.MAX50PERCENT &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage={`Leave credits to monetize should not be more than 50% of max amount of ${maxMonetizationAmount.toLocaleString()}.`}
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}

                  {/* Monetization Notif for more than 20 leave credits entered */}
                  {leaveBalanceInput > 20 &&
                  selectedLeaveMonetizationType === MonetizationType.MAX20 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage={`Leave credits to monetize should not be more than 20.`}
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
                      notifMessage="There are overlapping leaves in your application."
                      dismissible={false}
                      className="mb-1"
                    />
                  ) : null}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-1 pt-1">
                  <div className="flex flex-row justify-between items-center w-full">
                    <label className="pt-2 text-slate-500 text-md font-medium">
                      Leave Type:<span className="text-red-600">*</span>
                    </label>

                    {swrIsLoading ? <LoadingSpinner size="xs" /> : null}
                  </div>

                  <div className="flex gap-2 w-full items-center">
                    <select
                      className="text-slate-500 w-full h-14 rounded-md text-md border-slate-300"
                      required
                      defaultValue={''}
                      onChange={(e) => handleTypeOfLeave(e.target.value as unknown as string)}
                    >
                      <option value="" disabled>
                        Select Type Of Leave:
                      </option>

                      {
                        // typeOfLeave
                        allowedLeaveBenefits?.length > 0
                          ? allowedLeaveBenefits.map((item: LeaveBenefitOptions, idx: number) => (
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
                          ? 'It shall be filed five(5) days in advance, whenever possible, of the effective date of such leave. Vacation leave within the Philippines or abroad shall be indicated in the form for purposes of securing travel authority and completing clearance from the money and work accountabilities.'
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED
                          ? 'Annual five-day vacation leave shall be forfeited if not taken during the year. In case the scheduled leave has been cancelled in the exigency of the service by the head of agency, it shall no longer be deducted from the accumulated vacation leave. Availment of one (1) day or more Vacation Leave (VL) shall be considered for complying the mandatory/forced leave subject to the conditions under Section 25, Rule XVI of the Omnibus Rules Implementing E.O. No. 292.'
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK
                          ? `It shall be filed immediately upon employee's return from such leave. If filed in advance or exceeding the five (5) days, application shall be accompanied by a medical certificate. In case medical consultation was not availed of, an affidavit should be executed by an applicant.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY
                          ? `Proof of pregnancy e.g. ultrasound, doctor's certificate on the expected data of delivery. Accomplished Notice of Allocation of Maternity Leave Balance (CS Form No. 6a), if needed. Seconded female employees shall enjoy maternity leave with full pay in the recipient agency.`
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
                          ? `Application for adoption leave shall be filed with an authenticated copy of the Pre-Adoptive Placement Authority issued by the Department of Social Welfare and Development (DSWD).`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.LEAVE_WITHOUT_PAY
                          ? `Unpaid Leaves.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                          ? `For Monetization of Leave Balance, application for monetization of fifthy percent (50%) or more of the accumulated leave credits shall be accompanied by letter request to the head of the agency stating the valid and justifiable reasons. For Terminal Leave, proof of employee's resignation or retirement or separation from the service.`
                          : watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL
                          ? `Proof of employee's resignation or retirement or separation from service.`
                          : ``}
                      </span>
                    </div>
                  ) : null}
                </div>

                {watch('typeOfLeaveDetails.leaveName') ? (
                  <>
                    <div className="flex flex-col md:flex-row justify-between items-center w-full">
                      <div className="flex flex-row justify-between items-center w-full">
                        <label className="pt-2 text-slate-500 text-md font-medium">
                          {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                          watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
                          watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE ? (
                            <>
                              Location:<span className="text-red-600">*</span>
                            </>
                          ) : watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ? (
                            <>
                              Hospitalization:<span className="text-red-600">*</span>
                            </>
                          ) : watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY ? (
                            <>
                              Study:<span className="text-red-600">*</span>
                            </>
                          ) : watch('typeOfLeaveDetails.leaveName') === LeaveName.OTHERS ? (
                            <>
                              Other Purpose:<span className="text-red-600">*</span>
                            </>
                          ) : null}
                        </label>
                      </div>

                      <div className="flex gap-2 w-full items-center">
                        {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE ? (
                          <>
                            <select
                              id="inPhilippinesOrAbroad"
                              className="text-slate-500 w-full h-14 rounded-md text-md border-slate-300"
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
                              className="text-slate-500 w-full h-16 rounded-md text-md border-slate-300"
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
                              className="text-slate-500 w-full h-16 rounded-md text-md border-slate-300"
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
                              className="text-slate-500 w-full h-16 rounded-md text-md border-slate-300"
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

                    {watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION ? (
                      <>
                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full">
                            <label className="pt-2 pr-2 text-slate-500 text-md font-medium">Monetization Type:</label>
                          </div>

                          <div className="flex gap-2 w-full items-center">
                            <div className="w-full">
                              <select
                                id="leaveMonetizationType"
                                required
                                defaultValue={''}
                                className="border-slate-300 text-slate-500 h-12 text-md w-full rounded-md"
                                onChange={(e: any) => setSelectedLeaveMonetizationType(e.target.value)}
                              >
                                <option value="" disabled>
                                  Monetization Type
                                </option>
                                {leaveMonetizationType.map((item: Item, idx: number) => (
                                  <option value={item.value} key={idx}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {selectedLeaveMonetizationType ? (
                          <>
                            <div className="flex flex-row justify-between items-center w-full">
                              <div className="flex flex-row justify-between items-center w-full">
                                <label className="pt-2 pr-2 text-slate-500 text-md font-medium">
                                  Leave Balance to Convert:
                                </label>
                              </div>

                              <div className="flex gap-2 w-full items-center">
                                <div className="w-full">
                                  <input
                                    type="number"
                                    step={'.001'}
                                    min={1}
                                    max={
                                      selectedLeaveMonetizationType === MonetizationType.MAX50PERCENT
                                        ? `${(Number(vacationLeaveBalance) + Number(sickLeaveBalance)) / 2}`
                                        : '20'
                                    }
                                    className="border-slate-300 text-slate-500 h-12 text-md w-full rounded-md"
                                    placeholder="Leave Balance to Monetize"
                                    onChange={(e: any) => getLeaveBalanceInput(e.target.value)}
                                    required
                                    value={leaveBalanceInput}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between items-center w-full">
                              <div className="flex flex-row justify-between items-center w-full">
                                <label className="pt-2 pr-2 text-slate-500 text-md font-medium">
                                  Monthly Salary Grade Amount:
                                </label>
                              </div>

                              <div className="flex gap-2 w-full items-center">
                                <div className="w-full">
                                  <input
                                    disabled
                                    type="text"
                                    step={'.001'}
                                    className="border-slate-300 text-slate-500 h-12 text-md w-full rounded-md"
                                    placeholder="Running Unearned Leave Credits for the month"
                                    required
                                    value={employeeDetails.employmentDetails.salaryGradeAmount.toLocaleString()}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between items-center w-full">
                              <div className="flex flex-row justify-between items-center w-full">
                                <label className="pt-2 pr-2 text-slate-500 text-md font-medium">
                                  Monetization Amount:
                                </label>
                              </div>

                              <div className="flex gap-2 w-full items-center">
                                <div className="w-full">
                                  <input
                                    type="text"
                                    className="border-slate-300 text-slate-500 h-12 text-md w-full rounded-md"
                                    placeholder="Amount"
                                    disabled
                                    required
                                    value={Number(estimatedAmount).toLocaleString()}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </>
                    ) : null}

                    {watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL ? (
                      <>
                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full">
                            <label className="pt-2 pr-2 text-slate-500 text-md font-medium">Last Day of Duty:</label>
                          </div>

                          <div className="flex gap-2 w-full items-center">
                            <div className="w-full">
                              <input
                                required
                                type="date"
                                value={leaveDateFrom ? leaveDateFrom : ''}
                                className="text-slate-500 text-md border-slate-300 rounded w-full h-12"
                                onChange={(e) => setLeaveDateFrom(e.target.value as unknown as string)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full">
                            <label className="pt-2 pr-2 text-slate-500 text-md font-medium">
                              Leave Balance to Convert:
                            </label>
                          </div>

                          <div className="flex gap-2 w-full items-center">
                            <div className="w-full">
                              <input
                                disabled
                                type="number"
                                step={'.001'}
                                className="border-slate-300 text-slate-500 h-12 text-md w-full rounded-md"
                                placeholder="Leave Balance to Monetize"
                                required
                                value={leaveBalanceInput}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full">
                            <label className="pt-2 pr-2 text-slate-500 text-md font-medium">
                              Unearned Credits for the Month:
                            </label>
                          </div>

                          <div className="flex gap-2 w-full items-center">
                            <div className="w-full">
                              <input
                                disabled
                                type="number"
                                step={'.001'}
                                className="border-slate-300 text-slate-500 h-12 text-md w-full rounded-md"
                                placeholder="Running Unearned Leave Credits for the month"
                                required
                                value={(
                                  Number(format(new Date(leaveDateFrom), 'd')) *
                                  Number(process.env.NEXT_PUBLIC_UNEARNED_CREDIT_MULTIPLIER) *
                                  2
                                ).toFixed(3)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full">
                            <label className="pt-2 pr-2 text-slate-500 text-md font-medium">
                              Monthly Salary Grade Amount:
                            </label>
                          </div>

                          <div className="flex gap-2 w-full items-center">
                            <div className="w-full">
                              <input
                                disabled
                                type="text"
                                step={'.001'}
                                className="border-slate-300 text-slate-500 h-12 text-md w-full rounded-md"
                                placeholder="Running Unearned Leave Credits for the month"
                                required
                                value={employeeDetails.employmentDetails.salaryGradeAmount.toLocaleString()}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full">
                            <label className="pt-2 pr-2 text-slate-500 text-md font-medium">Total Amount:</label>
                          </div>

                          <div className="flex gap-2 w-full items-center">
                            <div className="w-full">
                              <input
                                type="text"
                                className="border-slate-300 text-slate-500 h-12 text-md w-full rounded-md"
                                placeholder="Amount"
                                disabled
                                required
                                value={Number(estimatedAmount).toLocaleString()}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}

                    {watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION &&
                    watch('other') === 'Monetization of Leave Balance' ? (
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                          <label className="pt-2 text-slate-500 text-md font-medium">Commutation</label>
                        </div>

                        <div className="flex gap-2 w-full items-center">
                          {watch('other') === 'Monetization of Leave Balance' ? (
                            <div className="w-full">
                              <select
                                id="commutation"
                                className="text-slate-500 w-full h-16 rounded-md text-md border-slate-300"
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
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    (watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY && selectedStudy === 'other') ? (
                      <textarea
                        {...(watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
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
                          watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
                          watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                            ? 'Specify Leave Details'
                            : watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ||
                              watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                            ? 'Specify Illness'
                            : watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY && selectedStudy === 'other'
                            ? 'Specify Study Leave Purpose'
                            : 'Specify Leave Details'
                        }`}
                        className="resize-none w-full p-2 mt-1 rounded-md text-slate-500 text-md border-slate-300 mb-2"
                      ></textarea>
                    ) : null}
                  </>
                ) : null}

                {watch('typeOfLeaveDetails.leaveName') &&
                watch('typeOfLeaveDetails.leaveName') != LeaveName.MONETIZATION &&
                watch('typeOfLeaveDetails.leaveName') != LeaveName.TERMINAL ? (
                  <>
                    <div className="flex flex-row justify-between items-center">
                      <label className="text-slate-500 text-md font-medium">
                        Select Leave Dates:<span className="text-red-600">*</span>
                      </label>
                    </div>

                    <div className="w-full p-4 bg-gray-50 rounded">
                      {watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY ||
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.STUDY ||
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.REHABILITATION ||
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.ADOPTION ? (
                        <Calendar
                          type={'range'}
                          clickableDate={true}
                          leaveName={watch('typeOfLeaveDetails.leaveName')}
                        />
                      ) : (
                        <Calendar
                          type={'single'}
                          clickableDate={true}
                          leaveName={watch('typeOfLeaveDetails.leaveName')}
                          isLateFiling={lateFiling}
                        />
                      )}
                    </div>

                    {watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SOLO_PARENT ||
                    watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ? (
                      <div className="flex flex-col gap-1 w-full bg-slate-100 text-sm p-2 mt-1">
                        <div className="flex gap-2 items-center justify-start rounded ">
                          <label className="text-sm font-medium text-slate-500 whitespace-nowrap">
                            Enable Late Filing:
                          </label>
                          <Checkbox
                            id="isLateFiling"
                            checked={lateFiling}
                            label="Late Filing"
                            className={'w-5 h-5'}
                            onChange={() => handleTypeOfFiling(!lateFiling)}
                          />
                        </div>
                        <label className="text-xs text-red-400">
                          Note: Only check this if you were unable to file leave upon return to work for Sick and
                          Special Leave and within 10 days from the date of leave for Vacation or Forced Leave.
                        </label>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {lateFiling ? (
                  <>
                    <label className="text-slate-500 text-md font-medium">
                      Justification Letter:<span className="text-red-600">*</span>
                    </label>

                    <div className="resize-none w-full p-2 mt-1 rounded-md text-slate-500 text-md border-slate-300 mb-2 border focus:border-0">
                      {/* <RichTextMenuBar editor={editor} content={''} /> */}
                      <EditorContent
                        placeholder={''}
                        editor={editor}
                        style={{ whiteSpace: 'pre-line' }}
                      ></EditorContent>
                    </div>
                  </>
                ) : null}

                {watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ||
                watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ||
                watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ||
                watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE ||
                watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION ||
                watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL ? (
                  <div className="w-full pb-4 pt-2">
                    <span className="text-slate-500 text-md font-medium">Your current Leave Balance:</span>
                    <table className="mt-2 bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-200 w-full rounded-md table-fixed">
                      <tbody>
                        <tr className="border border-slate-200">
                          <td className="border border-slate-200"></td>
                          <td className="border border-slate-200 text-center text-sm p-1">Vacation</td>
                          {watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                          watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL ? (
                            <td className="border border-slate-200 text-center text-sm p-1">Forced</td>
                          ) : null}

                          <td className="border border-slate-200 text-center text-sm p-1">Sick</td>

                          {watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                          watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL ? (
                            <td className="border border-slate-200 text-center text-sm p-1">
                              <label className="hidden sm:block">Special Privilege</label>
                              <label className="block sm:hidden">SPL</label>
                            </td>
                          ) : null}
                        </tr>
                        <tr className="border border-slate-200">
                          <td className="border border-slate-200 text-sm p-1">Total Earned</td>
                          <td className="border border-slate-200 p-1 text-center text-sm">
                            {watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                            watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL
                              ? Number(vacationLeaveBalance).toFixed(3)
                              : Number(vacationLeaveBalance).toFixed(3)}
                          </td>
                          {watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                          watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL ? (
                            <td className="border border-slate-200 p-1 text-center text-sm">
                              {Number(forcedLeaveBalance).toFixed(3)}
                            </td>
                          ) : null}

                          <td className="border border-slate-200 p-1 text-center text-sm">
                            {Number(sickLeaveBalance).toFixed(3)}
                          </td>
                          {watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                          watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL ? (
                            <td className="border border-slate-200 p-1 text-center text-sm">
                              {Number(specialPrivilegeLeaveBalance).toFixed(3)}
                            </td>
                          ) : null}
                        </tr>
                        {watch('typeOfLeaveDetails.leaveName') == LeaveName.VACATION ||
                        watch('typeOfLeaveDetails.leaveName') == LeaveName.FORCED ? (
                          <tr>
                            <td className="border border-slate-200 text-sm p-1">
                              <label className="hidden sm:block">Less pending applications</label>
                              <label className="block sm:hidden">Less pending </label>
                            </td>
                            <td className="border border-slate-200 p-1 text-center text-sm">
                              {pendingVacationLeaveDateCount}
                            </td>

                            <td className="border border-slate-200 p-1 text-center text-sm">
                              {pendingForcedLeaveDateCount}
                            </td>

                            <td className="border border-slate-200 p-1 text-center text-sm">--</td>

                            <td className="border border-slate-200 p-1 text-center text-sm">--</td>
                          </tr>
                        ) : null}
                        <tr>
                          <td className="border border-slate-200 text-sm p-1">
                            <label className="hidden sm:block">Less this application</label>
                            <label className="block sm:hidden">Less</label>
                          </td>
                          <td className="border border-slate-200 p-1 text-center text-sm">
                            {/* if vacation leave */}
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION ? leaveDates.length : null}

                            {/* if monetization */}
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                              ? lessVlFl > 0
                                ? Number(lessVlFl).toFixed(3)
                                : 0
                              : null}

                            {/* if terminal leave */}
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL ? vacationLeaveBalance : null}

                            {watch('typeOfLeaveDetails.leaveName') != LeaveName.MONETIZATION &&
                            watch('typeOfLeaveDetails.leaveName') != LeaveName.TERMINAL &&
                            watch('typeOfLeaveDetails.leaveName') != LeaveName.VACATION
                              ? 0
                              : null}
                          </td>

                          {/* force leave td */}
                          {watch('typeOfLeaveDetails.leaveName') != LeaveName.MONETIZATION &&
                          watch('typeOfLeaveDetails.leaveName') != LeaveName.TERMINAL ? (
                            <td className="border border-slate-200 p-1 text-center text-sm">
                              {watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED ? leaveDates.length : 0}
                            </td>
                          ) : null}

                          {/* sick leave td */}
                          <td className="border border-slate-200 p-1 text-center text-sm">
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ? leaveDates.length : null}

                            {/* if monetization */}
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                              ? lessSl > 0
                                ? Number(lessSl).toFixed(3)
                                : 0
                              : null}

                            {/* if terminal leave */}
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL ? sickLeaveBalance : null}

                            {watch('typeOfLeaveDetails.leaveName') != LeaveName.MONETIZATION &&
                            watch('typeOfLeaveDetails.leaveName') != LeaveName.TERMINAL &&
                            watch('typeOfLeaveDetails.leaveName') != LeaveName.SICK
                              ? 0
                              : null}
                          </td>
                          {watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                          watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL ? (
                            <td className="border border-slate-200 p-1 text-center text-sm">
                              {watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                                ? leaveDates.length
                                : 0}
                            </td>
                          ) : null}
                        </tr>
                        <tr
                          className={`border border-slate-200 ${
                            watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION ||
                            watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL
                              ? ''
                              : 'bg-green-100'
                          }`}
                        >
                          <td className="border border-slate-200 text-sm p-1">Balance</td>
                          <td
                            className={`${
                              Number(finalVacationLeaveBalance) - Number(pendingVacationLeaveDateCount) < 0 &&
                              watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION
                                ? 'bg-red-300'
                                : finalVacationAndForcedLeaveBalance < 5 &&
                                  watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                                ? ''
                                : ''
                            } border border-slate-200 p-1 text-center text-sm`}
                          >
                            {/* if vacation leave application */}
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION // finalVacationLeaveBalance
                              ? (Number(finalVacationLeaveBalance) - Number(pendingVacationLeaveDateCount)).toFixed(3)
                              : null}

                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED
                              ? // vacationLeaveBalance
                                (Number(vacationLeaveBalance) - Number(pendingVacationLeaveDateCount)).toFixed(3)
                              : null}

                            {/* if monetization by max 20 leave credits */}
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                              ? finalVacationAndForcedLeaveBalance.toFixed(3)
                              : null}

                            {/* if terminal leave */}
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL ? 0 : null}

                            {watch('typeOfLeaveDetails.leaveName') != LeaveName.MONETIZATION &&
                            watch('typeOfLeaveDetails.leaveName') != LeaveName.TERMINAL &&
                            watch('typeOfLeaveDetails.leaveName') != LeaveName.VACATION &&
                            watch('typeOfLeaveDetails.leaveName') != LeaveName.FORCED
                              ? // vacationLeaveBalance
                                Number(vacationLeaveBalance).toFixed(3)
                              : null}
                          </td>
                          {watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                          watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL ? (
                            <td
                              className={`${
                                watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED &&
                                Number(finalForcedLeaveBalance) - Number(pendingForcedLeaveDateCount) < 0
                                  ? 'bg-red-300'
                                  : ''
                              } border border-slate-200 p-1 text-center text-sm`}
                            >
                              {watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION // finalVacationLeaveBalance
                                ? (Number(forcedLeaveBalance) - Number(pendingForcedLeaveDateCount)).toFixed(3)
                                : null}

                              {watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED // finalVacationLeaveBalance
                                ? (Number(finalForcedLeaveBalance) - Number(pendingForcedLeaveDateCount)).toFixed(3)
                                : null}

                              {watch('typeOfLeaveDetails.leaveName') != LeaveName.MONETIZATION &&
                              watch('typeOfLeaveDetails.leaveName') != LeaveName.TERMINAL &&
                              watch('typeOfLeaveDetails.leaveName') != LeaveName.VACATION &&
                              watch('typeOfLeaveDetails.leaveName') != LeaveName.FORCED
                                ? // vacationLeaveBalance
                                  Number(forcedLeaveBalance).toFixed(3)
                                : null}
                            </td>
                          ) : null}

                          <td
                            className={`${
                              Number(finalSickLeaveBalance) < 0 &&
                              watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK
                                ? 'bg-red-300'
                                : Number(finalSickLeaveBalance) < 10 &&
                                  watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                                ? 'bg-red-300'
                                : ''
                            } border border-slate-200 p-1 text-center text-sm`}
                          >
                            {watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK ||
                            watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                              ? Number(finalSickLeaveBalance).toFixed(3)
                              : /* if terminal leave */
                              watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL
                              ? 0
                              : Number(sickLeaveBalance).toFixed(3)}
                          </td>

                          {watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                          watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL ? (
                            <td
                              className={`${
                                Number(finalSpecialPrivilegekBalance) < 0 &&
                                watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                                  ? 'bg-red-300'
                                  : ''
                              } border border-slate-200 p-1 text-center text-sm`}
                            >
                              {watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_PRIVILEGE
                                ? Number(finalSpecialPrivilegekBalance).toFixed(3)
                                : Number(specialPrivilegeLeaveBalance).toFixed(3)}
                            </td>
                          ) : null}
                        </tr>

                        {watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION ? (
                          <tr className="border border-slate-200 bg-green-100">
                            <td className="border border-slate-200 text-sm p-1">Total</td>
                            <td
                              colSpan={2}
                              className={`${
                                Number(finalVacationAndForcedLeaveBalance) + Number(sickLeaveBalance) < 10 &&
                                watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                                  ? 'bg-red-300'
                                  : ''
                              } border border-slate-200 p-1 text-center text-sm`}
                            >
                              {watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                                ? (
                                    Number(
                                      finalVacationAndForcedLeaveBalance > 0 ? finalVacationAndForcedLeaveBalance : 0
                                    ) + Number(finalSickLeaveBalance)
                                  ).toFixed(3)
                                : 0}
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                <div className={`flex flex-col gap-2 w-full bg-slate-100 text-sm p-2 mt-1`}>
                  <span>{leaveReminder}</span>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                form="ApplyLeaveForm"
                type="submit"
                disabled={
                  Number(vacationLeaveBalance) - Number(pendingVacationLeaveDateCount) >= 0.5 &&
                  Number(sickLeaveBalance) - Number(pendingSickLeaveDateCount) >= 0.5 &&
                  watch('typeOfLeaveDetails.leaveName') === LeaveName.LEAVE_WITHOUT_PAY
                    ? true
                    : //if late filing and justification letter is empty
                    (watch('lateFilingJustification') === '' ||
                        watch('lateFilingJustification') === null ||
                        watch('lateFilingJustification') === '<p></p>') &&
                      lateFiling
                    ? true
                    : //disabled if applying for force leave and is December
                    monthNow === '12' && watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED
                    ? true
                    : //disabled if there are errors in SWR fetches
                    !isEmpty(errorLeaveList) ||
                      !isEmpty(errorUnavailableDates) ||
                      !isEmpty(errorLeaveLedger) ||
                      !isEmpty(errorLeaveTypes)
                    ? true
                    : Number(roundedFinalVacationLeaveBalance) - Number(pendingVacationLeaveDateCount) < 0 &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.VACATION
                    ? true
                    : (Number(vacationLeaveBalance) - Number(pendingVacationLeaveDateCount) < 0.5 ||
                        Number(roundedFinalForcedLeaveBalance) < 0) &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED
                    ? true
                    : roundedFinalSickLeaveBalance < 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.SICK
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
                      watch('typeOfLeaveDetails.leaveName') !== LeaveName.ADOPTION &&
                      watch('typeOfLeaveDetails.leaveName') !== LeaveName.MONETIZATION &&
                      watch('typeOfLeaveDetails.leaveName') !== LeaveName.TERMINAL
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
                    : //disabled if employee is male and is applying for women only leave benefits
                    employeeDetails.profile.sex === 'Male' &&
                      (watch('typeOfLeaveDetails.leaveName') === LeaveName.MATERNITY ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.VAWC ||
                        watch('typeOfLeaveDetails.leaveName') === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN)
                    ? true
                    : employeeDetails.profile.sex === 'Female' &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.PATERNITY
                    ? true
                    : //monetization type is max 20 leave credits and exceeded the 20 credits
                    selectedLeaveMonetizationType === MonetizationType.MAX20 &&
                      leaveBalanceInput > 20 &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                    ? true
                    : selectedLeaveMonetizationType === MonetizationType.MAX50PERCENT &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION &&
                      estimatedAmount > Number(maxMonetizationAmount) / 2
                    ? true
                    : leaveBalanceInput > 0 &&
                      finalSickLeaveBalance < 15 &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                    ? true
                    : //leave balance to convert input is blank
                    leaveBalanceInput <= 0 && watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                    ? true
                    : Number(leaveDates.length > Math.round(vacationLeaveBalance) - pendingVacationLeaveDateCount) &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.FORCED
                    ? true
                    : (estimatedAmount <= 0 || !leaveDateFrom) &&
                      watch('typeOfLeaveDetails.leaveName') === LeaveName.TERMINAL
                    ? true
                    : false
                }
              >
                {watch('typeOfLeaveDetails.leaveName') === LeaveName.MONETIZATION
                  ? 'Apply Monetization'
                  : 'Apply Leave'}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
