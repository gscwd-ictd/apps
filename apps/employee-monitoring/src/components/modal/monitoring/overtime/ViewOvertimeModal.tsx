/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import React, { FunctionComponent } from 'react';
import { LabelValue } from '../../../labels/LabelValue';
import { Overtime } from 'libs/utils/src/lib/types/overtime.type';
import UseRenderOvertimeStatus from 'apps/employee-monitoring/src/utils/functions/RenderOvertimeStatus';
import { EmployeesUnderOvertimeTable } from '../../../tables/EmployeesUnderOvertimeTable';

type ViewOvertimeModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Overtime;
};

const ViewOvertimeModal: FunctionComponent<ViewOvertimeModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="lg">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between text-2xl font-semibold text-gray-800">
            <div className="flex gap-1 px-5 text-2xl font-semibold text-gray-800">
              <span>Overtime</span>
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
                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Status"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.status ? UseRenderOvertimeStatus(rowData.status) : ''}
                  />

                  <LabelValue
                    label="Overtime Date"
                    direction="top-to-bottom"
                    textSize="md"
                    value={dayjs(rowData.plannedDate).format('MMMM DD, YYYY')}
                  />
                </div>

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Immediate Supervisor"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.immediateSupervisorName ? rowData.immediateSupervisorName : 'N/A'}
                  />

                  <LabelValue
                    label="Estimated No. of Hours"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.estimatedHours ? rowData.estimatedHours : 'N/A'}
                  />
                </div>

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Purpose"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.purpose ? rowData.purpose : 'N/A'}
                  />
                </div>

                <hr />

                <div className="grid px-5 grid-cols-1">
                  <EmployeesUnderOvertimeTable overtimeId={rowData.id} employees={rowData.employees} />
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

export default ViewOvertimeModal;
