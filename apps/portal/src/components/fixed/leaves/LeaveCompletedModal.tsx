import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { HiX } from 'react-icons/hi';

type LeaveCompletedModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const LeaveCompletedModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: LeaveCompletedModalProps) => {
  const { leaveIndividual } = useLeaveStore((state) => ({
    leaveIndividual: state.leaveIndividual,
  }));

  // for cancel pass slip button
  const modalAction = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Modal size={'lg'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-2xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Completed Leave Application</span>
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
            <AlertNotification
              alertType="info"
              notifMessage="Cancelled"
              dismissible={false}
            />
            <div className="w-full flex flex-col gap-2 p-4 rounded">
              {/* <div className="bg-indigo-400 rounded-full w-8 h-8 flex justify-center items-center text-white font-bold shadow">1</div> */}
              <div className="w-full pb-4">
                <span className="text-slate-500 text-xl font-medium">
                  {`Your Leave Credits as of Jan 1, 2023`}
                </span>
                <table className="bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                  <tbody>
                    <tr className="border border-slate-400">
                      <td className="border border-slate-400"></td>
                      <td className="border border-slate-400 text-center text-sm p-1">
                        Vacation Leave
                      </td>
                      <td className="border border-slate-400 text-center text-sm p-1">
                        Sick Leave
                      </td>
                    </tr>
                    <tr className="border border-slate-400">
                      <td className="border border-slate-400 text-sm p-1">
                        Total Earned
                      </td>
                      <td className="border border-slate-400 p-1 text-center text-sm">
                        20
                      </td>
                      <td className="border border-slate-400 p-1 text-center text-sm">
                        10
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 text-sm p-1">
                        Less this application
                      </td>
                      <td className="border border-slate-400 p-1 text-center text-sm">
                        3
                      </td>
                      <td className="border border-slate-400 p-1 text-center text-sm">
                        2
                      </td>
                    </tr>
                    <tr className="border border-slate-400 bg-green-100">
                      <td className="border border-slate-400 text-sm p-1">
                        Balance
                      </td>
                      <td className="border border-slate-400 p-1 text-center text-sm">
                        7
                      </td>
                      <td className="border border-slate-400 p-1 text-center text-sm">
                        8
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* <div className="flex flex-row gap-4">
                <label className="pt-2 text-slate-500 text-xl font-medium ">
                  Leave Type:
                </label>
                <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                  {selectedLeave.typeOfLeave}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <label className="pt-2 text-slate-500 text-xl font-medium ">
                  Leave Details:
                </label>
              </div>
              <div
                className={`${
                  selectedLeave.detailsOfLeave.withinThePhilippines
                    ? 'flex flex-row gap-4'
                    : 'hidden'
                }`}
              >
                <label className="pt-2 text-slate-500 text-lg font-medium ">
                  Within Philippines:
                </label>
                <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                  {selectedLeave.detailsOfLeave.location}
                </div>
              </div>
              <div
                className={`${
                  selectedLeave.detailsOfLeave.abroad
                    ? 'flex flex-row gap-4'
                    : 'hidden'
                }`}
              >
                <label className="pt-2 text-slate-500 text-lg font-medium ">
                  Abroad:
                </label>
                <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                  {selectedLeave.detailsOfLeave.location}
                </div>
              </div>
              <div
                className={`${
                  selectedLeave.detailsOfLeave.inHospital
                    ? 'flex flex-row gap-4'
                    : 'hidden'
                }`}
              >
                <label className="pt-2 text-slate-500 text-lg font-medium ">
                  In Hospital:
                </label>
                <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                  {selectedLeave.detailsOfLeave.illness}
                </div>
              </div>
              <div
                className={`${
                  selectedLeave.detailsOfLeave.outPatient
                    ? 'flex flex-row gap-4'
                    : 'hidden'
                }`}
              >
                <label className="pt-2 text-slate-500 text-lg font-medium ">
                  Out Patient:
                </label>
                <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                  {selectedLeave.detailsOfLeave.illness}
                </div>
              </div>
              <label
                className={`${
                  selectedLeave.detailsOfLeave.masterDegree
                    ? ' pt-2 text-slate-500 text-lg font-medium'
                    : 'hidden'
                }`}
              >
                {`For Completion of Master's Degree`}
              </label>
              <label
                className={`${
                  selectedLeave.detailsOfLeave.bar
                    ? ' pt-2 text-slate-500 text-lg font-medium'
                    : 'hidden'
                }`}
              >
                {`For BAR/Board Examination Review`}
              </label>
              <label
                className={`${
                  selectedLeave.detailsOfLeave.monetization
                    ? ' pt-2 text-slate-500 text-lg font-medium'
                    : 'hidden'
                }`}
              >
                {`For Monetization of Leave Credits`}
              </label>
              <label
                className={`${
                  selectedLeave.detailsOfLeave.terminal
                    ? ' pt-2 text-slate-500 text-lg font-medium'
                    : 'hidden'
                }`}
              >
                {`For Terminal Leave`}
              </label>

              <div
                className={`${
                  selectedLeave.detailsOfLeave.other
                    ? 'flex flex-row gap-4'
                    : 'hidden'
                }`}
              >
                <label className="pt-2 text-slate-500 text-lg font-medium ">
                  Other Reason:
                </label>
                <div className="text-slate-500 flex items-center p-4 h-10 rounded text-lg border border-slate-300">
                  {selectedLeave.detailsOfLeave.other}
                </div>
              </div> */}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={(e) => modalAction(e)}
                type="submit"
              >
                Cancel Leave
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveCompletedModal;
