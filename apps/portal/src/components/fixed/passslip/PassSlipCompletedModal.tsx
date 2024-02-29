/* eslint-disable react/jsx-no-undef */
/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { useRouter } from 'next/router';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { NatureOfBusiness, PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { ConfirmationApplicationModal } from './ConfirmationModal';
import { DisputeApplicationModal } from './DisputeModal';
import dayjs from 'dayjs';
import { GetDateDifference } from 'libs/utils/src/lib/functions/GetDateDifference';
import { isEmpty } from 'lodash';

type PassSlipCompletedModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const PassSlipCompletedModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipCompletedModalProps) => {
  const { passSlip, disputePassSlipModalIsOpen, setDisputePassSlipModalIsOpen } = usePassSlipStore((state) => ({
    passSlip: state.passSlip,
    disputePassSlipModalIsOpen: state.disputePassSlipModalIsOpen,
    setDisputePassSlipModalIsOpen: state.setDisputePassSlipModalIsOpen,
  }));

  const router = useRouter();
  const { windowWidth } = UseWindowDimensions();

  // for cancel pass slip button
  const modalAction = async (e) => {
    e.preventDefault();
    setDisputePassSlipModalIsOpen(true);
  };

  // cancel action for Confirmation Application Modal
  const closeConfirmationModal = async () => {
    setDisputePassSlipModalIsOpen(false);
  };

  return (
    <>
      <Modal size={windowWidth > 1024 ? 'md' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Completed Pass Slip</span>
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
                {passSlip.status === PassSlipStatus.APPROVED ? (
                  <AlertNotification
                    alertType="info"
                    notifMessage={`Approved ${
                      GetDateDifference(
                        `${passSlip.dateOfApplication} 00:00:00`,
                        `${dayjs().format('YYYY-MM-DD HH:mm:ss')} `
                      ).days
                    } days ago`}
                    dismissible={false}
                  />
                ) : (
                  <AlertNotification
                    alertType={
                      passSlip.status === PassSlipStatus.UNUSED || passSlip.status === PassSlipStatus.USED
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
                )}

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

              {/* dispute pass slip time in */}
              <DisputeApplicationModal
                modalState={disputePassSlipModalIsOpen}
                setModalState={setDisputePassSlipModalIsOpen}
                closeModalAction={closeConfirmationModal}
                action={PassSlipStatus.FOR_DISPUTE}
                tokenId={passSlip.id}
                title={'Dispute Pass Slip Time In'}
              />

              <div className="flex flex-wrap justify-between">
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

                {passSlip.status === PassSlipStatus.FOR_DISPUTE || passSlip.disputeRemarks ? (
                  <div className={`flex flex-col`}>
                    <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                        Employee Dispute Remarks:
                      </label>

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
                ) : null}
              </div>

              {/* <div className="flex flex-row justify-between pb-3">
                <div className="flex flex-col sm:flex-col justify-between items-start w-1/2 gap-1">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 px-0.5 pb-3 "> Mode of Transportation:</label>

                  <div className="w-auto">
                    <label className=" text-md font-medium pl-5">{passSlip.obTransportation ?? 'N/A'}</label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-between items-start w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md  whitespace-nowrap pb-0.5 ">Estimated Hours:</label>

                  <div className="w-auto">
                    <label className=" text-md font-medium pl-5">{passSlip.estimateHours}</label>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-between pb-3">
                <div className="flex flex-col sm:flex-col justify-between items-start w-1/2 gap-1">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 px-0.5 pb-3 "> Time Out:</label>

                  <div className="w-auto">
                    <label className=" text-md font-medium pl-5">
                      {' '}
                      {passSlip.timeOut ? UseTwelveHourFormat(passSlip.timeOut) : 'None'}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-between items-start w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md  whitespace-nowrap pb-0.5 ">Time In:</label>

                  <div className="w-auto">
                    <label className=" text-md font-medium pl-5">
                      {passSlip.timeIn ? UseTwelveHourFormat(passSlip.timeIn) : 'None'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <div className="flex flex-col sm:flex-col justify-between items-start w-1/2 gap-1">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 px-0.5 pb-3 "> Time Out:</label>

                  <div className="w-auto">
                    <label className=" text-md font-medium pl-5">
                      {' '}
                      {passSlip.timeOut ? UseTwelveHourFormat(passSlip.timeOut) : 'None'}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-between items-start w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md  whitespace-nowrap pb-0.5 ">Time In:</label>

                  <div className="w-auto">
                    <label className=" text-md font-medium pl-5">
                      {passSlip.timeIn ? UseTwelveHourFormat(passSlip.timeIn) : 'None'}
                    </label>
                  </div>
                </div>
              </div>

              {passSlip.natureOfBusiness == NatureOfBusiness.PERSONAL_BUSINESS ? (
                <div className={` flex flex-col gap-2`}>
                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-slate-500 text-md font-medium whitespace-nowrap pb-0.5 sm:w-80">
                      For Medical Purpose:
                    </label>
                    <div className="w-auto md:w-96">
                      <label className="text-slate-500  w-96  text-md ">{passSlip.isMedical ? 'Yes' : 'No'}</label>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className={`flex flex-col gap-2`}>
                <label className="text-slate-500 text-md font-medium">Purpose/Desination:</label>
                <textarea
                  className={'resize-none w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                  value={passSlip.purposeDestination}
                  rows={2}
                  disabled={true}
                ></textarea>
              </div>
              {passSlip.status === PassSlipStatus.FOR_DISPUTE || passSlip.disputeRemarks ? (
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
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="w-full justify-end flex gap-2">
              {passSlip.status === PassSlipStatus.APPROVED &&
              passSlip.natureOfBusiness != NatureOfBusiness.HALF_DAY &&
              passSlip.natureOfBusiness != NatureOfBusiness.UNDERTIME &&
              !passSlip.disputeRemarks &&
              passSlip.timeIn &&
              GetDateDifference(`${passSlip.dateOfApplication} 00:00:00`, `${dayjs().format('YYYY-MM-DD HH:mm:ss')} `)
                .days <= 3 ? (
                <Button variant={'warning'} size={'md'} loading={false} onClick={(e) => modalAction(e)} type="submit">
                  File Dispute
                </Button>
              ) : null}
              <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => closeModalAction()}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PassSlipCompletedModal;
