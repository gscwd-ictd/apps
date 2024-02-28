/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, CaptchaModal, LoadingSpinner, Modal, OtpModal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useApprovalStore } from '../../../store/approvals.store';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEmployeeStore } from '../../../store/employee.store';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { ApprovalOtpContents } from './ApprovalOtp/ApprovalOtpContents';
import { ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { NatureOfBusiness, PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { ApprovalCaptcha } from './ApprovalOtp/ApprovalCaptcha';

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
    loadingResponse,
    captchaModalIsOpen,
    setCaptchaModalIsOpen,
  } = useApprovalStore((state) => ({
    passSlip: state.passSlipIndividualDetail,
    otpPassSlipModalIsOpen: state.otpPassSlipModalIsOpen,
    setOtpPassSlipModalIsOpen: state.setOtpPassSlipModalIsOpen,
    declineApplicationModalIsOpen: state.declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen: state.setDeclineApplicationModalIsOpen,
    loadingResponse: state.loading.loadingPassSlipResponse,
    captchaModalIsOpen: state.captchaModalIsOpen,
    setCaptchaModalIsOpen: state.setCaptchaModalIsOpen,
  }));

  const [dataToSubmitForCaptcha, setDataToSubmitForCaptcha] = useState<passSlipAction>();

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<passSlipAction>({
    mode: 'onChange',
    defaultValues: {
      passSlipId: passSlip.id,
      status: null,
      // remarks: null,
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
    if (data.status === 'approved' && passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL) {
      setOtpPassSlipModalIsOpen(true);
    } else if (data.status === 'disapproved' && passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL) {
      setDeclineApplicationModalIsOpen(true);
    } else if (passSlip.status === PassSlipStatus.FOR_DISPUTE) {
      setDataToSubmitForCaptcha(data);
      setCaptchaModalIsOpen(true);
    }
  };

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  // const closeOtpModal = async () => {
  //   setOtpPassSlipModalIsOpen(false);
  // };

  // cancel action for Decline Application Modal
  const closeDeclineModal = async () => {
    setDeclineApplicationModalIsOpen(false);
    setCaptchaModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={windowWidth > 1024 ? 'md' : 'full'} open={modalState} setOpen={setModalState}>
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
              <div className="w-full flex flex-col gap-0">
                {loadingResponse ? (
                  <AlertNotification
                    logo={<LoadingSpinner size="xs" />}
                    alertType="info"
                    notifMessage="Processing"
                    dismissible={true}
                  />
                ) : null}

                <AlertNotification
                  alertType={
                    passSlip.status === PassSlipStatus.APPROVED ||
                    passSlip.status === PassSlipStatus.UNUSED ||
                    passSlip.status === PassSlipStatus.USED
                      ? 'info'
                      : passSlip.status === PassSlipStatus.DISAPPROVED ||
                        passSlip.status === PassSlipStatus.DISAPPROVED_BY_HRMO ||
                        passSlip.status === PassSlipStatus.CANCELLED
                      ? 'error'
                      : passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL ||
                        passSlip.status === PassSlipStatus.FOR_HRMO_APPROVAL ||
                        passSlip.status === PassSlipStatus.FOR_DISPUTE
                      ? 'warning'
                      : 'info'
                  }
                  notifMessage={`${
                    passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL
                      ? `For Supervisor Review`
                      : passSlip.status === PassSlipStatus.FOR_DISPUTE
                      ? 'For Dispute Review'
                      : passSlip.status === PassSlipStatus.FOR_HRMO_APPROVAL
                      ? 'For HRMO Review'
                      : passSlip.status === PassSlipStatus.APPROVED
                      ? 'Approved'
                      : passSlip.status === PassSlipStatus.DISAPPROVED
                      ? 'Disapproved'
                      : passSlip.status === PassSlipStatus.DISAPPROVED_BY_HRMO
                      ? 'Disapproved by HRMO'
                      : passSlip.status === PassSlipStatus.UNUSED
                      ? 'Unused'
                      : passSlip.status === PassSlipStatus.USED
                      ? 'Used'
                      : passSlip.status === PassSlipStatus.CANCELLED
                      ? 'Cancelled'
                      : passSlip.status
                  }`}
                  dismissible={false}
                />

                {passSlip.disputeRemarks && passSlip.isDisputeApproved ? (
                  <AlertNotification
                    alertType={`${passSlip.isDisputeApproved === true ? 'success' : 'error'}`}
                    notifMessage={`${
                      passSlip.isDisputeApproved === true
                        ? 'Dispute filed is Approved.'
                        : 'Dispute filed is Disapproved.'
                    }`}
                    dismissible={false}
                  />
                ) : null}
              </div>

              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Employee Name:</label>

                  <div className="w-auto ml-5">
                    <label className="text-md font-medium">{passSlip.employeeName}</label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Nature of Business:</label>

                  <div className="w-auto ml-5">
                    <label className="text-md font-medium">{passSlip.natureOfBusiness}</label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Date of Application:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {DateFormatter(passSlip.dateOfApplication, 'MM-DD-YYYY')}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">
                    {passSlip.natureOfBusiness == NatureOfBusiness.PERSONAL_BUSINESS
                      ? 'For Medical Business:'
                      : 'Mode of Transportation:'}
                  </label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {passSlip.natureOfBusiness == NatureOfBusiness.PERSONAL_BUSINESS
                        ? passSlip.isMedical
                          ? 'Yes'
                          : 'No'
                        : passSlip.obTransportation ?? 'N/A'}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Estimated Hours:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{passSlip.estimateHours}</label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Time Out:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {passSlip.timeOut ? UseTwelveHourFormat(passSlip.timeOut) : 'None'}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Time In:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {passSlip.timeIn ? UseTwelveHourFormat(passSlip.timeIn) : 'None'}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Purpose/Desination:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{passSlip.purposeDestination}</label>
                  </div>
                </div>

                {passSlip.disputeRemarks ? (
                  <div className={`flex flex-col`}>
                    <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                        Employee Dispute Remarks:
                      </label>

                      <div className="w-auto ml-5">
                        <div className="w-auto flex flex-col">
                          <label className="text-md font-medium">
                            {`Disputed Time In is ${
                              passSlip.encodedTimeIn ? UseTwelveHourFormat(passSlip.encodedTimeIn) : 'None'
                            }.`}
                          </label>
                          <label className="text-md font-medium">{` ${passSlip.disputeRemarks}`}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
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
                    {DateFormatter(passSlip.dateOfApplication, 'MM-DD-YYYY')}
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

              {passSlip.status === PassSlipStatus.FOR_DISPUTE ? (
                <>
                  <div className={` flex flex-col gap-2`}>
                    <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Time Out:</label>
                      <div className="w-auto md:w-96">
                        <label className="text-slate-500 h-12 w-96  text-md ">
                          {passSlip.timeOut ? UseTwelveHourFormat(passSlip.timeOut) : 'None'}
                        </label>
                      </div>
                    </div>
                  </div>
                  {passSlip.natureOfBusiness == NatureOfBusiness.UNDERTIME ||
                  passSlip.natureOfBusiness == NatureOfBusiness.HALF_DAY ? null : (
                    <div className={` flex flex-col gap-2`}>
                      <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Time In:</label>
                        <div className="w-auto md:w-96">
                          <label className="text-slate-500 h-12 w-96  text-md ">
                            {passSlip.timeIn ? UseTwelveHourFormat(passSlip.timeIn) : 'None'}
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : null}

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

              {passSlip.disputeRemarks ? (
                <div className={`flex flex-col gap-2`}>
                  <label className="text-slate-500 text-md font-medium">Employee Dispute Remarks:</label>
                  <textarea
                    className={'resize-none w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                    value={`Disputed Time In: ${
                      passSlip.encodedTimeIn ? UseTwelveHourFormat(passSlip.encodedTimeIn) : 'None'
                    }.\n${passSlip.disputeRemarks}`}
                    rows={3}
                    disabled={true}
                  ></textarea>
                </div>
              ) : null} */}

              {passSlip.status != PassSlipStatus.APPROVED ? (
                <form id="PassSlipAction" onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-start items-start md:items-center pt-1 md:pt-2">
                    <span className="text-slate-500 text-md font-medium">Action:</span>

                    <select
                      id="action"
                      className="text-slate-500 h-12 w-full md:w-40 rounded text-md border-slate-300"
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
                  {/* {watch('status') === PassSlipStatus.DISAPPROVED && passSlip.status === PassSlipStatus.FOR_DISPUTE ? (
                  <textarea
                    required={true}
                    className={'resize-none mt-3 w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                    placeholder="Enter Reason"
                    rows={3}
                    {...register('remarks')}
                  ></textarea>
                ) : null} */}
                </form>
              ) : null}
            </div>
          </div>
          <OtpModal
            modalState={otpPassSlipModalIsOpen}
            setModalState={setOtpPassSlipModalIsOpen}
            title={'PASS SLIP APPROVAL OTP'}
          >
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
            confirmName={ManagerOtpApproval.PASSSLIP}
            employeeId={employeeDetails.user._id}
          />

          <CaptchaModal
            modalState={captchaModalIsOpen}
            setModalState={setCaptchaModalIsOpen}
            title={'PASS SLIP DISPUTE CAPTCHA'}
          >
            {/* contents */}
            <ApprovalCaptcha
              employeeId={employeeDetails.user._id}
              dataToSubmitPassSlipDispute={dataToSubmitForCaptcha}
              tokenId={passSlip.id}
              captchaName={'Dispute Captcha'}
            />
          </CaptchaModal>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="w-full flex justify-end">
              {passSlip.status != PassSlipStatus.APPROVED ? (
                <Button variant={'primary'} size={'md'} loading={false} form="PassSlipAction" type="submit">
                  Submit
                </Button>
              ) : (
                <Button
                  variant={'primary'}
                  size={'md'}
                  loading={false}
                  onClick={(e) => closeModalAction()}
                  type="submit"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalsPendingPassSlipModal;
