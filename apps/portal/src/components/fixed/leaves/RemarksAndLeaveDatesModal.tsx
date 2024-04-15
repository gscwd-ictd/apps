import { Modal } from '@gscwd-apps/oneui';

import dayjs from 'dayjs';
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { UseCapitalizer } from 'apps/employee-monitoring/src/utils/functions/Capitalizer';
import UseRenderBadgePill from '../badge-pill/BadgePill';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

type RemarksAndLeaveDates = {
  leaveDates: Array<string>;
  remarks: string;
};

type LeaveDatesAndRemarksModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  rowData: RemarksAndLeaveDates;
  closeModalAction: () => void;
};

// parse date
const transformDateToString = (date: string | null) => {
  if (date === null) return null;
  else return dayjs(date).format('MMMM DD, YYYY');
};

const RemarksAndLeaveDatesModal: FunctionComponent<LeaveDatesAndRemarksModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
  rowData,
}) => {
  const { windowWidth } = UseWindowDimensions();

  return (
    <Modal
      open={modalState}
      setOpen={setModalState}
      size={
        windowWidth > 1024 && windowWidth < 1280
          ? 'md'
          : windowWidth >= 1280 && windowWidth < 1536
          ? 'sm'
          : windowWidth >= 1536
          ? 'xs'
          : 'full'
      }
    >
      <Modal.Header>
        <div className="flex justify-between grid-cols-2 gap-2">
          <div className="flex items-center gap-2 px-2 font-semibold text-gray-800 w-[50%]">
            <i className="text-3xl bx bxs-info-circle"></i>
            <span className="text-2xl ">Information</span>
          </div>
          <button
            tabIndex={-1}
            type="button"
            className="text-gray-400 bg-transparent  hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={closeModalAction}
          >
            <i className="bx bx-x"></i>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col w-full gap-2 px-2">
          <div className="text-2xl font-medium text-gray-700">{UseCapitalizer(rowData.remarks)}</div>
          <div className="grid sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-2 gap-2 pb-1.5">
            {rowData.leaveDates &&
              rowData.leaveDates.map((date, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <span className="w-full">{UseRenderBadgePill(transformDateToString(date))}</span>
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemarksAndLeaveDatesModal;
