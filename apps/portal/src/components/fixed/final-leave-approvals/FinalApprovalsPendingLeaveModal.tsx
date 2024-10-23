import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { Modal } from 'libs/oneui/src/components/Modal';
import { Button } from 'libs/oneui/src/components/Button';
import { SpinnerDotted } from 'spinners-react';
import { AlertNotification, CaptchaModal, OtpModal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { leaveAction } from 'apps/portal/src/types/approvals.type';
import { LeaveName, LeaveStatus, MonetizationType } from 'libs/utils/src/lib/enums/leave.enum';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';
import { ConfirmationLeaveModal } from './FinalApprovalOtp/ConfirmationLeaveModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { isEmpty } from 'lodash';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import { useFinalLeaveApprovalLeaveLedgerStore } from 'apps/portal/src/store/final-leave-approvals-leave-ledger.store';
import { ApprovalCaptcha } from './FinalApprovalOtp/ApprovalCaptcha';

type ApprovalsPendingLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: `${LeaveStatus.APPROVED}` },
  { label: 'Disapprove', value: `${LeaveStatus.DISAPPROVED_BY_HRDM}` },
];

export const FinalApprovalsPendingLeaveModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ApprovalsPendingLeaveModalProps) => {
  const {
    leaveIndividualDetail,
    pendingLeaveModalIsOpen,
    setPendingLeaveModalIsOpen,
    otpLeaveModalIsOpen,
    setOtpLeaveModalIsOpen,
    confirmApplicationModalIsOpen,
    setConfirmApplicationModalIsOpen,
    captchaLeaveModalIsOpen,
    setCaptchaLeaveModalIsOpen,
  } = useFinalLeaveApprovalStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    otpLeaveModalIsOpen: state.otpLeaveModalIsOpen,
    setOtpLeaveModalIsOpen: state.setOtpLeaveModalIsOpen,
    confirmApplicationModalIsOpen: state.confirmApplicationModalIsOpen,
    setConfirmApplicationModalIsOpen: state.setConfirmApplicationModalIsOpen,
    captchaLeaveModalIsOpen: state.captchaLeaveModalIsOpen,
    setCaptchaLeaveModalIsOpen: state.setCaptchaLeaveModalIsOpen,
  }));

  const [reason, setReason] = useState<string>('');
  const [moreLeaveDates, setMoreLeaveDates] = useState<boolean>(false);

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<leaveAction>({
    mode: 'onChange',
    defaultValues: {
      id: leaveIndividualDetail.id,
      status: null,
      hrdmDisapprovalRemarks: '',
    },
  });

  useEffect(() => {
    setValue('id', leaveIndividualDetail.id);
  }, [leaveIndividualDetail.id]);

  useEffect(() => {
    if (!modalState) {
      setValue('status', null);
    }
    setMoreLeaveDates(false);
  }, [modalState]);

  const onSubmit: SubmitHandler<leaveAction> = (data: leaveAction) => {
    setValue('id', leaveIndividualDetail.id);
    if (data.status === LeaveStatus.APPROVED) {
      setConfirmApplicationModalIsOpen(true);
    } else {
      setConfirmApplicationModalIsOpen(true);
    }
  };

  // cancel action for Decline Application Modal
  const closeConfirmModal = async () => {
    setConfirmApplicationModalIsOpen(false);
  };

  // set state for employee store
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);
  const handleReason = (e: string) => {
    setReason(e);
  };

  const customClose = () => {
    setReason('');
    setPendingLeaveModalIsOpen(false);
  };

  //FOR LEAVE LEDGER TABLE BELOW
  const {
    leaveLedger,
    selectedLeaveLedger,
    vacationLeaveBalance,
    forcedLeaveBalance,
    sickLeaveBalance,
    specialPrivilegeLeaveBalance,
    setVacationLeaveBalance,
    setForcedLeaveBalance,
    setSickLeaveBalance,
    setSpecialPrivilegeLeaveBalance,
    setSelectedLeaveLedger,
    getLeaveLedger,
    getLeaveLedgerSuccess,
    getLeaveLedgerFail,
  } = useFinalLeaveApprovalLeaveLedgerStore((state) => ({
    leaveLedger: state.leaveLedger,
    selectedLeaveLedger: state.selectedLeaveLedger,
    vacationLeaveBalance: state.vacationLeaveBalance,
    forcedLeaveBalance: state.forcedLeaveBalance,
    sickLeaveBalance: state.sickLeaveBalance,
    specialPrivilegeLeaveBalance: state.specialPrivilegeLeaveBalance,
    setVacationLeaveBalance: state.setVacationLeaveBalance,
    setForcedLeaveBalance: state.setForcedLeaveBalance,
    setSickLeaveBalance: state.setSickLeaveBalance,
    setSpecialPrivilegeLeaveBalance: state.setSpecialPrivilegeLeaveBalance,
    setSelectedLeaveLedger: state.setSelectedLeaveLedger,
    getLeaveLedger: state.getLeaveLedger,
    getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
    getLeaveLedgerFail: state.getLeaveLedgerFail,
  }));

  // get the latest balance by last index value
  const getLatestBalance = (leaveLedger: Array<LeaveLedgerEntry>) => {
    const lastIndexValue = leaveLedger[leaveLedger.length - 1];
    setForcedLeaveBalance(lastIndexValue.forcedLeaveBalance);
    setVacationLeaveBalance(lastIndexValue.vacationLeaveBalance ?? 0);
    setSickLeaveBalance(lastIndexValue.sickLeaveBalance ?? 0);
    setSpecialPrivilegeLeaveBalance(lastIndexValue.specialPrivilegeLeaveBalance ?? 0);
  };

  const leaveLedgerUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/ledger/${leaveIndividualDetail?.employee?.employeeId}/${leaveIndividualDetail?.employee?.companyId}`;

  const {
    data: swrLeaveLedger,
    isLoading: swrLeaveLedgerLoading,
    error: swrLeaveLedgerError,
  } = useSWR(
    modalState && leaveIndividualDetail.employee.employeeId && leaveIndividualDetail?.employee?.companyId
      ? leaveLedgerUrl
      : null,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrLeaveLedgerLoading) {
      getLeaveLedger(swrLeaveLedgerLoading);
    }
  }, [swrLeaveLedgerLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveLedger)) {
      setSelectedLeaveLedger(swrLeaveLedger, leaveIndividualDetail.id);
      getLeaveLedgerSuccess(swrLeaveLedgerLoading, swrLeaveLedger);
      getLatestBalance(swrLeaveLedger);
    }

    if (!isEmpty(swrLeaveLedgerError)) {
      getLeaveLedgerFail(swrLeaveLedgerLoading, swrLeaveLedgerError.message);
    }
  }, [swrLeaveLedger, swrLeaveLedgerError]);

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={windowWidth > 1024 ? 'sm' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="flex justify-between px-5">
              <span className="text-xl md:text-2xl">Leave Application For Approval</span>
              <button
                className="px-2 rounded-full hover:bg-slate-100 outline-slate-100 outline-8"
                onClick={customClose}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {!leaveIndividualDetail ? (
            <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
              <SpinnerDotted
                speed={70}
                thickness={70}
                className="flex w-full h-full transition-all "
                color="slateblue"
                size={100}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full h-full ">
              <div className="flex flex-col w-full h-full gap-2 ">
                <div className="flex flex-col w-full gap-0 px-4 rounded">
                  {leaveIndividualDetail ? (
                    <AlertNotification
                      alertType={
                        leaveIndividualDetail?.status === LeaveStatus.FOR_HRDM_APPROVAL ||
                        leaveIndividualDetail?.status === LeaveStatus.FOR_HRMO_APPROVAL ||
                        leaveIndividualDetail?.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                        leaveIndividualDetail?.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION
                          ? 'warning'
                          : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                            leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                            leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                            leaveIndividualDetail?.status === LeaveStatus.CANCELLED
                          ? 'error'
                          : leaveIndividualDetail?.status === LeaveStatus.APPROVED
                          ? 'success'
                          : 'info'
                      }
                      notifMessage={
                        leaveIndividualDetail?.status === LeaveStatus.FOR_HRDM_APPROVAL
                          ? 'For HRDM Review'
                          : leaveIndividualDetail?.status === LeaveStatus.FOR_HRMO_APPROVAL
                          ? 'For HRMO Review'
                          : leaveIndividualDetail?.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION
                          ? 'For HRMO Credit Certification'
                          : leaveIndividualDetail?.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL
                          ? 'For Supervisor Review'
                          : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'Disapproved by HRDM'
                          : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? 'Disapproved by HRMO'
                          : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'Disapproved by Supervisor'
                          : leaveIndividualDetail?.status === LeaveStatus.CANCELLED
                          ? 'Cancelled'
                          : leaveIndividualDetail?.status === LeaveStatus.APPROVED
                          ? 'Approved'
                          : leaveIndividualDetail?.status
                      }
                      dismissible={false}
                    />
                  ) : null}

                  {leaveIndividualDetail?.isLateFiling ? (
                    <AlertNotification alertType="error" notifMessage={'Late Filing'} dismissible={false} />
                  ) : null}

                  <div className="flex flex-wrap justify-between">
                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Employee Name:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium"> {leaveIndividualDetail?.employee?.employeeName}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Date of Application:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">
                          {DateTimeFormatter(leaveIndividualDetail.dateOfFiling)}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Leave Type:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">{leaveIndividualDetail?.leaveName}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Reference No.:</label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium">{leaveIndividualDetail?.referenceNo}</label>
                      </div>
                    </div>

                    {leaveIndividualDetail?.leaveName !== LeaveName.MONETIZATION &&
                    leaveIndividualDetail?.leaveName !== LeaveName.TERMINAL ? (
                      //IF NOT MONETIZATION AND NOT TERMINAL
                      <>
                        <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                          <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Leave Dates:</label>

                          <div className="w-auto ml-5">
                            <label className="text-md font-medium ">
                              {leaveIndividualDetail?.leaveName === LeaveName.MATERNITY ||
                              leaveIndividualDetail?.leaveName === LeaveName.STUDY ||
                              leaveIndividualDetail?.leaveName === LeaveName.REHABILITATION ||
                              leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                              leaveIndividualDetail?.leaveName === LeaveName.ADOPTION ? (
                                // show first and last date (array) only if SBL (maternity, study, rehab...)
                                `${DateFormatter(leaveIndividualDetail.leaveDates[0], 'MM-DD-YYYY')} - ${DateFormatter(
                                  leaveIndividualDetail.leaveDates[leaveIndividualDetail.leaveDates?.length - 1],
                                  'MM-DD-YYYY'
                                )}`
                              ) : (
                                // show all dates if not SBL (maternity, study, rehab...)
                                <>
                                  <ul>
                                    {leaveIndividualDetail?.leaveDates?.map((dates: string, index: number) => {
                                      if (moreLeaveDates) {
                                        return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                      } else {
                                        if (index <= 2)
                                          return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                      }
                                    })}
                                  </ul>
                                  {leaveIndividualDetail?.leaveDates?.length > 3 ? (
                                    <label
                                      className="cursor-pointer text-sm text-indigo-500 hover:text-indigo-600"
                                      onClick={(e) => setMoreLeaveDates(!moreLeaveDates)}
                                    >
                                      {moreLeaveDates ? 'Less...' : 'More...'}
                                    </label>
                                  ) : null}
                                </>
                              )}
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                          <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Number of Days:</label>

                          <div className="w-auto ml-5">
                            <label className=" text-md font-medium">{leaveIndividualDetail?.leaveDates?.length}</label>
                          </div>
                        </div>

                        {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                        leaveIndividualDetail?.leaveName === LeaveName.FORCED ||
                        leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                        leaveIndividualDetail?.leaveName === LeaveName.SICK ||
                        leaveIndividualDetail?.leaveName === LeaveName.STUDY ||
                        leaveIndividualDetail?.leaveName === LeaveName.OTHERS ? (
                          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3">
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                              leaveIndividualDetail?.leaveName === LeaveName.FORCED ||
                              leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                                ? 'Location:'
                                : leaveIndividualDetail?.leaveName === LeaveName.SICK
                                ? 'Hospitalization:'
                                : leaveIndividualDetail?.leaveName === LeaveName.STUDY
                                ? 'Study:'
                                : leaveIndividualDetail?.leaveName === LeaveName.OTHERS
                                ? 'Other Purpose: '
                                : null}
                            </label>

                            <div className="w-auto ml-5">
                              {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                              leaveIndividualDetail?.leaveName === LeaveName.FORCED ||
                              leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE ? (
                                <div className="text-md font-medium">
                                  {leaveIndividualDetail?.inPhilippines ? 'Within the Philippines' : 'Abroad'}
                                </div>
                              ) : null}

                              {leaveIndividualDetail?.leaveName === LeaveName.SICK ? (
                                <>
                                  <div className="text-md font-medium">
                                    {leaveIndividualDetail?.inHospital ? 'In Hospital' : 'Out Patient'}
                                  </div>
                                </>
                              ) : null}

                              {leaveIndividualDetail?.leaveName === LeaveName.STUDY ? (
                                <>
                                  <div className="text-md font-medium">
                                    {leaveIndividualDetail?.forBarBoardReview
                                      ? 'For BAR/Board Examination Review '
                                      : leaveIndividualDetail?.forMastersCompletion
                                      ? `Completion of Master's Degree `
                                      : 'Other'}
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </div>
                        ) : null}

                        {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                        leaveIndividualDetail?.leaveName === LeaveName.FORCED ||
                        leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                        leaveIndividualDetail?.leaveName === LeaveName.SICK ||
                        leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                        (leaveIndividualDetail?.leaveName === LeaveName.STUDY &&
                          leaveIndividualDetail?.studyLeaveOther) ? (
                          <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3">
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              Specific Details:
                            </label>
                            <div className="w-auto ml-5 mr-5">
                              <label className=" text-md font-medium">
                                {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                                leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                                  ? leaveIndividualDetail.inPhilippines
                                    ? leaveIndividualDetail.inPhilippines
                                    : leaveIndividualDetail.abroad
                                  : //SICK LEAVE
                                  leaveIndividualDetail?.leaveName === LeaveName.SICK
                                  ? leaveIndividualDetail.inHospital
                                    ? leaveIndividualDetail.inHospital
                                    : leaveIndividualDetail.outPatient
                                  : //SLB FOR WOMEN
                                  leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                                  ? leaveIndividualDetail.splWomen
                                  : leaveIndividualDetail?.leaveName === LeaveName.STUDY &&
                                    leaveIndividualDetail?.studyLeaveOther
                                  ? leaveIndividualDetail?.studyLeaveOther
                                  : //NON OF THE ABOVE
                                    ''}
                              </label>
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      //IF MONETIZATION OR TERMINAL
                      <>
                        {leaveIndividualDetail?.leaveName === LeaveName.MONETIZATION ? (
                          <>
                            <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                              <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Type:</label>

                              <div className="w-auto ml-5">
                                <label className=" text-md font-medium">
                                  {leaveIndividualDetail?.monetizationType == MonetizationType.MAX20
                                    ? 'Max 20 Credits'
                                    : 'Max 50% of Credits'}
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                              <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                                Converted Credits:
                              </label>

                              <div className="w-auto ml-5">
                                <label className=" text-md font-medium">
                                  VL: {leaveIndividualDetail?.convertedVl} / SL: {leaveIndividualDetail?.convertedSl}
                                </label>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {leaveIndividualDetail?.leaveName === LeaveName.TERMINAL ? (
                          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              Converted Credits:
                            </label>

                            <div className="w-auto ml-5">
                              <label className=" text-md font-medium">
                                VL: {leaveIndividualDetail?.vlBalance.afterTerminalLeave} / SL:{' '}
                                {leaveIndividualDetail?.slBalance.afterTerminalLeave}
                              </label>
                            </div>
                          </div>
                        ) : null}

                        <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                          <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Amount:</label>

                          <div className="w-auto ml-5">
                            <label className=" text-md font-medium">{leaveIndividualDetail?.monetizedAmount}</label>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Supervisor:</label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium">
                          {leaveIndividualDetail?.supervisor?.supervisorName}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                        {leaveIndividualDetail?.status === LeaveStatus.FOR_HRDM_APPROVAL ? 'Date Approved:' : null}
                      </label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium ">
                          {leaveIndividualDetail?.status === LeaveStatus.FOR_HRDM_APPROVAL
                            ? DateTimeFormatter(leaveIndividualDetail?.supervisorApprovalDate)
                            : null}
                        </label>
                      </div>
                    </div>

                    {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                    leaveIndividualDetail?.leaveName === LeaveName.FORCED ||
                    leaveIndividualDetail?.leaveName === LeaveName.SICK ||
                    leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE ? (
                      <div className="w-full pb-4 mt-2">
                        <span className="text-slate-500 text-md">
                          Employee's{' '}
                          {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                          leaveIndividualDetail?.leaveName === LeaveName.FORCED
                            ? 'VL'
                            : leaveIndividualDetail?.leaveName === LeaveName.SICK
                            ? 'SL'
                            : leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                            ? 'SPL'
                            : 'Leave'}{' '}
                          Credits at the time of this application:
                        </span>
                        <table className="mt-2 bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full ">
                          <tbody className="rounded-md border">
                            <tr className="">
                              <td className="border border-slate-400 text-center">Total Earned</td>
                              <td className="border border-slate-400 text-center">Less this application</td>
                              <td className="border border-slate-400 text-center bg-green-100">Balance</td>
                            </tr>
                            <tr className="border-slate-400">
                              <td className="border border-slate-400 text-center">
                                {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                                leaveIndividualDetail?.leaveName === LeaveName.FORCED
                                  ? parseFloat(`${vacationLeaveBalance}`)
                                      // + parseFloat(`${forcedLeaveBalance}`)
                                      .toFixed(3)
                                  : leaveIndividualDetail?.leaveName === LeaveName.SICK
                                  ? sickLeaveBalance
                                  : leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                                  ? specialPrivilegeLeaveBalance
                                  : 'N/A'}
                              </td>
                              <td className="border border-slate-400 text-center">
                                {leaveIndividualDetail?.leaveDates?.length.toFixed(3)}
                              </td>
                              <td className="border border-slate-400 text-center bg-green-100">
                                {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                                leaveIndividualDetail?.leaveName === LeaveName.FORCED
                                  ? (
                                      parseFloat(`${vacationLeaveBalance}`) -
                                      // +
                                      // parseFloat(`${forcedLeaveBalance}`)
                                      leaveIndividualDetail?.leaveDates?.length
                                    ).toFixed(3)
                                  : leaveIndividualDetail?.leaveName === LeaveName.SICK
                                  ? (
                                      parseFloat(`${sickLeaveBalance}`) - leaveIndividualDetail?.leaveDates?.length
                                    ).toFixed(3)
                                  : leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                                  ? (
                                      parseFloat(`${specialPrivilegeLeaveBalance}`) -
                                      leaveIndividualDetail?.leaveDates?.length
                                    ).toFixed(3)
                                  : 'N/A'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>
                  <form id="LeaveAction" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-end items-start md:items-center">
                      <span className="text-slate-500 text-md">Action:</span>

                      <select
                        id="action"
                        className="text-slate-500 h-12 w-full md:w-40 rounded-md text-md border-slate-300"
                        required
                        {...register('status')}
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        {approvalAction.map((item: SelectOption, idx: number) => (
                          <option value={item.value} key={idx}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {watch('status') === LeaveStatus.DISAPPROVED_BY_HRDM ? (
                      <textarea
                        required={true}
                        className={'resize-none mt-4 w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                        placeholder="Enter Reason for Disapproval"
                        rows={3}
                        onChange={(e) => handleReason(e.target.value as unknown as string)}
                      ></textarea>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* <CaptchaModal
            modalState={captchaLeaveModalIsOpen}
            setModalState={setCaptchaLeaveModalIsOpen}
            title={'FINAL LEAVE APPROVAL CAPTCHA'}
          >
            <ApprovalCaptcha
              employeeId={employeeDetail.user._id}
              action={watch('status')}
              tokenId={leaveIndividualDetail.id}
              captchaName={'Final Leave Approval'}
            />
          </CaptchaModal> */}

          {/* <OtpModal
            modalState={otpLeaveModalIsOpen}
            setModalState={setOtpLeaveModalIsOpen}
            title={'FINAL LEAVE APPROVAL OTP'}
          >
            <ApprovalOtpContentsLeave
              mobile={employeeDetail.profile.mobileNumber}
              employeeId={employeeDetail.user._id}
              action={watch('status')}
              tokenId={leaveIndividualDetail.id}
              otpName={'hrdmLeaveApproval'}
            />
          </OtpModal> */}

          <ConfirmationLeaveModal
            modalState={confirmApplicationModalIsOpen}
            setModalState={setConfirmApplicationModalIsOpen}
            closeModalAction={closeConfirmModal}
            action={watch('status')}
            tokenId={leaveIndividualDetail.id}
            remarks={reason}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="w-full flex justify-end">
              <Button form={`LeaveAction`} variant={'primary'} size={'md'} loading={false} type="submit">
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FinalApprovalsPendingLeaveModal;
