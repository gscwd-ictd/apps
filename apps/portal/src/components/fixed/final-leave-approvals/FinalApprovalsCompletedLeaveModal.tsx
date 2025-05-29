import { HiX } from 'react-icons/hi';
import { Modal } from 'libs/oneui/src/components/Modal';
import { Button } from 'libs/oneui/src/components/Button';
import { AlertNotification, LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveName, LeaveStatus, MonetizationType } from 'libs/utils/src/lib/enums/leave.enum';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { useEffect, useState } from 'react';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useFinalLeaveApprovalLeaveLedgerStore } from 'apps/portal/src/store/final-leave-approvals-leave-ledger.store';
import { JustificationLetterPdfModal } from './JustificationLetterPdfModal';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';

type ApprovalsCompletedLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ApprovalsCompletedLeaveModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ApprovalsCompletedLeaveModalProps) => {
  const { leaveIndividualDetail, justificationLetterPdfModalIsOpen, setJustificationLetterPdfModalIsOpen } =
    useFinalLeaveApprovalStore((state) => ({
      leaveIndividualDetail: state.leaveIndividualDetail,
      leaveId: state.leaveId,
      pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
      setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
      justificationLetterPdfModalIsOpen: state.justificationLetterPdfModalIsOpen,
      setJustificationLetterPdfModalIsOpen: state.setJustificationLetterPdfModalIsOpen,
    }));

  const [moreLeaveDates, setMoreLeaveDates] = useState<boolean>(false);
  // Monetization Entry
  const [vlEntry, setVlEntry] = useState<LeaveLedgerEntry>();
  const [slEntry, setSlEntry] = useState<LeaveLedgerEntry>();
  const { windowWidth } = UseWindowDimensions();

  // Search for monetization entries
  const searchMonetizationEntry = (ledger: Array<LeaveLedgerEntry>, refNo: string) => {
    let debitEntries = ledger?.filter((ledger) => ledger.remarks.includes(refNo));

    const debitVl = debitEntries?.filter((entries) => entries.remarks.includes('VL'));
    setVlEntry(debitVl[0]);

    const debitSl = debitEntries?.filter((entries) => entries.remarks.includes('SL'));
    setSlEntry(debitSl[0]);
  };

  useEffect(() => {
    setMoreLeaveDates(false);
  }, [modalState]);

  //FOR LEAVE LEDGER TABLE BELOW
  const {
    leaveLedger,
    selectedLeaveLedger,
    setSelectedLeaveLedger,
    getLeaveLedger,
    getLeaveLedgerSuccess,
    getLeaveLedgerFail,
  } = useFinalLeaveApprovalLeaveLedgerStore((state) => ({
    leaveLedger: state.leaveLedger,
    selectedLeaveLedger: state.selectedLeaveLedger,
    setSelectedLeaveLedger: state.setSelectedLeaveLedger,
    getLeaveLedger: state.getLeaveLedger,
    getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
    getLeaveLedgerFail: state.getLeaveLedgerFail,
  }));

  const leaveLedgerUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/ledger/${
    leaveIndividualDetail?.employee?.employeeId
  }/${leaveIndividualDetail?.employee?.companyId}/${dayjs(leaveIndividualDetail?.dateOfFiling).year()}`;

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
      // getLatestBalance(swrLeaveLedger);
      if (
        leaveIndividualDetail?.leaveName === LeaveName.MONETIZATION &&
        leaveIndividualDetail?.status === LeaveStatus.APPROVED
      ) {
        searchMonetizationEntry(swrLeaveLedger, leaveIndividualDetail?.referenceNo);
      }
    }

    if (!isEmpty(swrLeaveLedgerError)) {
      getLeaveLedgerFail(swrLeaveLedgerLoading, swrLeaveLedgerError.message);
    }
  }, [swrLeaveLedger, swrLeaveLedgerError]);

  // close action for Justification Letter PDF Modal
  const closeJustificationLetterPdfModal = async () => {
    setJustificationLetterPdfModalIsOpen(false);
  };

  return (
    <>
      {/* Leave Ledger Load Failed Error */}
      {!isEmpty(swrLeaveLedgerError) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${swrLeaveLedgerError.message}: Failed to load Leave Ledger.`}
        />
      ) : null}

      <Modal size={windowWidth > 1024 ? 'sm' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Completed Leave Application</span>
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
          {/* Justification Letter PDF Modal */}
          <JustificationLetterPdfModal
            title="Justification Letter"
            modalState={justificationLetterPdfModalIsOpen}
            setModalState={setJustificationLetterPdfModalIsOpen}
            closeModalAction={closeJustificationLetterPdfModal}
          />

          {!leaveIndividualDetail ? (
            <div className="w-full h-[90%]  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
              {/* <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                /> */}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col  ">
              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-0 px-4 rounded">
                  {leaveIndividualDetail.status ? (
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
                          ? 'For HRMO Review '
                          : leaveIndividualDetail?.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION
                          ? 'For HRMO Credit Certification '
                          : leaveIndividualDetail?.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL
                          ? 'For Supervisor Review '
                          : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'Disapproved by HRDM '
                          : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? 'Disapproved by HRMO '
                          : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'Disapproved by Supervisor '
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

                        {leaveIndividualDetail?.leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
                        leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                        leaveIndividualDetail?.leaveName === LeaveName.FORCED ||
                        leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                        leaveIndividualDetail?.leaveName === LeaveName.SICK ||
                        leaveIndividualDetail?.leaveName === LeaveName.STUDY ||
                        leaveIndividualDetail?.leaveName === LeaveName.OTHERS ? (
                          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3">
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              {leaveIndividualDetail?.leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
                              leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
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
                              {leaveIndividualDetail?.leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
                              leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
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

                        {leaveIndividualDetail?.leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
                        leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                        leaveIndividualDetail?.leaveName === LeaveName.FORCED ||
                        leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                        leaveIndividualDetail?.leaveName === LeaveName.SICK ||
                        leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                        (leaveIndividualDetail?.leaveName === LeaveName.STUDY &&
                          leaveIndividualDetail?.studyLeaveOther) ? (
                          <div
                            className={`flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3`}
                          >
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              Specific Details:
                            </label>
                            <div className="w-auto ml-5 mr-5">
                              <label className=" text-md font-medium">
                                {leaveIndividualDetail?.leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
                                leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                                leaveIndividualDetail?.leaveName === LeaveName.FORCED ||
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

                    <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Supervisor:</label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium">
                          {leaveIndividualDetail?.supervisor?.supervisorName}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                        {leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? 'Date Disapproved by HRMO:'
                          : 'Date Approved by HRMO:'}
                      </label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium ">
                          {DateTimeFormatter(leaveIndividualDetail?.hrmoApprovalDate)}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                        {leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'Date Disapproved by Supervisor:'
                          : 'Date Approved by Supervisor:'}
                      </label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium ">
                          {DateTimeFormatter(leaveIndividualDetail?.supervisorApprovalDate)}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                        {leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'Date Disapproved by HRDM:'
                          : 'Date Approved by HRDM:'}
                      </label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium ">
                          {DateTimeFormatter(leaveIndividualDetail?.hrdmApprovalDate)}
                        </label>
                      </div>
                    </div>

                    {leaveIndividualDetail?.status === LeaveStatus.CANCELLED ? (
                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Date Cancelled:</label>

                        <div className="w-auto ml-5">
                          <label className=" text-md font-medium ">
                            {DateTimeFormatter(leaveIndividualDetail?.cancelDate)}
                          </label>
                        </div>
                      </div>
                    ) : null}

                    {leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                    leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                    leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                    leaveIndividualDetail?.status === LeaveStatus.CANCELLED ? (
                      <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                          {leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                            ? 'HRDM Remarks:'
                            : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? 'Supervisor Remarks:'
                            : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                            ? 'HRMO Remarks:'
                            : leaveIndividualDetail?.status === LeaveStatus.CANCELLED
                            ? 'Cancel Reason:'
                            : 'Remarks:'}
                        </label>
                        <div className="w-auto ml-5">
                          <label className=" text-md font-medium">
                            {leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                              ? leaveIndividualDetail?.hrdmDisapprovalRemarks
                              : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                              ? leaveIndividualDetail?.supervisorDisapprovalRemarks
                              : leaveIndividualDetail?.status === LeaveStatus.CANCELLED &&
                                leaveIndividualDetail?.cancelReason != ''
                              ? leaveIndividualDetail?.cancelReason
                              : 'N/A'}
                          </label>
                        </div>
                      </div>
                    ) : null}
                    {(leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                      leaveIndividualDetail?.leaveName === LeaveName.FORCED ||
                      leaveIndividualDetail?.leaveName === LeaveName.SICK ||
                      leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE) &&
                    leaveIndividualDetail?.status === LeaveStatus.APPROVED ? (
                      <div className="w-full pb-4">
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
                        <table className="mt-2 bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                          <tbody>
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Total Earned</td>
                              <td className="border border-slate-400 text-center">Less this application</td>
                              <td className="border border-slate-400 text-center bg-green-100">Balance</td>
                            </tr>
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">
                                {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                                leaveIndividualDetail?.leaveName === LeaveName.FORCED
                                  ? (
                                      parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) +
                                      parseFloat(`${selectedLeaveLedger[0]?.vacationLeave}`) * -1
                                    )
                                      // +
                                      // (parseFloat(`${selectedLeaveLedger[0]?.forcedLeaveBalance}`) +
                                      //   parseFloat(`${selectedLeaveLedger[0]?.forcedLeave}`) * -1)
                                      .toFixed(3)
                                  : // : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                                  // ? (
                                  //     parseFloat(`${selectedLeaveLedger[0]?.forcedLeaveBalance}`) +
                                  //     parseFloat(`${selectedLeaveLedger[0]?.forcedLeave}`) * -1
                                  //   ).toFixed(3)
                                  leaveIndividualDetail?.leaveName === LeaveName.SICK
                                  ? (
                                      parseFloat(`${selectedLeaveLedger[0]?.sickLeaveBalance}`) +
                                      parseFloat(`${selectedLeaveLedger[0]?.sickLeave}`) * -1
                                    ).toFixed(3)
                                  : leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                                  ? (
                                      parseFloat(`${selectedLeaveLedger[0]?.specialPrivilegeLeaveBalance}`) +
                                      parseFloat(`${selectedLeaveLedger[0]?.specialPrivilegeLeave}`) * -1
                                    ).toFixed(3)
                                  : 'N/A'}
                              </td>
                              <td className="border border-slate-400 text-center">
                                {leaveIndividualDetail?.leaveDates?.length.toFixed(3)}
                              </td>
                              <td className="border border-slate-400 text-center bg-green-100">
                                {leaveIndividualDetail?.leaveName === LeaveName.VACATION
                                  ? parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`).toFixed(3)
                                  : leaveIndividualDetail?.leaveName === LeaveName.FORCED
                                  ? (
                                      parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) -
                                      leaveIndividualDetail?.leaveDates?.length
                                    )
                                      // +
                                      // parseFloat(`${selectedLeaveLedger[0]?.forcedLeaveBalance}`)
                                      .toFixed(3)
                                  : leaveIndividualDetail?.leaveName === LeaveName.SICK
                                  ? selectedLeaveLedger[0]?.sickLeaveBalance
                                  : leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                                  ? selectedLeaveLedger[0]?.specialPrivilegeLeaveBalance
                                  : 'N/A'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : leaveIndividualDetail?.leaveName === LeaveName.MONETIZATION &&
                      leaveIndividualDetail?.status === LeaveStatus.APPROVED ? (
                      <div className="w-full pb-4">
                        <span className="text-slate-500 text-md">
                          Employee's Leave Credits at the time of this application:
                        </span>
                        <table className="mt-2 bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                          <tbody>
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Leave Type</td>
                              <td className="border border-slate-400 text-center">Total Earned</td>
                              <td className="border border-slate-400 text-center">Less</td>
                              <td className="border border-slate-400 text-center bg-green-100">Balance</td>
                            </tr>
                            {/* VL BALANCE */}
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Vacation</td>
                              <td className="border border-slate-400 text-center">
                                {(
                                  parseFloat(`${vlEntry?.vacationLeaveBalance}`) +
                                  parseFloat(`${leaveIndividualDetail?.convertedVl}`)
                                ).toFixed(3)}
                              </td>
                              <td className="border border-slate-400 text-center">
                                {leaveIndividualDetail?.convertedVl}
                              </td>
                              <td className="border border-slate-400 text-center bg-green-100">
                                {vlEntry?.vacationLeaveBalance}
                              </td>
                            </tr>
                            {/* SL BALANCE */}
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Sick</td>
                              <td className="border border-slate-400 text-center">
                                {(
                                  parseFloat(`${slEntry?.sickLeaveBalance}`) +
                                  parseFloat(`${leaveIndividualDetail?.convertedSl}`)
                                ).toFixed(3)}
                              </td>
                              <td className="border border-slate-400 text-center">
                                {leaveIndividualDetail?.convertedSl}
                              </td>
                              <td className="border border-slate-400 text-center bg-green-100">
                                {slEntry?.sickLeaveBalance}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : leaveIndividualDetail?.leaveName === LeaveName.TERMINAL ? (
                      <div className="w-full pb-4 mt-2">
                        <span className="text-slate-500 text-md">
                          Employee's Leave Credits at the time of this application:
                        </span>
                        <table className="mt-2 bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full ">
                          <tbody className="rounded-md border">
                            <tr>
                              <td className="border border-slate-400 text-center">Leave Type</td>
                              <td className="border border-slate-400 text-center">Total Earned</td>
                              <td className="border border-slate-400 text-center">Unearned Credits</td>
                              <td className="border border-slate-400 text-center bg-green-100">Balance</td>
                            </tr>
                            {/* VL BALANCE */}
                            <tr className="border-slate-400">
                              <td className="border border-slate-400 text-center">Vacation</td>
                              <td className="border border-slate-400 text-center">
                                {Number(parseFloat(`${leaveIndividualDetail?.vlBalance?.beforeTerminalLeave}`)).toFixed(
                                  3
                                )}
                              </td>
                              <td className="border border-slate-400 text-center">
                                {Number(
                                  parseFloat(`${leaveIndividualDetail?.vlBalance?.afterTerminalLeave}`) -
                                    parseFloat(`${leaveIndividualDetail?.vlBalance?.beforeTerminalLeave}`)
                                ).toFixed(3)}
                              </td>
                              <td className="border border-slate-400 text-center bg-green-100">
                                {Number(parseFloat(`${leaveIndividualDetail?.vlBalance?.afterTerminalLeave}`)).toFixed(
                                  3
                                )}
                              </td>
                            </tr>
                            {/* SL BALANCE */}
                            <tr className="border-slate-400">
                              <td className="border border-slate-400 text-center">Sick</td>
                              <td className="border border-slate-400 text-center">
                                {Number(parseFloat(`${leaveIndividualDetail?.slBalance?.beforeTerminalLeave}`)).toFixed(
                                  3
                                )}
                              </td>

                              <td className="border border-slate-400 text-center">
                                {Number(
                                  parseFloat(`${leaveIndividualDetail?.slBalance?.afterTerminalLeave}`) -
                                    parseFloat(`${leaveIndividualDetail?.slBalance?.beforeTerminalLeave}`)
                                ).toFixed(3)}
                              </td>
                              <td className="border border-slate-400 text-center bg-green-100">
                                {Number(parseFloat(`${leaveIndividualDetail?.slBalance?.afterTerminalLeave}`)).toFixed(
                                  3
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="w-full justify-end flex gap-2">
              {leaveIndividualDetail?.isLateFiling === true ? (
                <Button
                  variant={'primary'}
                  size={'md'}
                  loading={false}
                  onClick={(e) => setJustificationLetterPdfModalIsOpen(true)}
                >
                  Justification
                </Button>
              ) : null}

              <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalsCompletedLeaveModal;
