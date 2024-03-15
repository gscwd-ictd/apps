import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { useApprovalStore } from '../../../store/approvals.store';
import { Modal } from 'libs/oneui/src/components/Modal';
import { Button } from 'libs/oneui/src/components/Button';
import { SpinnerDotted } from 'spinners-react';
import { AlertNotification, OtpModal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { leaveAction } from 'apps/portal/src/types/approvals.type';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { ApprovalOtpContents } from './ApprovalOtp/ApprovalOtpContents';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type ApprovalsPendingLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: `${LeaveStatus.FOR_HRDM_APPROVAL}` },
  { label: 'Disapprove', value: `${LeaveStatus.DISAPPROVED_BY_SUPERVISOR}` },
];

export const ApprovalsPendingLeaveModal = ({
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
    declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen,
  } = useApprovalStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    otpLeaveModalIsOpen: state.otpLeaveModalIsOpen,
    setOtpLeaveModalIsOpen: state.setOtpLeaveModalIsOpen,
    declineApplicationModalIsOpen: state.declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen: state.setDeclineApplicationModalIsOpen,
  }));

  const [reason, setReason] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const [moreLeaveDates, setMoreLeaveDates] = useState<boolean>(false);

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<leaveAction>({
    mode: 'onChange',
    defaultValues: {
      id: leaveIndividualDetail.id,
      status: null,
      supervisorDisapprovalRemarks: '',
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
    if (data.status === LeaveStatus.FOR_HRDM_APPROVAL) {
      setOtpLeaveModalIsOpen(true);
    } else {
      setDeclineApplicationModalIsOpen(true);
    }
  };

  // cancel action for Decline Application Modal
  const closeDeclineModal = async () => {
    setDeclineApplicationModalIsOpen(false);
  };

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const customClose = () => {
    setReason('');
    setAction('approve');
    setPendingLeaveModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={windowWidth > 1024 ? 'sm' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="flex justify-between px-5">
              <span className="text-xl md:text-2xl">Leave Application</span>
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
            <>
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="flex w-full h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col w-full h-full ">
              <div className="flex flex-col w-full h-full gap-2 ">
                <div className="flex flex-col w-full gap-2 px-4 rounded">
                  {leaveIndividualDetail ? (
                    <AlertNotification
                      alertType={
                        leaveIndividualDetail?.status === LeaveStatus.FOR_HRDM_APPROVAL ||
                        leaveIndividualDetail?.status === LeaveStatus.FOR_HRMO_APPROVAL ||
                        leaveIndividualDetail?.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL
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

                  <div className="flex flex-wrap justify-between">
                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Employee Name:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium"> {leaveIndividualDetail?.employee?.employeeName}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Leave Type:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">{leaveIndividualDetail?.leaveName}</label>
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
                    leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                    leaveIndividualDetail?.leaveName === LeaveName.SICK ||
                    leaveIndividualDetail?.leaveName === LeaveName.STUDY ||
                    leaveIndividualDetail?.leaveName === LeaveName.OTHERS ? (
                      <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                          {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
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
                                {leaveIndividualDetail?.forBarBoardReview === '1'
                                  ? 'For BAR/Board Examination Review '
                                  : leaveIndividualDetail?.forMastersCompletion === '1'
                                  ? `Completion of Master's Degree `
                                  : 'Other'}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                    leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                    leaveIndividualDetail?.leaveName === LeaveName.SICK ||
                    leaveIndividualDetail?.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    (leaveIndividualDetail?.leaveName === LeaveName.STUDY && leaveIndividualDetail?.studyLeaveOther) ? (
                      <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Specific Details:</label>
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
                              : //NON OF THE ABOVE
                                ''}
                          </label>
                        </div>
                      </div>
                    ) : null}

                    {leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                    leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                    leaveIndividualDetail?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                    leaveIndividualDetail?.status === LeaveStatus.CANCELLED ? (
                      <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
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
                  </div>

                  {leaveIndividualDetail?.status != LeaveStatus.FOR_HRDM_APPROVAL &&
                  leaveIndividualDetail?.status != LeaveStatus.FOR_HRMO_APPROVAL ? (
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

                      {watch('status') === LeaveStatus.DISAPPROVED_BY_SUPERVISOR ? (
                        <textarea
                          required={true}
                          className={'resize-none mt-4 w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                          placeholder="Enter Reason for Disapproval"
                          rows={3}
                          onChange={(e) => setReason(e.target.value as unknown as string)}
                        ></textarea>
                      ) : null}
                    </form>
                  ) : null}
                </div>
              </div>
            </div>
          )}
          <OtpModal
            modalState={otpLeaveModalIsOpen}
            setModalState={setOtpLeaveModalIsOpen}
            title={'LEAVE APPROVAL OTP'}
          >
            <ApprovalOtpContents
              mobile={employeeDetails.profile.mobileNumber}
              employeeId={employeeDetails.user._id}
              actionLeave={watch('status')}
              tokenId={leaveIndividualDetail.id}
              otpName={ManagerOtpApproval.LEAVE}
            />
          </OtpModal>
          <ConfirmationApprovalModal
            modalState={declineApplicationModalIsOpen}
            setModalState={setDeclineApplicationModalIsOpen}
            closeModalAction={closeDeclineModal}
            actionLeave={watch('status')}
            tokenId={leaveIndividualDetail.id}
            remarks={reason}
            confirmName={ManagerOtpApproval.LEAVE}
            employeeId={employeeDetails.user._id}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="w-full flex justify-end">
              {leaveIndividualDetail?.status != LeaveStatus.FOR_HRDM_APPROVAL &&
              leaveIndividualDetail?.status != LeaveStatus.FOR_HRMO_APPROVAL ? (
                <Button form={`LeaveAction`} variant={'primary'} size={'md'} loading={false} type="submit">
                  Submit
                </Button>
              ) : leaveIndividualDetail?.status ? (
                <Button
                  variant={'default'}
                  size={'md'}
                  loading={false}
                  onClick={(e) => closeModalAction()}
                  type="submit"
                >
                  Close
                </Button>
              ) : null}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalsPendingLeaveModal;
