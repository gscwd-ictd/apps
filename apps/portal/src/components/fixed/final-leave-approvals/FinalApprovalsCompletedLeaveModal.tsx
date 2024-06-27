import { HiX } from 'react-icons/hi';
import { Modal } from 'libs/oneui/src/components/Modal';
import { Button } from 'libs/oneui/src/components/Button';
import { SpinnerDotted } from 'spinners-react';
import { AlertNotification } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { useEffect, useState } from 'react';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useFinalLeaveApprovalLeaveLedgerStore } from 'apps/portal/src/store/final-leave-approvals-leave-ledger.store';

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
  const { leaveIndividualDetail } = useFinalLeaveApprovalStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
  }));

  const [moreLeaveDates, setMoreLeaveDates] = useState<boolean>(false);
  const { windowWidth } = UseWindowDimensions();

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
      // getLatestBalance(swrLeaveLedger);
    }

    if (!isEmpty(swrLeaveLedgerError)) {
      getLeaveLedgerFail(swrLeaveLedgerLoading, swrLeaveLedgerError.message);
    }
  }, [swrLeaveLedger, swrLeaveLedgerError]);

  return (
    <>
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
          {!leaveIndividualDetail ? (
            <>
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
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
                                    if (index <= 2) return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
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
                    (leaveIndividualDetail?.leaveName === LeaveName.STUDY && leaveIndividualDetail?.studyLeaveOther) ? (
                      <div className={`flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3`}>
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Specific Details:</label>
                        <div className="w-auto ml-5 mr-5">
                          <label className=" text-md font-medium">
                            {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
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
                        {leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'Date Disapproved:'
                          : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'Date Disapproved:'
                          : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? 'Date Disapproved:'
                          : leaveIndividualDetail?.status === LeaveStatus.APPROVED
                          ? 'Date Approved:'
                          : leaveIndividualDetail?.status === LeaveStatus.CANCELLED
                          ? 'Date Cancelled:'
                          : null}
                      </label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium ">
                          {leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                            ? DateTimeFormatter(leaveIndividualDetail?.hrdmApprovalDate)
                            : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? DateTimeFormatter(leaveIndividualDetail?.supervisorApprovalDate)
                            : leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                            ? DateTimeFormatter(leaveIndividualDetail?.hrmoApprovalDate)
                            : leaveIndividualDetail?.status === LeaveStatus.APPROVED
                            ? DateTimeFormatter(leaveIndividualDetail?.hrdmApprovalDate)
                            : leaveIndividualDetail?.status === LeaveStatus.CANCELLED
                            ? DateTimeFormatter(leaveIndividualDetail?.cancelDate)
                            : null}
                        </label>
                      </div>
                    </div>

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
                              : leaveIndividualDetail?.status === LeaveStatus.CANCELLED
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
                                {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                                leaveIndividualDetail?.leaveName === LeaveName.FORCED
                                  ? parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`)
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
