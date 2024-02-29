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

export const InboxOvertimeModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const router = useRouter();
  const { windowWidth } = UseWindowDimensions();

  const { overtimeMessage } = useInboxStore((state) => ({
    overtimeMessage: state.message.overtime,
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
            <div className="w-full flex flex-col gap-2 px-4 rounded">
              <div className="w-full flex flex-col gap-0">
                <AlertNotification
                  alertType="info"
                  notifMessage={
                    'This is to inform you that you have been requested for Overtime with the specified details below.'
                  }
                  dismissible={false}
                />
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Date:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">
                    {DateFormatter(overtimeMessage.plannedDate, 'MM-DD-YYYY')}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Estimated Hours:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">{overtimeMessage.estimatedHours}</label>
                </div>
              </div>

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Purpose:</label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">{overtimeMessage.purpose}</label>
                  </div>
                </div>
              </div>

              <div className={`flex flex-col gap-2`}>
                <label className="text-slate-500 text-md font-medium">Other Employees Assigned:</label>
                {overtimeMessage?.employeeDetails?.map((employee: OvertimeMembers, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`${
                        index != 0 ? 'border-t border-slate-200' : ''
                      } p-2 md:p-4 flex flex-row justify-between items-center gap-8 `}
                    >
                      <img
                        className="rounded-full border border-stone-100 shadow w-14"
                        src={employee?.avatarUrl ?? ''}
                        alt={'photo'}
                      ></img>
                      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
                        <div className="w-full flex flex-row items-center gap-4 text-sm md:text-md text-slate-500">
                          <label className="w-full">{employee.employeeFullName}</label>
                          <label className="w-full">{employee.position}</label>
                          <label className="w-full">{employee.assignment}</label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
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

export default InboxOvertimeModal;
