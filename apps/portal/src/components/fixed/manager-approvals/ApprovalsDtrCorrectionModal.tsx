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
import { DtrCorrectionStatus } from 'libs/utils/src/lib/enums/dtr.enum';
import { ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { ApprovalCaptcha } from './ApprovalOtp/ApprovalCaptcha';
import { DtrCorrectionApprovalPatch } from 'libs/utils/src/lib/types/dtr.type';

type ApprovalsDtrCorrectionModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: 'approved' },
  { label: 'Disapprove', value: 'disapproved' },
];

export const ApprovalsDtrCorrectionModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ApprovalsDtrCorrectionModalProps) => {
  const {
    dtrCorrectionDetail,
    otpDtrCorrectionModalIsOpen,
    setOtpDtrCorrectionModalIsOpen,
    declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen,
    loadingResponse,
    captchaModalIsOpen,
    setCaptchaModalIsOpen,
  } = useApprovalStore((state) => ({
    dtrCorrectionDetail: state.dtrCorrectionDetail,
    otpDtrCorrectionModalIsOpen: state.otpDtrCorrectionModalIsOpen,
    setOtpDtrCorrectionModalIsOpen: state.setOtpDtrCorrectionModalIsOpen,
    declineApplicationModalIsOpen: state.declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen: state.setDeclineApplicationModalIsOpen,
    loadingResponse: state.loading.loadingPassSlipResponse,
    captchaModalIsOpen: state.captchaModalIsOpen,
    setCaptchaModalIsOpen: state.setCaptchaModalIsOpen,
  }));

  const [dataToSubmitForCaptcha, setDataToSubmitForCaptcha] = useState<DtrCorrectionApprovalPatch>();

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<DtrCorrectionApprovalPatch>({
    mode: 'onChange',
    defaultValues: {
      id: dtrCorrectionDetail.id,
      status: null,
      // remarks: null,
    },
  });

  useEffect(() => {
    setValue('id', dtrCorrectionDetail.id);
  }, [dtrCorrectionDetail.id]);

  useEffect(() => {
    if (!modalState) {
      setValue('status', null);
    }
  }, [modalState]);

  const onSubmit: SubmitHandler<DtrCorrectionApprovalPatch> = (data: DtrCorrectionApprovalPatch) => {
    setValue('id', dtrCorrectionDetail.id);
    if (data.status === DtrCorrectionStatus.APPROVED) {
      setOtpDtrCorrectionModalIsOpen(true);
    } else if (data.status === DtrCorrectionStatus.DISAPPROVED) {
      setDeclineApplicationModalIsOpen(true);
    }
    //  else if (dtrCorrectionDetail.status === DtrCorrectionApproval.FOR_DISPUTE) {
    //   setDataToSubmitForCaptcha(data);
    //   setCaptchaModalIsOpen(true);
    // }
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
      <Modal size={windowWidth > 1024 ? 'sm' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">DTR Correction for Approval</span>
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
                    dtrCorrectionDetail.status === DtrCorrectionStatus.APPROVED
                      ? 'info'
                      : dtrCorrectionDetail.status === DtrCorrectionStatus.DISAPPROVED
                      ? 'error'
                      : dtrCorrectionDetail.status === DtrCorrectionStatus.PENDING
                      ? 'warning'
                      : 'info'
                  }
                  notifMessage={`${
                    dtrCorrectionDetail.status === DtrCorrectionStatus.APPROVED
                      ? 'Approved'
                      : dtrCorrectionDetail.status === DtrCorrectionStatus.DISAPPROVED
                      ? 'Disapproved'
                      : dtrCorrectionDetail.status === DtrCorrectionStatus.PENDING
                      ? 'For Supervisor Review'
                      : dtrCorrectionDetail.status
                  }`}
                  dismissible={false}
                />
              </div>

              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Employee Name:</label>

                  <div className="w-auto ml-5">
                    <label className="text-md font-medium">{dtrCorrectionDetail.employeeFullName}</label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Date to Correct:</label>

                  <div className="w-auto ml-5">
                    <label className="text-md font-medium">
                      {' '}
                      {DateFormatter(dtrCorrectionDetail.dtrDate, 'MM-DD-YYYY')}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Time In:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {UseTwelveHourFormat(dtrCorrectionDetail.dtrTimeIn) ?? '-- -- --'}
                    </label>
                  </div>
                </div>
                {dtrCorrectionDetail.status != DtrCorrectionStatus.APPROVED ? (
                  <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                    <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Updated Time In:</label>

                    <div className="w-auto ml-5">
                      <label
                        className={`text-md font-medium ${
                          UseTwelveHourFormat(dtrCorrectionDetail.dtrTimeIn) !=
                          UseTwelveHourFormat(dtrCorrectionDetail.correctedTimeIn)
                            ? 'text-green-500'
                            : ''
                        }`}
                      >
                        {UseTwelveHourFormat(dtrCorrectionDetail.correctedTimeIn) ?? '-- -- --'}
                      </label>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Lunch Out:</label>

                  <div className="w-auto ml-5">
                    <label className={`text-md font-medium `}>
                      {UseTwelveHourFormat(dtrCorrectionDetail.dtrLunchOut) ?? '-- -- --'}
                    </label>
                  </div>
                </div>

                {dtrCorrectionDetail.status != DtrCorrectionStatus.APPROVED ? (
                  <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                    <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Updated Lunch Out:</label>

                    <div className="w-auto ml-5">
                      <label
                        className={` text-md font-medium ${
                          UseTwelveHourFormat(dtrCorrectionDetail.dtrLunchOut) !=
                          UseTwelveHourFormat(dtrCorrectionDetail.correctedLunchOut)
                            ? 'text-green-500'
                            : ''
                        }`}
                      >
                        {UseTwelveHourFormat(dtrCorrectionDetail.correctedLunchOut) ?? '-- -- --'}
                      </label>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Lunch In:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {UseTwelveHourFormat(dtrCorrectionDetail.dtrLunchIn) ?? '-- -- --'}
                    </label>
                  </div>
                </div>

                {dtrCorrectionDetail.status != DtrCorrectionStatus.APPROVED ? (
                  <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                    <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Updated Lunch In:</label>

                    <div className="w-auto ml-5">
                      <label
                        className={`text-md font-medium ${
                          UseTwelveHourFormat(dtrCorrectionDetail.dtrLunchIn) !=
                          UseTwelveHourFormat(dtrCorrectionDetail.correctedLunchIn)
                            ? 'text-green-500'
                            : ''
                        }`}
                      >
                        {UseTwelveHourFormat(dtrCorrectionDetail.correctedLunchIn) ?? '-- -- --'}
                      </label>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Time Out:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {UseTwelveHourFormat(dtrCorrectionDetail.dtrTimeOut) ?? '-- -- --'}
                    </label>
                  </div>
                </div>

                {dtrCorrectionDetail.status != DtrCorrectionStatus.APPROVED ? (
                  <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                    <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Updated Time Out:</label>

                    <div className="w-auto ml-5">
                      <label
                        className={`text-md font-medium ${
                          UseTwelveHourFormat(dtrCorrectionDetail.dtrTimeOut) !=
                          UseTwelveHourFormat(dtrCorrectionDetail.correctedTimeOut)
                            ? 'text-green-500'
                            : ''
                        }`}
                      >
                        {UseTwelveHourFormat(dtrCorrectionDetail.correctedTimeOut) ?? '-- -- --'}
                      </label>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Remarks:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium"> {dtrCorrectionDetail.remarks ?? 'N/A'}</label>
                  </div>
                </div>
              </div>

              {dtrCorrectionDetail.status === DtrCorrectionStatus.PENDING ? (
                <form id="DtrCorrectionAction" onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-end items-start md:items-center">
                    <span className="text-slate-500 text-md">Action:</span>

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
                </form>
              ) : null}
            </div>
          </div>
          <OtpModal
            modalState={otpDtrCorrectionModalIsOpen}
            setModalState={setOtpDtrCorrectionModalIsOpen}
            title={'DTR CORRECTION APPROVAL OTP'}
          >
            <ApprovalOtpContents
              mobile={employeeDetails.profile.mobileNumber}
              employeeId={employeeDetails.user._id}
              actionDtrCorrection={watch('status')}
              tokenId={dtrCorrectionDetail.id}
              otpName={ManagerOtpApproval.DTRCORRECTION}
            />
          </OtpModal>
          {/* <ConfirmationApprovalModal
            modalState={declineApplicationModalIsOpen}
            setModalState={setDeclineApplicationModalIsOpen}
            closeModalAction={closeDeclineModal}
            actionPassSlip={watch('status')}
            tokenId={passSlip.id}
            confirmName={ManagerOtpApproval.PASSSLIP}
            employeeId={employeeDetails.user._id}
          /> */}

          {/* <CaptchaModal
            modalState={captchaModalIsOpen}
            setModalState={setCaptchaModalIsOpen}
            title={'PASS SLIP DISPUTE CAPTCHA'}
          >
           
            <ApprovalCaptcha
              employeeId={employeeDetails.user._id}
              dataToSubmitPassSlipDispute={dataToSubmitForCaptcha}
              tokenId={passSlip.id}
              captchaName={'Dispute Captcha'}
            />
          </CaptchaModal> */}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="w-full flex justify-end">
              {dtrCorrectionDetail.status === DtrCorrectionStatus.PENDING ? (
                <Button variant={'primary'} size={'md'} loading={false} form="DtrCorrectionAction" type="submit">
                  Submit
                </Button>
              ) : dtrCorrectionDetail.status ? (
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

export default ApprovalsDtrCorrectionModal;
