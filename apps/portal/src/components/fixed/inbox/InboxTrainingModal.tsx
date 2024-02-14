/* eslint-disable react/jsx-no-undef */
/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useRouter } from 'next/router';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { useInboxStore } from 'apps/portal/src/store/inbox.store';
import { OvertimeMembers, PsbMembers } from 'apps/portal/src/types/inbox.type';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const InboxTrainingModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const router = useRouter();
  const { windowWidth } = UseWindowDimensions();

  const { trainingMessage } = useInboxStore((state) => ({
    trainingMessage: state.message.training,
  }));

  return (
    <>
      <Modal size={windowWidth > 1024 ? 'lg' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Message</span>
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
                  alertType="info"
                  notifMessage={
                    'This is to inform you that you have been nominated to attend the Training session specified below'
                  }
                  dismissible={false}
                />
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Training Title:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md capitalize">{trainingMessage.name}</label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Location:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">{trainingMessage.location}</label>
                </div>
              </div>

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Start Date:</label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">
                      {DateFormatter(trainingMessage.trainingStart, 'MM-DD-YYYY')}
                    </label>
                  </div>
                </div>
              </div>

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">End Date:</label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">
                      {DateFormatter(trainingMessage.trainingEnd, 'MM-DD-YYYY')}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="w-full justify-end flex gap-2">
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

export default InboxTrainingModal;
