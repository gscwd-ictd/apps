import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { useState } from 'react';

type PassSlipPendingModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ApprovalsPendingPassSlipModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipPendingModalProps) => {
  const { passSlip } = usePassSlipStore((state) => ({
    passSlip: state.passSlip,
  }));

  const modalAction = async (e) => {
    e.preventDefault();
  };

  const [reason, setReason] = useState<string>('');
  const [action, setAction] = useState<string>('');

  const onChangeType = (action: string) => {
    setAction(action);
    console.log(action);
  };

  const handleReason = (e: string) => {
    setReason(e);
  };

  return (
    <>
      <Modal size={'lg'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-2xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Ongoing Pass Slip</span>
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
          <div className="w-full h-full flex flex-col gap-2 ">
            <div className="w-full flex flex-col gap-2 p-4 rounded">
              <AlertNotification
                alertType="warning"
                notifMessage="Awaiting Supervisor Approval"
                dismissible={false}
              />

              <div className="flex gap-2 justify-between items-center">
                <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                  Date of Application:
                </label>

                <div className="w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {passSlip.dateOfApplication}
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-between items-center">
                <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                  Nature of Business:
                </label>

                <div className="w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {passSlip.natureOfBusiness}
                  </label>
                </div>
              </div>

              {passSlip.natureOfBusiness === 'Official Business' ? (
                <div className="flex gap-3 justify-between items-center">
                  <label
                    className={`text-slate-500 text-lg whitespace-nowrap font-medium`}
                  >
                    Mode of Transportation:
                  </label>
                  <div className="w-96">
                    <label className="text-slate-500 h-12 w-96  text-lg ">
                      {passSlip.obTransportation}
                    </label>
                  </div>
                </div>
              ) : null}

              <div className={` flex flex-col gap-2`}>
                <div className="flex gap-2 justify-between items-center">
                  <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                    Estimated Hours:
                  </label>
                  <div className="w-96">
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
                  rows={4}
                  disabled={true}
                ></textarea>
              </div>
              <div className="w-full flex gap-2 justify-start items-center pt-12">
                <span className="text-slate-500 text-xl font-medium">
                  Action:
                </span>
                <select
                  className={`text-slate-500 w-100 h-10 rounded text-md border border-slate-200'
                  
              `}
                  onChange={(e) =>
                    onChangeType(e.target.value as unknown as string)
                  }
                >
                  <option>Approve</option>
                  <option>Disapprove</option>
                </select>
              </div>
              <form id="DisapproveForm">
                {action === 'Disapprove' ? (
                  <textarea
                    required={true}
                    className={
                      'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
                    }
                    placeholder="Enter Reason"
                    rows={3}
                    onChange={(e) =>
                      handleReason(e.target.value as unknown as string)
                    }
                  ></textarea>
                ) : null}
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                variant={'warning'}
                size={'md'}
                loading={false}
                onClick={(e) => modalAction(e)}
                type="submit"
              >
                Disapprove
              </Button>
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={(e) => modalAction(e)}
                type="submit"
              >
                Approve
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalsPendingPassSlipModal;
