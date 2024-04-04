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
      <Modal size={windowWidth > 1024 ? 'sm' : 'full'} open={modalState} setOpen={setModalState}>
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
            <div className="w-full flex flex-col gap-2 px-4 rounded">
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

                <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Purpose/Desination:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{passSlip.purposeDestination}</label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Supervisor:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{passSlip.supervisorName}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
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
