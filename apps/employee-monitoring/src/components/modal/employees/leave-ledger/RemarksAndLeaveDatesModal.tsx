import { Modal, PageContentContext } from '@gscwd-apps/oneui';
import UseRenderBadgePill from '../../../../utils/functions/RenderBadgePill';
import dayjs from 'dayjs';
import React, { Dispatch, FunctionComponent, SetStateAction, useContext, useEffect, useState } from 'react';
import { UseCapitalizer } from 'apps/employee-monitoring/src/utils/functions/Capitalizer';
import { LabelValue } from '../../../labels/LabelValue';
import { isEmpty } from 'lodash';

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
  const {
    aside: { windowWidth },
  } = useContext(PageContentContext);
  const [mutatedDatesArray, setMutatedDatesArray] = useState([]);

  useEffect(() => {
    if (!isEmpty(rowData)) {
      const array = rowData.leaveDates.toString().split(',');
      setMutatedDatesArray(array);
    }
  }, [rowData]);

  return (
    <>
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
          <div className="flex flex-col w-full gap-2 px-2 pb-2">
            <LabelValue
              label="Remarks"
              direction="top-to-bottom"
              textSize="md"
              value={<p className="text-lg pl-4">{UseCapitalizer(rowData.remarks)}</p>}
            />

            {!isEmpty(mutatedDatesArray) ? (
              <LabelValue
                label="Leave Date/s"
                direction="top-to-bottom"
                textSize="md"
                value={
                  <div className="grid grid-cols-2 gap-2 pl-4 py-1.5">
                    {mutatedDatesArray &&
                      mutatedDatesArray.map((date, idx) => {
                        return (
                          <React.Fragment key={idx}>
                            <span className="w-full">{UseRenderBadgePill(transformDateToString(date))}</span>
                          </React.Fragment>
                        );
                      })}
                  </div>
                }
              />
            ) : null}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <></>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RemarksAndLeaveDatesModal;
