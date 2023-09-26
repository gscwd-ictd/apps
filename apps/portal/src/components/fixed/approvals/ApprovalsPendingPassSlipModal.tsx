/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal, OtpModal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEffect } from 'react';
import { useApprovalStore } from '../../../../src/store/approvals.store';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { ApprovalOtpContents } from './ApprovalOtp/ApprovalOtpContents';
import { ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type PassSlipPendingModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: 'approved' },
  { label: 'Disapprove', value: 'disapproved' },
];

export const ApprovalsPendingPassSlipModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipPendingModalProps) => {
  const {
    passSlip,
    otpPassSlipModalIsOpen,
    setOtpPassSlipModalIsOpen,
    declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen,
  } = useApprovalStore((state) => ({
    passSlip: state.passSlipIndividualDetail,
    otpPassSlipModalIsOpen: state.otpPassSlipModalIsOpen,
    setOtpPassSlipModalIsOpen: state.setOtpPassSlipModalIsOpen,
    declineApplicationModalIsOpen: state.declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen: state.setDeclineApplicationModalIsOpen,
  }));

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<passSlipAction>({
    mode: 'onChange',
    defaultValues: {
      passSlipId: passSlip.id,
      status: null,
    },
  });

  useEffect(() => {
    setValue('passSlipId', passSlip.id);
  }, [passSlip.id]);

  useEffect(() => {
    if (!modalState) {
      setValue('status', null);
    }
  }, [modalState]);

  const onSubmit: SubmitHandler<passSlipAction> = (data: passSlipAction) => {
    setValue('passSlipId', passSlip.id);
    if (data.status === 'approved') {
      setOtpPassSlipModalIsOpen(true);
    } else {
      setDeclineApplicationModalIsOpen(true);
    }
  };

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const closeOtpModal = async () => {
    setOtpPassSlipModalIsOpen(false);
  };

  // cancel action for Decline Application Modal
  const closeDeclineModal = async () => {
    setDeclineApplicationModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={windowWidth > 1024 ? 'lg' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Pass Slip for Approval</span>
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
          <div className="w-full h-full flex flex-col gap-2">
            {/* OTP Modal */}

            <div className="w-full flex flex-col gap-2 p-4 rounded">
              <AlertNotification alertType="warning" notifMessage="For Supervisor Approval" dismissible={false} />

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Employee Name:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">{passSlip.employeeName}</label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Date of Application:
                </label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">
                    {DateFormatter(passSlip.dateOfApplication)}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Nature of Business:
                </label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">{passSlip.natureOfBusiness}</label>
                </div>
              </div>

              {passSlip.natureOfBusiness === 'Official Business' ? (
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className={`text-slate-500 text-md whitespace-nowrap font-medium sm:w-80`}>
                    Mode of Transportation:
                  </label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">{passSlip.obTransportation}</label>
                  </div>
                </div>
              ) : null}

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                    Estimated Hours:
                  </label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">{passSlip.estimateHours}</label>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col gap-2
            `}
              >
                <label className="text-slate-500 text-md font-medium">Purpose/Desination:</label>
                <textarea
                  className={'resize-none w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                  value={passSlip.purposeDestination}
                  rows={2}
                  disabled={true}
                ></textarea>
              </div>
              <div className="w-full flex gap-2 justify-start items-center pt-4">
                <span className="text-slate-500 text-md font-medium">Action:</span>
                <form id="PassSlipAction" onSubmit={handleSubmit(onSubmit)}>
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
                </form>
              </div>
            </div>
          </div>
          <OtpModal
            modalState={otpPassSlipModalIsOpen}
            setModalState={setOtpPassSlipModalIsOpen}
            title={'PASS SLIP APPROVAL OTP'}
          >
            {/* contents */}
            {/* <ApprovalOtpContentsPassSlip
              mobile={employeeDetails.profile.mobileNumber}
              employeeId={employeeDetails.user._id}
              action={watch('status')}
              tokenId={passSlip.id}
              otpName={'passSlipApproval'}
            /> */}
            <ApprovalOtpContents
              mobile={employeeDetails.profile.mobileNumber}
              employeeId={employeeDetails.user._id}
              actionPassSlip={watch('status')}
              tokenId={passSlip.id}
              otpName={ManagerOtpApproval.PASSSLIP}
            />
          </OtpModal>
          <ConfirmationApprovalModal
            modalState={declineApplicationModalIsOpen}
            setModalState={setDeclineApplicationModalIsOpen}
            closeModalAction={closeDeclineModal}
            actionPassSlip={watch('status')}
            tokenId={passSlip.id}
            otpName={ManagerOtpApproval.PASSSLIP}
            employeeId={employeeDetails.user._id}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="w-full flex justify-end">
              <Button variant={'primary'} size={'md'} loading={false} form="PassSlipAction" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalsPendingPassSlipModal;
