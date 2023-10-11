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
      <Modal size={windowWidth > 1024 ? 'lg' : 'full'} open={modalState} setOpen={setModalState}>
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
              ) : null}

              {passSlip.status === PassSlipStatus.DISAPPROVED ? (
                <AlertNotification alertType="error" notifMessage="Disapproved" dismissible={false} />
              ) : null}

              {passSlip.status === PassSlipStatus.DISPUTE ? (
                <AlertNotification alertType="error" notifMessage="For Dispute Review" dismissible={false} />
              ) : null}

              {/* dispute pass slip time in */}
              <DisputeApplicationModal
                modalState={disputePassSlipModalIsOpen}
                setModalState={setDisputePassSlipModalIsOpen}
                closeModalAction={closeConfirmationModal}
                action={PassSlipStatus.DISPUTE}
                tokenId={passSlip.id}
                title={'Dispute Pass Slip Time In'}
              />

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Date of Application:
                </label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">
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
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center ">
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
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="w-full justify-end flex gap-2">
              {passSlip.status === PassSlipStatus.APPROVED &&
              passSlip.timeIn &&
              GetDateDifference(`2023-10-10 00:00:00`, `${dayjs().format('YYYY-MM-DD HH:mm:ss')} `).days <= 3 ? (
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
