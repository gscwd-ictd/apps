/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import { useEffect, useState } from 'react';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { MySelectList } from '../../modular/inputs/SelectList';
import { HiCheck, HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';

type TrainingNominationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const TrainingNominationModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: TrainingNominationModalProps) => {
  const {
    recommendedEmployees,
    individualTrainingDetails,
    nominatedEmployees,
    setNominatedEmployees,
    auxiliaryEmployees,
    setAuxiliaryEmployees,
    employeeList,
    trainingNominationModalIsOpen,
  } = useTrainingSelectionStore((state) => ({
    recommendedEmployees: state.recommendedEmployees,
    individualTrainingDetails: state.individualTrainingDetails,
    nominatedEmployees: state.nominatedEmployees,
    setNominatedEmployees: state.setNominatedEmployees,
    auxiliaryEmployees: state.auxiliaryEmployees,
    setAuxiliaryEmployees: state.setAuxiliaryEmployees,
    employeeList: state.employeeList,
    trainingNominationModalIsOpen: state.trainingNominationModalIsOpen,
  }));

  const [employeePool, setEmployeePool] = useState<Array<SelectOption>>(employeeList);
  const [selectedEmployees, setSelectedEmployees] = useState<Array<SelectOption>>([]);
  const [selectedAuxiliaryEmployees, setSelectedAuxiliaryEmployees] = useState<Array<SelectOption>>([]);
  const [combinedNominatedEmployees, setCombinedNominatedEmployees] = useState<Array<SelectOption>>([]); // pool of selected and auxiliary employees
  const [isDuplicatedNominee, setIsDuplicatedNominee] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [selectedAll, setSelectedAll] = useState<boolean>(false);

  useEffect(() => {
    if (trainingNominationModalIsOpen) {
      if (isEmpty(nominatedEmployees) && isEmpty(auxiliaryEmployees)) {
        setInitialLoad(true);
        setEmployeePool(
          employeeList.sort(function (a, b) {
            return a.label.localeCompare(b.label);
          })
        );
        setSelectedEmployees([]); //store
        setSelectedAuxiliaryEmployees([]); //store

        setTimeout(() => {
          setInitialLoad(false);
        }, 200);
      } else {
        const uniqueNames = Array.from(new Set([...nominatedEmployees, ...auxiliaryEmployees]));
        handleInitialEmployeePool(uniqueNames);
      }
    }
  }, [trainingNominationModalIsOpen]);

  //initial rearrangement of employee pool - should run once during opening of modal
  const handleInitialEmployeePool = (uniqueNames: Array<SelectOption>) => {
    //remove employee from pool
    setEmployeePool(employeeList.filter((item) => !uniqueNames.includes(item)));
    setSelectedEmployees(nominatedEmployees);
    setSelectedAuxiliaryEmployees(auxiliaryEmployees);
    setTimeout(() => {
      setInitialLoad(false);
    }, 200);
  };

  const handleSelectAll = () => {
    setSelectedEmployees(employeeList);
    setSelectedAuxiliaryEmployees([]);
    setSelectedAll(true);
  };

  const handleClearAll = () => {
    setSelectedEmployees([]);
    setSelectedAuxiliaryEmployees([]);
    setSelectedAll(false);
  };

  useEffect(() => {
    if (selectedEmployees.length <= 0) {
      setSelectedAll(false);
    }
  }, [selectedEmployees]);

  useEffect(() => {
    if (!initialLoad && trainingNominationModalIsOpen) {
      const uniqueNames = Array.from(new Set([...selectedEmployees, ...selectedAuxiliaryEmployees]));
      setCombinedNominatedEmployees(uniqueNames);
    }
  }, [selectedEmployees, selectedAuxiliaryEmployees]);

  useEffect(() => {
    if (!initialLoad && trainingNominationModalIsOpen) {
      // console.log(selectedEmployees, 'selected');
      // console.log(selectedAuxiliaryEmployees, 'auxiliary');
      // console.log(combinedNominatedEmployees, 'combined');

      setEmployeePool(employeeList.filter((item) => !combinedNominatedEmployees.includes(item)));
      // selectedEmployees.some((e) => e.value == employee.employeeId)
      // setEmployeePool(employeeList.filter(el=> el !== combinedNominatedEmployees));
    }
  }, [combinedNominatedEmployees]);

  const handleSubmit = async () => {
    setNominatedEmployees(selectedEmployees); //store
    setAuxiliaryEmployees(selectedAuxiliaryEmployees); //store
    closeModalAction();
  };

  const addEmployeeToList = (employee: SelectOption) => {
    const employeeArray = employee;
    // console.log(selectedEmployees, 'vs', employeeArray);
    // console.log(selectedEmployees.some((e) => e.value === employeeArray[0].value));
    if (selectedEmployees.some((e) => e.value === employeeArray.value)) {
      // console.log('tanggal sa selected');
      setSelectedEmployees(selectedEmployees.filter((e) => e.value != employeeArray.value));
    } else if (selectedAuxiliaryEmployees.some((e) => e.value === employeeArray.value)) {
      // console.log('tanggal sa aux');
      setSelectedAuxiliaryEmployees(selectedAuxiliaryEmployees.filter((e) => e.value != employeeArray.value));
      // console.log('added');
      setSelectedEmployees([employee, ...selectedEmployees]);
    } else {
      // console.log('added');
      setSelectedEmployees([employee, ...selectedEmployees]);
    }

    // const uniqueNames = Array.from(new Set([...employee, ...nominatedEmployees, ...auxiliaryEmployees]));
    // handleInitialEmployeePool(uniqueNames);
  };

  // useEffect(() => {
  //   // console.log(employeePool, 'pool');
  // }, [employeePool]);

  const { windowWidth } = UseWindowDimensions();

  return (
    <div>
      <Modal size={windowWidth > 1024 ? 'md' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Nominate Employees</span>
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
          {selectedEmployees.length > individualTrainingDetails.numberOfSlots ? (
            <AlertNotification alertType="warning" notifMessage="Selected Participants exceeded." dismissible={false} />
          ) : null}

          {selectedAuxiliaryEmployees.length > 2 ? (
            <AlertNotification
              alertType="warning"
              notifMessage="Selected Auxiliary Participants exceeded."
              dismissible={false}
            />
          ) : null}

          {isDuplicatedNominee ? (
            <AlertNotification
              alertType="warning"
              notifMessage="There are duplicate employee nominations."
              dismissible={false}
            />
          ) : null}

          <div className="w-full h-full flex flex-col gap-2">
            <div className="w-full flex flex-col gap-2 px-4 rounded">
              <div className="flex flex-col sm:flex-row md:gap-2 justify-start items-start md:items-start">
                <label className="text-slate-500 text-md whitespace-nowrap sm:w-80">No. of Slots:</label>

                <div className="w-auto px-4 md:px-2 flex flex-col flex-wrap text-slate-500 text-md font-medium">
                  {`${selectedEmployees.length} / ${individualTrainingDetails.numberOfSlots}`}
                </div>
              </div>

              <div className="flex flex-col sm:flex-col md:gap-2 justify-start items-start md:items-start">
                <label className="text-slate-500 text-md whitespace-nowrap sm:w-80">Recommended Participants:</label>

                <div className="w-full flex flex-wrap text-slate-500 text-md font-medium px-2 md:px-4">
                  {recommendedEmployees.map((employee, index) => {
                    let e = {
                      value: employee.employeeId,
                      label: employee.name,
                    };
                    return (
                      <div
                        key={index}
                        className="flex flex-row gap-1 items-center w-full md:w-1/2 "
                        // onClick={() =>
                        //   addEmployeeToList({
                        //     value: employee.employeeId,
                        //     label: employee.name,
                        //   })
                        // }
                      >
                        {selectedEmployees.some((e) => e.value == employee.employeeId) ? (
                          <HiCheck className="text-blue-500" />
                        ) : null}

                        {/* <label
                          className={`cursor-pointer select-none
                             hover:text-blue-500
                              hover:bg-slate-300 w-auto px-4 md:px-2 ${
                                selectedEmployees.some((e) => e.value == employee.employeeId) ? 'text-blue-500' : ''
                              }`}
                          key={index}
                        >
                          {employee.name}
                        </label> */}

                        <label
                          className={`w-auto px-4 md:px-2 ${
                            selectedEmployees.some((e) => e.value == employee.employeeId) ? 'text-blue-500' : ''
                          }`}
                          key={index}
                        >
                          {employee.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col md:gap-2 justify-between items-start pt-2">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Select Participants:
                </label>

                <MySelectList
                  isSelectedHidden={true}
                  withSearchBar={true}
                  id="employees"
                  label=""
                  multiple
                  options={employeePool}
                  onChange={(o) => setSelectedEmployees(o)}
                  value={selectedEmployees}
                />
              </div>

              <div className="flex flex-col md:gap-2 justify-between items-start">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Select Auxiliary Participants:
                </label>

                <MySelectList
                  isSelectedHidden={true}
                  withSearchBar={true}
                  id="employees"
                  label=""
                  multiple
                  options={employeePool}
                  onChange={(o) => setSelectedAuxiliaryEmployees(o)}
                  value={selectedAuxiliaryEmployees}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            {selectedAll ? (
              <Button onClick={handleClearAll} variant={'warning'} size={'md'} loading={false} type="button">
                Clear All
              </Button>
            ) : (
              <Button onClick={handleSelectAll} variant={'primary'} size={'md'} loading={false} type="button">
                Select All
              </Button>
            )}

            <Button
              onClick={handleSubmit}
              variant={'primary'}
              size={'md'}
              loading={false}
              form="SubmitNomination"
              type="submit"
              disabled={
                selectedAuxiliaryEmployees.length > 2 ||
                selectedEmployees.length > individualTrainingDetails.numberOfSlots
                  ? true
                  : false
              }
            >
              Submit
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TrainingNominationModal;
