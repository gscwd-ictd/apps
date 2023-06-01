/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal, OtpModal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEffect } from 'react';
import { useApprovalStore } from '../../../../src/store/approvals.store';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import { ApprovalOtpContents } from './ApprovalOtp/ApprovalOtpContents';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

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
  const { passSlip, otpPassSlipModalIsOpen, setOtpPassSlipModalIsOpen } =
    useApprovalStore((state) => ({
      passSlip: state.passSlipIndividualDetail,
      otpPassSlipModalIsOpen: state.otpPassSlipModalIsOpen,
      setOtpPassSlipModalIsOpen: state.setOtpPassSlipModalIsOpen,
    }));

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } =
    useForm<passSlipAction>({
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
    console.log(watch('status'), 'status');
    console.log(watch('passSlipId'), 'passslip Id');
    setOtpPassSlipModalIsOpen(true);
  };

  // set state for employee store
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  const closeOtpModal = async () => {
    setOtpPassSlipModalIsOpen(false);
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
          <h3 className="font-semibold text-2xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Pass Slip for Approval</span>
              <button
                className="hover:bg-slate-100 px-1 rounded-full"
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
              <AlertNotification
                alertType="warning"
                notifMessage="Awaiting Supervisor Approval"
                dismissible={false}
              />

              <div className="flex flex-col md:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                  Employee Name:
                </label>

                <div className="w-auto md:w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {passSlip.employeeName}
                  </label>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                  Date of Application:
                </label>

                <div className="w-auto md:w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {passSlip.dateOfApplication}
                  </label>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                  Nature of Business:
                </label>

                <div className="w-auto md:w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {passSlip.natureOfBusiness}
                  </label>
                </div>
              </div>

              {passSlip.natureOfBusiness === 'Official Business' ? (
                <div className="flex flex-col md:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label
                    className={`text-slate-500 text-lg whitespace-nowrap font-medium`}
                  >
                    Mode of Transportation:
                  </label>
                  <div className="w-auto md:w-96">
                    <label className="text-slate-500 h-12 w-96  text-lg ">
                      {passSlip.obTransportation}
                    </label>
                  </div>
                </div>
              ) : null}

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col md:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                    Estimated Hours:
                  </label>
                  <div className="w-auto md:w-96">
                    <label className="text-slate-500 h-12 w-96  text-lg ">
                      {passSlip.estimateHours}
                    </label>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col gap-2
            `}
              >
                <label className="text-slate-500 text-lg font-medium">
                  Purpose/Desination:
                </label>
                <textarea
                  className={
                    'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
                  }
                  value={passSlip.purposeDestination}
                  rows={3}
                  disabled={true}
                ></textarea>
              </div>
              <div className="w-full flex gap-2 justify-start items-center pt-4">
                <span className="text-slate-500 text-xl font-medium">
                  Action:
                </span>
                <form id="PassSlipAction" onSubmit={handleSubmit(onSubmit)}>
                  <select
                    id="action"
                    className="text-slate-500 h-12 w-42 rounded text-lg border-slate-300"
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
            title={'PASS SLIP OTP'}
          >
            {/* contents */}
            <ApprovalOtpContents
              mobile={employeeDetail.profile.mobileNumber}
              employeeId={employeeDetail.user._id}
              action={watch('status')}
              tokenId={passSlip.id}
              otpName={'passSlipApproval'}
            />
          </OtpModal>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto">
              {/* <Button
                variant={'warning'}
                size={'md'}
                loading={false}
                onClick={(e) => modalAction(e)}
                type="submit"
              >
                Disapprove
              </Button> */}
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                form="PassSlipAction"
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

export default ApprovalsPendingPassSlipModal;
