/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal, OtpModal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import { EmployeeOvertimeDetail } from 'libs/utils/src/lib/types/overtime.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { overtimeAction } from 'apps/portal/src/types/approvals.type';
import { useEffect, useState } from 'react';
import { ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { ApprovalOtpContents } from './ApprovalOtp/ApprovalOtpContents';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: `${OvertimeStatus.APPROVED}` },
  { label: 'Disapprove', value: `${OvertimeStatus.DISAPPROVED}` },
];

export const OvertimeModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeDetails,
    pendingOvertimeModalIsOpen,
    otpOvertimeModalIsOpen,
    setOtpOvertimeModalIsOpen,
    declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen,
  } = useApprovalStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
    otpOvertimeModalIsOpen: state.otpOvertimeModalIsOpen,
    setOtpOvertimeModalIsOpen: state.setOtpOvertimeModalIsOpen,
    declineApplicationModalIsOpen: state.declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen: state.setDeclineApplicationModalIsOpen,
  }));

  const [reason, setReason] = useState<string>('');

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<overtimeAction>({
    mode: 'onChange',
    defaultValues: {
      status: null,
    },
  });

  // cancel action for Decline Application Modal
  const closeDeclineModal = async () => {
    setDeclineApplicationModalIsOpen(false);
  };

  const onSubmit: SubmitHandler<overtimeAction> = (data: overtimeAction) => {
    if (data.status === OvertimeStatus.APPROVED) {
      setOtpOvertimeModalIsOpen(true);
    } else {
      setDeclineApplicationModalIsOpen(true);
    }
  };

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  useEffect(() => {
    reset();
  }, [pendingOvertimeModalIsOpen]);

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Application</span>
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
          {/* Cancel Overtime Application Modal */}
          {/* <CancelOvertimeModal
            modalState={cancelOvertimeModalIsOpen}
            setModalState={setCancelOvertimeModalIsOpen}
            closeModalAction={closeCancelOvertimeModal}
          /> */}

          {!overtimeDetails ? (
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
                <div className="w-full flex flex-col gap-2 p-4 rounded">
                  <AlertNotification
                    alertType={
                      overtimeDetails.status === OvertimeStatus.PENDING
                        ? 'warning'
                        : overtimeDetails.status === OvertimeStatus.APPROVED
                        ? 'info'
                        : overtimeDetails.status === OvertimeStatus.DISAPPROVED
                        ? 'error'
                        : 'info'
                    }
                    notifMessage={
                      overtimeDetails.status === OvertimeStatus.PENDING
                        ? 'For Supervisor Approval'
                        : overtimeDetails.status === OvertimeStatus.APPROVED
                        ? 'Approved'
                        : overtimeDetails.status === OvertimeStatus.DISAPPROVED
                        ? 'Disapproved'
                        : 'info'
                    }
                    dismissible={false}
                  />

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Overtime Date:</label>

                      <div className="w-full md:w-96 ">
                        <label className="text-slate-500 w-full text-md ">
                          {DateFormatter(overtimeDetails.plannedDate)}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Estimated Hours:</label>

                      <div className="w-full md:w-96 ">
                        <label className="text-slate-500 w-full text-md ">{overtimeDetails.estimatedHours}</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Employees:</label>

                      <div className="w-full ">
                        <label className="text-slate-500 w-full text-md flex flex-col">
                          {overtimeDetails?.employees?.map((employee: EmployeeOvertimeDetail, index: number) => {
                            return (
                              <div
                                key={index}
                                className={`${
                                  index != 0 ? 'border-t border-slate-200' : ''
                                } p-2 md:p-4 flex flex-row justify-between items-center gap-8 `}
                              >
                                <img
                                  className="rounded-full border border-stone-100 shadow w-20"
                                  src={employee?.avatarUrl ?? ''}
                                  alt={'photo'}
                                ></img>
                                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
                                  <div className="w-full flex flex-row items-center gap-4 text-sm md:text-md">
                                    <label className="w-full">{employee.fullName}</label>
                                    <label className="w-full">{employee.positionTitle}</label>
                                    <label className="w-full">{employee.assignment}</label>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Purpose:</label>
                    </div>
                    <textarea
                      disabled
                      rows={2}
                      className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                      value={overtimeDetails.purpose}
                    ></textarea>
                  </div>

                  {overtimeDetails.status === OvertimeStatus.DISAPPROVED ? (
                    <div className="flex flex-col justify-between items-center w-full">
                      <div className="flex flex-row justify-between items-center w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">Remarks:</label>
                      </div>
                      <textarea
                        disabled
                        rows={2}
                        className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                        value={overtimeDetails.remarks}
                      ></textarea>
                    </div>
                  ) : null}
                  {overtimeDetails.status === OvertimeStatus.PENDING ? (
                    <form id="OvertimeAction" onSubmit={handleSubmit(onSubmit)}>
                      <div className="w-full flex gap-2 justify-start items-center pt-4">
                        <span className="text-slate-500 text-md font-medium">Action:</span>

                        <select
                          id="action"
                          className="text-slate-500 h-12 w-42 rounded text-md border-slate-300"
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

                      {watch('status') === OvertimeStatus.DISAPPROVED ? (
                        <textarea
                          required={true}
                          className={'resize-none mt-3 w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                          placeholder="Enter Reason"
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
            modalState={otpOvertimeModalIsOpen}
            setModalState={setOtpOvertimeModalIsOpen}
            title={'OVERTIME APPROVAL OTP'}
          >
            {/* contents */}
            <ApprovalOtpContents
              mobile={employeeDetails.profile.mobileNumber}
              employeeId={employeeDetails.user._id}
              actionOvertime={watch('status')}
              tokenId={overtimeDetails.id}
              otpName={ManagerOtpApproval.OVERTIME}
            />
          </OtpModal>
          <ConfirmationApprovalModal
            modalState={declineApplicationModalIsOpen}
            setModalState={setDeclineApplicationModalIsOpen}
            closeModalAction={closeDeclineModal}
            actionOvertime={watch('status')}
            tokenId={overtimeDetails.id}
            remarks={reason}
            otpName={ManagerOtpApproval.OVERTIME}
            employeeId={employeeDetails.user._id}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            {overtimeDetails.status === OvertimeStatus.PENDING ? (
              <Button variant={'primary'} size={'md'} loading={false} form={`OvertimeAction`} type="submit">
                Submit
              </Button>
            ) : (
              <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
                Close
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeModal;
