/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useApprovalStore } from '../../../store/approvals.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { NatureOfBusiness, PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';
import { ManagerConfirmationApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';

type PassSlipCompletedModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ApprovalsCompletedPassSlipModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipCompletedModalProps) => {
  const { passSlip, confirmApplicationModalIsOpen, setConfirmApplicationModalIsOpen } = useApprovalStore((state) => ({
    passSlip: state.passSlipIndividualDetail,
    setConfirmApplicationModalIsOpen: state.setConfirmApplicationModalIsOpen,
    confirmApplicationModalIsOpen: state.confirmApplicationModalIsOpen,
  }));

  // cancel action for Decline Application Modal
  const closeDeclineModal = async () => {
    setConfirmApplicationModalIsOpen(false);
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
          <h3 className="font-semibold  text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Pass Slips Application</span>
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
          <div className="w-full h-full flex flex-col gap-2 ">
            <div className="w-full flex flex-col gap-2 px-4 rounded">
              <div className="w-full flex flex-col gap-0">
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
                      ? `Approved`
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

                {/* {passSlip.isDeductibleToPay ? (
                  <AlertNotification alertType={`warning`} notifMessage={`Deductible to Pay`} dismissible={false} />
                ) : null} */}

                {!passSlip.isDeductibleToPay ? (
                  <AlertNotification
                    alertType={`warning`}
                    notifMessage={`Notice: This employee has incurred a negative Vacation Leave Balance.`}
                    dismissible={false}
                  />
                ) : null}

                {passSlip.disputeRemarks && passSlip.isDisputeApproved != null ? (
                  <AlertNotification
                    alertType={`${passSlip.isDisputeApproved ? 'success' : 'error'}`}
                    notifMessage={`${
                      passSlip.isDisputeApproved ? 'Dispute filed is Approved.' : 'Dispute filed is Disapproved.'
                    }`}
                    dismissible={false}
                  />
                ) : null}
              </div>

              <ConfirmationApprovalModal
                modalState={confirmApplicationModalIsOpen}
                setModalState={setConfirmApplicationModalIsOpen}
                closeModalAction={closeDeclineModal}
                actionPassSlip={PassSlipStatus.CANCELLED}
                tokenId={passSlip.id}
                confirmName={ManagerConfirmationApproval.PASSSLIP}
              />

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
                <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Purpose/Desination:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{passSlip.purposeDestination}</label>
                  </div>
                </div>

                {passSlip.natureOfBusiness == NatureOfBusiness.OFFICIAL_BUSINESS ? (
                  <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                    <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                      {passSlip?.status === PassSlipStatus.DISAPPROVED_BY_HRMO
                        ? `Date Disapproved by HRMO:`
                        : 'Date Approved by HRMO:'}
                    </label>

                    <div className="w-auto ml-5">
                      <label className=" text-md font-medium">{DateTimeFormatter(passSlip?.hrmoApprovalDate)}</label>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                    {passSlip?.status === PassSlipStatus.DISAPPROVED
                      ? `Date Disapproved by Supervisor:`
                      : 'Date Approved by Supervisor:'}
                  </label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {DateTimeFormatter(passSlip?.supervisorApprovalDate)}
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
                        <div className="w-auto ml-5 flex flex-col">
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
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="w-full justify-end flex gap-2">
              {passSlip.status === PassSlipStatus.APPROVED ||
              passSlip.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE ||
              passSlip.status === PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE ||
              passSlip.status === PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE ? (
                passSlip.natureOfBusiness !== NatureOfBusiness.HALF_DAY &&
                passSlip.natureOfBusiness !== NatureOfBusiness.UNDERTIME &&
                // &&
                // GetDateDifference(
                //   `${dayjs(passSlip.dateOfApplication).format('YYYY-MM-DD')} 00:00:00`,
                //   `${dayjs().format('YYYY-MM-DD HH:mm:ss')} `
                // ).days <= 1
                (passSlip.natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS ||
                  passSlip.natureOfBusiness === NatureOfBusiness.PERSONAL_BUSINESS) &&
                !passSlip.timeIn ? (
                  <>
                    <Button
                      variant={'warning'}
                      size={'md'}
                      loading={false}
                      onClick={(e) => setConfirmApplicationModalIsOpen(true)}
                      type="submit"
                    >
                      Cancel Pass Slip
                    </Button>
                    <Button
                      variant={'default'}
                      size={'md'}
                      loading={false}
                      onClick={(e) => closeModalAction()}
                      type="submit"
                    >
                      Close
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={'default'}
                    size={'md'}
                    loading={false}
                    onClick={(e) => closeModalAction()}
                    type="submit"
                  >
                    Close
                  </Button>
                )
              ) : (
                <Button
                  variant={'default'}
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

export default ApprovalsCompletedPassSlipModal;
