/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import React, { FunctionComponent } from 'react';
import { LabelValue } from '../../../labels/LabelValue';

//type
import { SystemLog } from 'apps/employee-monitoring/src/utils/types/system-log.type';

type ViewSystemLogModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: SystemLog;
};

const ViewSystemLogModal: FunctionComponent<ViewSystemLogModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between text-2xl font-semibold text-gray-800">
            <div className="flex gap-1 px-5 text-xl font-semibold text-gray-800">
              <span>System Log</span>
            </div>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModalAction}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full min-h-[14rem]">
            <div className="flex flex-col w-full px-2 py-4">
              <div className="flex flex-col gap-4">
                <div className="grid px-5 gap-3">
                  <div className="flex flex-row gap-2">
                    <LabelValue
                      label="Date Logged"
                      direction="top-to-bottom"
                      textSize="xs"
                      value={dayjs(rowData.dateLogged).format('MMMM DD, YYYY')}
                    />
                    <LabelValue
                      label="Time Logged"
                      direction="top-to-bottom"
                      textSize="xs"
                      value={rowData.timeLogged}
                    />
                  </div>
                  <LabelValue label="Name" direction="top-to-bottom" textSize="xs" value={rowData.userName} />
                  <LabelValue label="Method" direction="top-to-bottom" textSize="xs" value={rowData.method} />
                  <LabelValue label="Route" direction="top-to-bottom" textSize="xs" value={rowData.route} />
                  <LabelValue
                    label="Body"
                    direction="top-to-bottom"
                    textSize="xs"
                    value={JSON.stringify(rowData.body)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <></>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewSystemLogModal;
