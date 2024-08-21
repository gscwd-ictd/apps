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
import { ManagerConfirmationApproval, ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';
import { NatureOfBusiness, PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { ApprovalCaptcha } from './ApprovalOtp/ApprovalCaptcha';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';

type PassSlipPendingModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: 'approved' },
  { label: 'Disapprove', value: 'disapproved' },
];

const medicalApprovalAction: Array<SelectOption> = [
  { label: 'Approve', value: 'awaiting medical certificate' },
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
    confirmApplicationModalIsOpen,
    setConfirmApplicationModalIsOpen,
    loadingResponse,
    disputeConfirmModalIsOpen,
    setDisputeConfirmModalIsOpen,
  } = useApprovalStore((state) => ({
    passSlip: state.passSlipIndividualDetail,
    otpPassSlipModalIsOpen: state.otpPassSlipModalIsOpen,
    setOtpPassSlipModalIsOpen: state.setOtpPassSlipModalIsOpen,
    confirmApplicationModalIsOpen: state.confirmApplicationModalIsOpen,
    setConfirmApplicationModalIsOpen: state.setConfirmApplicationModalIsOpen,
    loadingResponse: state.loading.loadingPassSlipResponse,
    disputeConfirmModalIsOpen: state.disputeConfirmModalIsOpen,
    setDisputeConfirmModalIsOpen: state.setDisputeConfirmModalIsOpen,
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
    if (
      (data.status === 'approved' || data.status === 'awaiting medical certificate') &&
      passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL
    ) {
      setConfirmApplicationModalIsOpen(true);
    } else if (data.status === 'disapproved' && passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL) {
      setConfirmApplicationModalIsOpen(true);
    } else if (passSlip.status === PassSlipStatus.FOR_DISPUTE) {
      setDataToSubmitForCaptcha(data);
      setDisputeConfirmModalIsOpen(true);
    }
  };

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  // cancel action for Decline Application Modal
  const closeConfirmModal = async () => {
    setConfirmApplicationModalIsOpen(false);
    setDisputeConfirmModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal
        size={windowWidth > 1280 ? 'sm' : windowWidth > 1024 ? 'md' : 'full'}
        open={modalState}
        setOpen={setModalState}
      >
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Pass Slip Application</span>
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
            <div className="w-full flex flex-col gap-2 px-4 rounded">
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
                    passSlip.status === PassSlipStatus.USED ||
                    passSlip.status === PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE ||
                    passSlip.status === PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE
                      ? 'success'
                      : passSlip.status === PassSlipStatus.DISAPPROVED ||
                        passSlip.status === PassSlipStatus.DISAPPROVED_BY_HRMO ||
                        passSlip.status === PassSlipStatus.CANCELLED
                      ? 'error'
                      : passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL ||
                        passSlip.status === PassSlipStatus.FOR_HRMO_APPROVAL ||
                        passSlip.status === PassSlipStatus.FOR_DISPUTE ||
                        passSlip.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE
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
                      : passSlip.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE
                      ? `Awaiting Medical Certificate`
                      : passSlip.status === PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE
                      ? `Approved without Medical Certificate`
                      : passSlip.status === PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE
                      ? `Approved with Medical Certificate`
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

                {passSlip.isDeductibleToPay ? (
                  <AlertNotification alertType={`warning`} notifMessage={`Deductible to Pay`} dismissible={false} />
                ) : null}

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
                    <label className=" text-md font-medium">{DateTimeFormatter(passSlip.dateOfApplication)}</label>
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
                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Purpose/Desination:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{passSlip.purposeDestination}</label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                    {passSlip.status === PassSlipStatus.APPROVED ||
                    passSlip.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE ||
                    passSlip.status === PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE ||
                    passSlip.status === PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE
                      ? `Date Approved:`
                      : passSlip.status === PassSlipStatus.DISAPPROVED
                      ? 'Date Disapproved:'
                      : passSlip.status === PassSlipStatus.DISAPPROVED_BY_HRMO
                      ? 'Date Disapproved:'
                      : passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL &&
                        passSlip.natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS
                      ? 'Date Approved by HRMO:'
                      : 'Date Approved:'}
                  </label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {passSlip.status === PassSlipStatus.APPROVED ||
                      passSlip.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE ||
                      passSlip.status === PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE ||
                      passSlip.status === PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE
                        ? DateTimeFormatter(passSlip.supervisorApprovalDate)
                        : passSlip.status === PassSlipStatus.DISAPPROVED
                        ? DateTimeFormatter(passSlip.supervisorApprovalDate)
                        : passSlip.status === PassSlipStatus.DISAPPROVED_BY_HRMO
                        ? DateTimeFormatter(passSlip.hrmoApprovalDate)
                        : passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL &&
                          passSlip.natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS
                        ? DateTimeFormatter(passSlip.hrmoApprovalDate)
                        : '-- -- ----'}
                    </label>
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

              {passSlip.status != PassSlipStatus.APPROVED &&
              passSlip.status != PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE &&
              passSlip.status != PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE &&
              passSlip.status != PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE ? (
                <form id="PassSlipAction" onSubmit={handleSubmit(onSubmit)}>
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
                      {passSlip.natureOfBusiness == NatureOfBusiness.PERSONAL_BUSINESS && passSlip.isMedical
                        ? medicalApprovalAction.map((item: SelectOption, idx: number) => (
                            <option value={item.value} key={idx}>
                              {item.label}
                            </option>
                          ))
                        : approvalAction.map((item: SelectOption, idx: number) => (
                            <option value={item.value} key={idx}>
                              {item.label}
                            </option>
                          ))}
                    </select>
                  </div>
                </form>
              ) : null}
            </div>
          </div>

          {/* <CaptchaModal
            modalState={otpPassSlipModalIsOpen}
            setModalState={setOtpPassSlipModalIsOpen}
            title={'PASS SLIP APPROVAL CAPTCHA'}
          >
            <ApprovalCaptcha
              employeeId={employeeDetails.user._id}
              actionPassSlip={watch('status')}
              tokenId={passSlip.id}
              captchaName={ManagerConfirmationApproval.PASSSLIP}
            />
          </CaptchaModal> */}

          {/* <OtpModal
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
          </OtpModal> */}

          <ConfirmationApprovalModal
            modalState={confirmApplicationModalIsOpen}
            setModalState={setConfirmApplicationModalIsOpen}
            closeModalAction={closeConfirmModal}
            actionPassSlip={watch('status')}
            tokenId={passSlip.id}
            confirmName={ManagerConfirmationApproval.PASSSLIP}
            employeeId={employeeDetails.user._id}
          />

          <ConfirmationApprovalModal
            modalState={disputeConfirmModalIsOpen}
            setModalState={setDisputeConfirmModalIsOpen}
            closeModalAction={closeConfirmModal}
            tokenId={passSlip.id}
            dataToSubmitPassSlipDispute={dataToSubmitForCaptcha}
            confirmName={ManagerConfirmationApproval.PASSSLIP_DISPUTE}
            employeeId={employeeDetails.user._id}
          />

          {/* <CaptchaModal
            modalState={disputeConfirmModalIsOpen}
            setModalState={setDisputeConfirmModalIsOpen}
            title={'PASS SLIP DISPUTE CAPTCHA'}
          >
            <ApprovalCaptcha
              employeeId={employeeDetails.user._id}
              dataToSubmitPassSlipDispute={dataToSubmitForCaptcha}
              tokenId={passSlip.id}
              captchaName={ManagerConfirmationApproval.PASSSLIP_DISPUTE}
            />
          </CaptchaModal> */}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="w-full flex justify-end">
              {passSlip.status != PassSlipStatus.APPROVED &&
              passSlip.status != PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE &&
              passSlip.status != PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE &&
              passSlip.status != PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE ? (
                <Button variant={'primary'} size={'md'} loading={false} form="PassSlipAction" type="submit">
                  Submit
                </Button>
              ) : passSlip.status ? (
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

export default ApprovalsPendingPassSlipModal;
