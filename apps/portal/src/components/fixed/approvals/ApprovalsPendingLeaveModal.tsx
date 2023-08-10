import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { useApprovalStore } from '../../../store/approvals.store';
import { Modal } from 'libs/oneui/src/components/Modal';
import { Button } from 'libs/oneui/src/components/Button';
import { isEmpty } from 'lodash';
import { SpinnerDotted } from 'spinners-react';
import { AlertNotification, OtpModal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { leaveAction } from 'apps/portal/src/types/approvals.type';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { ApprovalOtpContentsLeave } from './ApprovalOtp/ApprovalOtpContentsLeave';
import { ConfirmationLeaveModal } from './ApprovalOtp/ConfirmationLeaveModal';

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

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } =
    useForm<leaveAction>({
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
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);
  const handleReason = (e: string) => {
    setReason(e);
  };

  const customClose = () => {
    setReason('');
    setAction('approve');
    setPendingLeaveModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal
        size={windowWidth > 1024 ? 'lg' : 'full'}
        open={modalState}
        setOpen={setModalState}
      >
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="flex justify-between px-5">
              <span className="text-xl md:text-2xl">
                Leave Application For Approval
              </span>
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
                <div className="flex flex-col w-full gap-2 p-4 rounded">
                  {leaveIndividualDetail ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage={
                        leaveIndividualDetail?.status ===
                        LeaveStatus.FOR_HRDM_APPROVAL
                          ? 'For HRDM Approval'
                          : leaveIndividualDetail?.status ===
                            LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'Disapproved by HRDM '
                          : leaveIndividualDetail?.status ===
                            LeaveStatus.FOR_SUPERVISOR_APPROVAL
                          ? 'For Supervisor Approval '
                          : leaveIndividualDetail?.status ===
                            LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'Disapproved by Supervisor '
                          : leaveIndividualDetail?.status
                      }
                      dismissible={false}
                    />
                  ) : null}

                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                      Employee Name:
                    </label>

                    <div className="w-auto md:w-96">
                      <label className="text-slate-500 h-12 w-96  text-md ">
                        {leaveIndividualDetail?.employee?.employeeName}
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                      Leave Type:
                    </label>

                    <div className="w-96 ">
                      <label className="w-full text-md text-slate-500 ">
                        {leaveIndividualDetail?.leaveBenefitsId?.leaveName}
                      </label>
                    </div>
                  </div>

                  {leaveIndividualDetail?.leaveBenefitsId?.leaveName ? (
                    <>
                      <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                        <label className="text-md font-medium text-slate-500">
                          {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                            'Vacation Leave' ||
                          leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                            'Special Privilege Leave'
                            ? 'Location:'
                            : leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Sick Leave'
                            ? 'Hospitalization:'
                            : leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Study Leave'
                            ? 'Study:'
                            : leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Others'
                            ? 'Other Purpose: '
                            : null}
                        </label>

                        <div className="flex w-96 ">
                          {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                            'Vacation Leave' ||
                          leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                            'Special Privilege Leave' ? (
                            <div className="w-full text-md text-slate-500">
                              {leaveIndividualDetail?.inPhilippines
                                ? 'Within the Philippines'
                                : 'Abroad'}
                            </div>
                          ) : null}

                          {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                          'Sick Leave' ? (
                            <>
                              <div className="w-full text-md text-slate-500">
                                {leaveIndividualDetail?.inHospital
                                  ? 'In Hospital'
                                  : 'Out Patient'}
                              </div>
                            </>
                          ) : null}

                          {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                          'Study Leave' ? (
                            <>
                              <div className="w-full text-md text-slate-500">
                                {leaveIndividualDetail?.forBarBoardReview ===
                                '1'
                                  ? 'For BAR/Board Examination Review '
                                  : leaveIndividualDetail?.forMastersCompletion ===
                                    '1'
                                  ? `Completion of Master's Degree `
                                  : 'Other'}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center w-full">
                        <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                          Leave Dates:
                        </label>

                        <div className="w-auto sm:w-96">
                          <label className="text-slate-500 h-12 w-96  text-md ">
                            {leaveIndividualDetail?.leaveBenefitsId
                              ?.leaveName === 'Maternity Leave' ||
                            leaveIndividualDetail?.leaveBenefitsId
                              ?.leaveName === 'Study Leave'
                              ? // show first and last date (array) only if maternity or study leave
                                `From ${
                                  leaveIndividualDetail?.leaveDates[0]
                                } To ${
                                  leaveIndividualDetail?.leaveDates[
                                    leaveIndividualDetail?.leaveDates.length - 1
                                  ]
                                }`
                              : // show all dates if not maternity or study leave
                                leaveIndividualDetail?.leaveDates.join(', ')}
                          </label>
                        </div>
                      </div>

                      {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Vacation Leave' ||
                      leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Special Privilege Leave' ||
                      leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Sick Leave' ||
                      leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Special Leave Benefits for Women' ||
                      (leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Study Leave' &&
                        leaveIndividualDetail?.leaveBenefitsId?.leaveName) ? (
                        <div className="flex flex-col items-center justify-between w-full">
                          <div className="flex flex-row items-center justify-between w-full">
                            <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                              Specific Details:
                            </label>
                          </div>
                          <textarea
                            disabled
                            rows={3}
                            className="w-full p-2 mt-2 text-md rounded resize-none text-slate-500 border-slate-300"
                            value={
                              //VACATION OR SPL //
                              leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Vacation Leave' ||
                              leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Special Privilege Leave'
                                ? leaveIndividualDetail.inPhilippines
                                  ? leaveIndividualDetail.inPhilippines
                                  : leaveIndividualDetail.abroad
                                : //SICK LEAVE
                                leaveIndividualDetail?.leaveBenefitsId
                                    ?.leaveName === 'Sick Leave'
                                ? leaveIndividualDetail.inHospital
                                  ? leaveIndividualDetail.inHospital
                                  : leaveIndividualDetail.outPatient
                                : //SLB FOR WOMEN
                                leaveIndividualDetail?.leaveBenefitsId
                                    ?.leaveName ===
                                  'Special Leave Benefits for Women'
                                ? leaveIndividualDetail.splWomen
                                : //NON OF THE ABOVE
                                  ''
                            }
                          ></textarea>
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  <form id="LeaveAction" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full flex gap-2 justify-start items-center pt-4">
                      <span className="text-slate-500 text-md font-medium">
                        Action:
                      </span>

                      <select
                        id="action"
                        className="text-slate-500 h-12 w-42 rounded text-md border-slate-300"
                        required
                        {...register('status')}
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        {approvalAction.map(
                          (item: SelectOption, idx: number) => (
                            <option value={item.value} key={idx}>
                              {item.label}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {watch('status') ===
                    LeaveStatus.DISAPPROVED_BY_SUPERVISOR ? (
                      <textarea
                        required={true}
                        className={
                          'resize-none mt-3 w-full p-2 rounded text-slate-500 text-md border-slate-300'
                        }
                        placeholder="Enter Reason"
                        rows={3}
                        onChange={(e) =>
                          handleReason(e.target.value as unknown as string)
                        }
                      ></textarea>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>
          )}
          <OtpModal
            modalState={otpLeaveModalIsOpen}
            setModalState={setOtpLeaveModalIsOpen}
            title={'LEAVE APPROVAL OTP'}
          >
            {/* contents */}
            <ApprovalOtpContentsLeave
              mobile={employeeDetail.profile.mobileNumber}
              employeeId={employeeDetail.user._id}
              action={watch('status')}
              tokenId={leaveIndividualDetail.id}
              otpName={'supervisorLeaveApproval'}
            />
          </OtpModal>
          <ConfirmationLeaveModal
            modalState={declineApplicationModalIsOpen}
            setModalState={setDeclineApplicationModalIsOpen}
            closeModalAction={closeDeclineModal}
            action={watch('status')}
            tokenId={leaveIndividualDetail.id}
            remarks={reason}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="w-full flex justify-end">
              <Button
                form={`LeaveAction`}
                variant={'primary'}
                size={'md'}
                loading={false}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalsPendingLeaveModal;
