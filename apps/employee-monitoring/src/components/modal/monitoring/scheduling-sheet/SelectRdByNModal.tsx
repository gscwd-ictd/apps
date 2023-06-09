/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import { EmployeeAsOptionWithRestDays } from 'libs/utils/src/lib/types/employee.type';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { MySelectList } from 'apps/employee-monitoring/src/components/inputs/SelectList';
import { listOfRestDays } from 'libs/utils/src/lib/constants/rest-days.const';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import UseConvertRestDaysToArray from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysToArray';
import { isEmpty } from 'lodash';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import UseRestDaysOptionToNumberArray from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysOptionToNumberArray';

type SelectRdByNModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: EmployeeAsOptionWithRestDays;
};

const SelectRdByNModal: FunctionComponent<SelectRdByNModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const [selectedRestDays, setSelectedRestDays] = useState<Array<SelectOption>>(
    []
  );

  // use schedule sheet store
  const { currentScheduleSheet, setCurrentScheduleSheet } =
    useScheduleSheetStore((state) => ({
      currentScheduleSheet: state.currentScheduleSheet,
      setCurrentScheduleSheet: state.setCurrentScheduleSheet,
    }));

  // submit
  const onSubmit = () => {
    const membersWithAssignedRestDays = [
      ...currentScheduleSheet.employees.map((employee) => {
        if (employee.employeeId === rowData.employeeId) {
          employee.restDays = UseRestDaysOptionToNumberArray(selectedRestDays);
        }
        return employee;
      }),
    ];

    setCurrentScheduleSheet({
      ...currentScheduleSheet,
      employees: membersWithAssignedRestDays,
    });

    closeModal();
  };

  // close modal action
  const closeModal = () => {
    closeModalAction();
  };

  // get the rest-days from the props, convert  1 q them into select option (label, value) state
  useEffect(() => {
    // initially assign to an empty array
    let restDays: Array<SelectOption> = [];

    // if the modal is opened and rest days is not empty
    if (modalState && !isEmpty(rowData.restDays)) {
      // convert the array of numbers into array of select option
      restDays = UseConvertRestDaysToArray(rowData.restDays);

      // assign the converted value to selectedRestDays state
      setSelectedRestDays(restDays);
    }
    // assign the default value to selectedRestDays state
    else setSelectedRestDays(restDays);
  }, [modalState, rowData.restDays]);

  return (
    <>
      <Modal
        open={modalState}
        setOpen={setModalState}
        size="sm"
        steady
        noShakeOnSteady={true}
      >
        <Modal.Header>
          <div className="flex justify-between w-full pl-5">
            <span className="text-2xl font-medium">Select Rest Days</span>
            <button
              onClick={closeModal}
              className="px-2 rounded hover:bg-gray-200"
            >
              &times;
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col w-full min-h-[2.25rem] gap-1 px-5">
            <div className="flex items-center justify-center gap-2 mb-5">
              <i className="text-gray-400 text-7xl bx bxs-user-circle"></i>
              <div className="flex flex-col w-full">
                <p className="text-xl font-semibold">{rowData.fullName}</p>
                <p className="font-light text-md">{rowData.positionTitle}</p>
              </div>
            </div>

            <MySelectList
              id="scheduleRestDays"
              label="Rest Days"
              multiple
              options={listOfRestDays}
              onChange={(o) => setSelectedRestDays(o)}
              value={selectedRestDays}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 py-2 text-gray-700 bg-gray-200 rounded text-md hover:bg-gray-300"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              className="px-3 py-2 text-white bg-green-600 rounded text-md disabled:cursor-not-allowed hover:bg-green-400"
              type="button"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SelectRdByNModal;
