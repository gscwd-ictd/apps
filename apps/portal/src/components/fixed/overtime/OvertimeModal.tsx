/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import CancelOvertimeModal from './CancelOvertimeModal';

type PendingModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const LeavePendingModal = ({ modalState, setModalState, closeModalAction }: PendingModalProps) => {
  const { overtimeDetails, pendingOvertimeModalIsOpen, cancelOvertimeModalIsOpen, setCancelOvertimeModalIsOpen } =
    useOvertimeStore((state) => ({
      overtimeDetails: state.overtimeDetails,
      pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
      cancelOvertimeModalIsOpen: state.cancelOvertimeModalIsOpen,
      setCancelOvertimeModalIsOpen: state.setCancelOvertimeModalIsOpen,
    }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { windowWidth } = UseWindowDimensions();

  // cancel action for Leave Pending Modal
  const closeCancelOvertimeModal = async () => {
    setCancelOvertimeModalIsOpen(false);
  };

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Ongoing Overtime Application</span>
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
          {/* Cancel Overtime Application Modal */}
          <CancelOvertimeModal
            modalState={cancelOvertimeModalIsOpen}
            setModalState={setCancelOvertimeModalIsOpen}
            closeModalAction={closeCancelOvertimeModal}
          />
          {!overtimeDetails ? (
            <>
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col  ">
              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-2 p-4 rounded">
                  <AlertNotification alertType="info" notifMessage="For Approval" dismissible={false} />

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Overtime Date:</label>

                      <div className="w-96 ">
                        <label className="text-slate-500 w-full text-md ">09-23-2023</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Estimated Hours:</label>

                      <div className="w-96 ">
                        <label className="text-slate-500 w-full text-md ">4</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Employees:</label>

                      <div className="w-96 ">
                        <label className="text-slate-500 w-full text-md ">
                          Phyll Fragata, Allyn Joseph Cubero, Mikhail Sebua, Ricardo Vicente Narvaiza
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Purpose:</label>
                    </div>
                    <textarea
                      disabled
                      rows={2}
                      className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                      value={'Mag overtime'}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button
              variant={'warning'}
              size={'md'}
              loading={false}
              onClick={(e) => setCancelOvertimeModalIsOpen(true)}
              type="submit"
            >
              Cancel Overtime
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeavePendingModal;
