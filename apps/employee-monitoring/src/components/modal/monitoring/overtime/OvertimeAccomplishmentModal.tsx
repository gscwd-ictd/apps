/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Modal } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import { NatureOfBusiness, PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import Image from 'next/image';
import React, { FunctionComponent } from 'react';
import { LabelValue } from '../../../labels/LabelValue';
import userphoto from '../../../../../public/user-photo.jpg';
import { Overtime } from 'apps/employee-monitoring/src/utils/types/overtime.type';
import UseRenderBadgePill from 'apps/employee-monitoring/src/utils/functions/RenderBadgePill';
import UseRenderOvertimeStatus from 'apps/employee-monitoring/src/utils/functions/RenderOvertimeStatus';
import { EmployeesUnderOvertimeTable } from '../../../tables/EmployeesUnderOvertimeTable';

type EmployeeRowDetails = {
  overtimeId: string;
  employeeId: string;
};

type OvertimeAccomplishmentModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: EmployeeRowDetails;
};

const ViewEmployeeOvertimeAccomplishmentModal: FunctionComponent<OvertimeAccomplishmentModalProps> = ({
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
            <div className="flex flex-col w-full gap-4 px-2">
              <div className="flex flex-col gap-4 py-2 ">
                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  {/* <LabelValue
                    label="Status"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.status ? UseRenderOvertimeStatus(rowData.status) : ''}
                  />

                  <LabelValue
                    label="Pass Slip Date"
                    direction="top-to-bottom"
                    textSize="md"
                    value={dayjs(rowData.plannedDate).format('MMMM DD, YYYY')}
                  /> */}

                  {JSON.stringify(rowData)}
                </div>

                <hr />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewEmployeeOvertimeAccomplishmentModal;
