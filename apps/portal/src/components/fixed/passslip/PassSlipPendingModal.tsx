/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { ConfirmationApplicationModal } from './ConfirmationModal';
import { NatureOfBusiness, PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type PassSlipPendingModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const PassSlipPendingModal = ({ modalState, setModalState, closeModalAction }: PassSlipPendingModalProps) => {
  const { passSlip, cancelApplicationModalIsOpen, setCancelApplicationModalIsOpen } = usePassSlipStore((state) => ({
    passSlip: state.passSlip,
    cancelApplicationModalIsOpen: state.cancelApplicationModalIsOpen,
    setCancelApplicationModalIsOpen: state.setCancelApplicationModalIsOpen,
  }));

  // for cancel pass slip button
  const modalAction = async (e) => {
    e.preventDefault();
    setCancelApplicationModalIsOpen(true);
  };

  // cancel action for Confirmation Application Modal
  const closeConfirmationModal = async () => {
    setCancelApplicationModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={windowWidth > 1024 ? 'lg' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">For Approval Pass Slip</span>
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

              {/* cancell pass slip application */}
              <ConfirmationApplicationModal
                modalState={cancelApplicationModalIsOpen}
                setModalState={setCancelApplicationModalIsOpen}
                closeModalAction={closeConfirmationModal}
                action={PassSlipStatus.CANCELLED}
                tokenId={passSlip.id}
                title={'Cancel Pass Slip'}
              />

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 txt-md font-medium whitespace-nowrap sm:w-80">
                  Date of Application:
                </label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  txt-md ">
                    {DateFormatter(passSlip.dateOfApplication, 'MM-DD-YYYY')}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 txt-md font-medium whitespace-nowrap sm:w-80">
                  Nature of Business:
                </label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  txt-md ">{passSlip.natureOfBusiness}</label>
                </div>
              </div>

              {passSlip.natureOfBusiness === NatureOfBusiness.OFFICIAL_BUSINESS ? (
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className={`text-slate-500 txt-md whitespace-nowrap font-medium sm:w-80`}>
                    Mode of Transportation:
                  </label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  txt-md ">{passSlip.obTransportation}</label>
                  </div>
                </div>
              ) : null}

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 txt-md font-medium whitespace-nowrap sm:w-80">
                    Estimated Hours:
                  </label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  txt-md ">{passSlip.estimateHours}</label>
                  </div>
                </div>
              </div>
              {passSlip.natureOfBusiness == NatureOfBusiness.PERSONAL_BUSINESS ? (
                <div className={` flex flex-col gap-2`}>
                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                      For Medical Purpose:
                    </label>
                    <div className="w-auto md:w-96">
                      <label className="text-slate-500 h-12 w-96  text-md ">{passSlip.isMedical ? 'Yes' : 'No'}</label>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className={`flex flex-col gap-2`}>
                <label className="text-slate-500 txt-md font-medium">Purpose/Desination:</label>
                <textarea
                  className={'resize-none w-full p-2 rounded text-slate-500 txt-md border-slate-300'}
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
              <Button variant={'warning'} size={'md'} loading={false} onClick={(e) => modalAction(e)} type="submit">
                Cancel Pass Slip
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PassSlipPendingModal;
