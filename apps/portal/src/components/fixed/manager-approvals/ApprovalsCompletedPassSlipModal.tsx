/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useApprovalStore } from '../../../store/approvals.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { NatureOfBusiness, PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';
import { ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

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
  const { passSlip, declineApplicationModalIsOpen, setDeclineApplicationModalIsOpen } = useApprovalStore((state) => ({
    passSlip: state.passSlipIndividualDetail,
    setDeclineApplicationModalIsOpen: state.setDeclineApplicationModalIsOpen,
    declineApplicationModalIsOpen: state.declineApplicationModalIsOpen,
  }));

  // cancel action for Decline Application Modal
  const closeDeclineModal = async () => {
    setDeclineApplicationModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={windowWidth > 1024 ? 'lg' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold  text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Completed Pass Slips</span>
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
            <div className="w-full flex flex-col gap-2 p-4 rounded">
              <div className="w-full flex flex-col gap-0">
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
                      ? `For Supervisor Approval`
                      : passSlip.status === PassSlipStatus.FOR_DISPUTE
                      ? 'For Dispute Approval'
                      : passSlip.status === PassSlipStatus.FOR_HRMO_APPROVAL
                      ? 'For HRMO Approval'
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

                {passSlip.disputeRemarks && passSlip.isDisputeApproved != null ? (
                  <AlertNotification
                    alertType={`${passSlip.isDisputeApproved ? 'success' : 'error'}`}
                    notifMessage={`${
                      passSlip.isDisputeApproved ? 'Dispute filed is Approved' : 'Dispute filed is Disapproved'
                    }`}
                    dismissible={false}
                  />
                ) : null}
              </div>

              <ConfirmationApprovalModal
                modalState={declineApplicationModalIsOpen}
                setModalState={setDeclineApplicationModalIsOpen}
                closeModalAction={closeDeclineModal}
                actionPassSlip={PassSlipStatus.CANCELLED}
                tokenId={passSlip.id}
                confirmName={ManagerOtpApproval.PASSSLIP}
              />

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Employee Name:</label>

                <div className="w-auto md:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">{passSlip.employeeName}</label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Date of Application:
                </label>

                <div className="w-auto md:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">
                    {DateFormatter(passSlip.dateOfApplication, 'MM-DD-YYYY')}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Nature of Business:
                </label>

                <div className="w-auto md:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">{passSlip.natureOfBusiness}</label>
                </div>
              </div>

              {passSlip.natureOfBusiness === 'Official Business' ? (
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className={`text-slate-500 text-md whitespace-nowrap font-medium sm:w-80`}>
                    Mode of Transportation:
                  </label>
                  <div className="w-auto md:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">{passSlip.obTransportation}</label>
                  </div>
                </div>
              ) : null}

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                    Estimated Hours:
                  </label>
                  <div className="w-auto md:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">{passSlip.estimateHours}</label>
                  </div>
                </div>
              </div>
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
              <div className={`flex flex-col gap-2 `}>
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
              ) : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="w-full justify-end flex gap-2">
              {passSlip.status === PassSlipStatus.APPROVED ? (
                ((passSlip.natureOfBusiness === NatureOfBusiness.HALF_DAY || NatureOfBusiness.UNDERTIME) &&
                  !passSlip.timeOut) ||
                ((passSlip.natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS ||
                  NatureOfBusiness.PERSONAL_BUSINESS) &&
                  !passSlip.timeOut &&
                  !passSlip.timeIn) ? (
                  <Button
                    variant={'warning'}
                    size={'md'}
                    loading={false}
                    onClick={(e) => setDeclineApplicationModalIsOpen(true)}
                    type="submit"
                  >
                    Cancel Pass Slip
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
                )
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

export default ApprovalsCompletedPassSlipModal;
