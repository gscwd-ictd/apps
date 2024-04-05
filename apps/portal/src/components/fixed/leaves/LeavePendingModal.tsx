/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../store/leave.store';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import axios from 'axios';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import CancelLeaveModal from './CancelLeaveModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type LeavePendingModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const LeavePendingModal = ({ modalState, setModalState, closeModalAction }: LeavePendingModalProps) => {
  const {
    leaveIndividualDetail,
    leaveId,
    loadingLeaveDetails,
    errorLeaveDetails,
    pendingLeaveModalIsOpen,
    cancelLeaveModalIsOpen,
    setCancelLeaveModalIsOpen,
    getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    cancelLeaveModalIsOpen: state.cancelLeaveModalIsOpen,
    setCancelLeaveModalIsOpen: state.setCancelLeaveModalIsOpen,
    getLeaveIndividualDetail: state.getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess: state.getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail: state.getLeaveIndividualDetailFail,
  }));

  const { vacationLeaveBalance, forcedLeaveBalance, sickLeaveBalance, specialPrivilegeLeaveBalance } =
    useLeaveLedgerStore((state) => ({
      vacationLeaveBalance: state.vacationLeaveBalance,
      forcedLeaveBalance: state.forcedLeaveBalance,
      sickLeaveBalance: state.sickLeaveBalance,
      specialPrivilegeLeaveBalance: state.specialPrivilegeLeaveBalance,
    }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [moreLeaveDates, setMoreLeaveDates] = useState<boolean>(false);

  const getLeaveDetail = async (leaveId: string) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/details/${employeeDetails.user._id}/${leaveId}`
      );

      if (!isEmpty(data)) {
        console.log(data);
        getLeaveIndividualDetailSuccess(false, data);
      }
    } catch (error) {
      getLeaveIndividualDetailFail(false, error.message);
    }
  };

  useEffect(() => {
    if (pendingLeaveModalIsOpen) {
      getLeaveDetail(leaveId);
      getLeaveIndividualDetail(true);
    }
    setMoreLeaveDates(false);
  }, [pendingLeaveModalIsOpen, leaveId]);

  const { windowWidth } = UseWindowDimensions();

  // cancel action for Leave Pending Modal
  const closeCancelLeaveModal = async () => {
    setCancelLeaveModalIsOpen(false);
  };

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'sm' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Ongoing Leave Application</span>
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
          {/* Cancel Leave Application Modal */}
          <CancelLeaveModal
            modalState={cancelLeaveModalIsOpen}
            setModalState={setCancelLeaveModalIsOpen}
            closeModalAction={closeCancelLeaveModal}
          />
          {loadingLeaveDetails || errorLeaveDetails ? (
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
                <div className="w-full flex flex-col gap-2 px-4 rounded">
                  {leaveIndividualDetail?.leaveApplicationBasicInfo ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage={
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRDM_APPROVAL
                          ? 'Reviewed by Supervisor: For HRDM Final Review'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRMO_APPROVAL
                          ? 'For HRMO Review'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.FOR_SUPERVISOR_APPROVAL
                          ? 'Reviewed by HRMO: For Supervisor Review'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status.charAt(0).toUpperCase() +
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.status.slice(1)
                      }
                      dismissible={false}
                    />
                  ) : null}

                  <div className="flex flex-wrap justify-between">
                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Leave Type:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Number of Days:</label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Leave Dates:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium ">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.REHABILITATION ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                            LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION ? (
                            // show first and last date (array) only if SBL (maternity, study, rehab...)
                            `${DateFormatter(
                              leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates[0],
                              'MM-DD-YYYY'
                            )} - ${DateFormatter(
                              leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates[
                                leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates?.length - 1
                              ],
                              'MM-DD-YYYY'
                            )}`
                          ) : (
                            // show all dates if not SBL (maternity, study, rehab...)
                            <>
                              <ul>
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.map(
                                  (dates: string, index: number) => {
                                    if (moreLeaveDates) {
                                      return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                    } else {
                                      if (index <= 2) return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                    }
                                  }
                                )}
                              </ul>
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length > 3 ? (
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
                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                      LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED ? (
                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                            ? 'Date Disapproved:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? 'Date Disapproved:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_HRMO
                            ? 'Date Disapproved:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                            ? 'Date Approved:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                            ? 'Date Cancelled:'
                            : null}
                        </label>

                        <div className="w-auto ml-5">
                          <label className=" text-md font-medium ">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.DISAPPROVED_BY_HRDM
                              ? DateFormatter(
                                  leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate,
                                  'MM-DD-YYYY'
                                )
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                                LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                              ? DateFormatter(
                                  leaveIndividualDetail?.leaveApplicationBasicInfo?.supervisorApprovalDate,
                                  'MM-DD-YYYY'
                                )
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                                LeaveStatus.DISAPPROVED_BY_HRMO
                              ? DateFormatter(
                                  leaveIndividualDetail?.leaveApplicationBasicInfo?.hrmoApprovalDate,
                                  'MM-DD-YYYY'
                                )
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                              ? DateFormatter(
                                  leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate,
                                  'MM-DD-YYYY'
                                )
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                              ? DateFormatter(
                                  leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelDate,
                                  'MM-DD-YYYY'
                                )
                              : null}
                          </label>
                        </div>
                      </div>
                    ) : null}

                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.OTHERS ? (
                      <div className="flex flex-col justify-start items-start w-full md:w-1/2 px-0.5 pb-3">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                            ? 'Location:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                            ? 'Hospitalization:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY
                            ? 'Study:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.OTHERS
                            ? 'Other Purpose: '
                            : null}
                        </label>

                        <div className="w-auto ml-5">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                            LeaveName.SPECIAL_PRIVILEGE ? (
                            <div className="text-md font-medium">
                              {leaveIndividualDetail?.leaveApplicationDetails?.inPhilippinesOrAbroad}
                            </div>
                          ) : null}

                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ? (
                            <>
                              <div className="text-md font-medium">
                                {leaveIndividualDetail?.leaveApplicationDetails?.hospital}
                              </div>
                            </>
                          ) : null}

                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ? (
                            <>
                              <div className="text-md font-medium">
                                {leaveIndividualDetail?.leaveApplicationDetails?.forBarBoardReview === '1'
                                  ? 'For BAR/Board Examination Review '
                                  : leaveIndividualDetail.leaveApplicationDetails?.forMastersCompletion === '1'
                                  ? `Completion of Master's Degree `
                                  : 'Other'}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                      LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY &&
                      leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther) ? (
                      <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Specific Details:</label>
                        <div className="w-auto ml-5 mr-5">
                          <label className=" text-md font-medium">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                              ? leaveIndividualDetail?.leaveApplicationDetails?.location
                              : leaveIndividualDetail.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                              ? leaveIndividualDetail?.leaveApplicationDetails?.illness
                              : leaveIndividualDetail.leaveApplicationBasicInfo?.leaveName ===
                                LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                              ? leaveIndividualDetail?.leaveApplicationDetails?.splWomen
                              : leaveIndividualDetail.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY &&
                                leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther
                              ? leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther
                              : ''}
                          </label>
                        </div>
                      </div>
                    ) : null}

                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                      LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED ? (
                      <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                            ? 'HRDM Remarks:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? 'Supervisor Remarks:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_HRMO
                            ? 'HRMO Remarks:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                            ? 'Cancel Reason:'
                            : 'Remarks:'}
                        </label>
                        <div className="w-auto ml-5">
                          <label className=" text-md font-medium">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.DISAPPROVED_BY_HRDM
                              ? leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmDisapprovalRemarks
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                                LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                              ? leaveIndividualDetail?.leaveApplicationBasicInfo?.supervisorDisapprovalRemarks
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                              ? leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelReason
                              : 'N/A'}
                          </label>
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Supervisor:</label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium">{'---'}</label>
                      </div>
                    </div>
                  </div>

                  {(leaveIndividualDetail?.leaveApplicationBasicInfo?.status !==
                    LeaveStatus.DISAPPROVED_BY_SUPERVISOR &&
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status !== LeaveStatus.DISAPPROVED_BY_HRDM &&
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status !== LeaveStatus.DISAPPROVED_BY_HRMO &&
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION) ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ? (
                    <div className="w-full pb-4 mt-2">
                      <span className="text-slate-500 text-md">
                        Your current {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName} Leave Credits:
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
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION
                                ? vacationLeaveBalance
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                                ? forcedLeaveBalance
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                                ? sickLeaveBalance
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.SPECIAL_PRIVILEGE
                                ? specialPrivilegeLeaveBalance
                                : 'N/A'}
                            </td>
                            <td className="border border-slate-400 text-center">
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)}
                            </td>
                            <td className="border border-slate-400 text-center bg-green-100">
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION
                                ? (
                                    Number(parseFloat(`${vacationLeaveBalance}`).toFixed(3)) -
                                    Number(
                                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                                    )
                                  ).toFixed(3)
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                                ? (
                                    Number(parseFloat(`${forcedLeaveBalance}`).toFixed(3)) -
                                    Number(
                                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                                    )
                                  ).toFixed(3)
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                                ? (
                                    Number(parseFloat(`${sickLeaveBalance}`).toFixed(3)) -
                                    Number(
                                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                                    )
                                  ).toFixed(3)
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.SPECIAL_PRIVILEGE
                                ? (
                                    Number(parseFloat(`${specialPrivilegeLeaveBalance}`).toFixed(3)) -
                                    Number(
                                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                                    )
                                  ).toFixed(3)
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
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            {leaveIndividualDetail?.leaveApplicationBasicInfo?.status ? (
              <Button
                variant={'warning'}
                size={'md'}
                loading={false}
                onClick={(e) => setCancelLeaveModalIsOpen(true)}
                type="submit"
              >
                Cancel Leave
              </Button>
            ) : null}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeavePendingModal;
