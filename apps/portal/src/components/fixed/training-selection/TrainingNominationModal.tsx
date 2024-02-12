/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import Link from 'next/link';
import { HiPencilAlt, HiPlus, HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { useRouter } from 'next/router';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { MySelectList } from '../../modular/inputs/SelectList';

const listOfEmployees: Array<SelectOption> = [
  { label: 'Ricardo Vicente Narvaiza', value: '0' },
  { label: 'Mikhail Sebua', value: '6e0eecab-0e63-11ee-8b82-005056b680ac' },
  { label: 'Jay Nosotros', value: 'af761daa-b26e-11ed-a79b-000c29f95a80' },
  { label: 'Eric Sison', value: '62fef63c-b26f-11ed-a79b-000c29f95a80' },
  { label: 'Allyn Joseph Cubero', value: 'af5633d6-b26e-11ed-a79b-000c29f95a80' },
  { label: 'John Henry Alfeche', value: '05b0614c-b191-11ed-a79b-000c29f95a80' },
  { label: 'Phyll Patrick Fragata', value: 'af635f15-b26e-11ed-a79b-000c29f95a80' },
  { label: 'Deo Del Rosario', value: 'af59e049-b26e-11ed-a79b-000c29f95a80' },
  { label: 'Cara Jade Reyes', value: '6e0ef093-0e63-11ee-8b82-005056b680ac' },
  { label: 'Rizza Baugbog', value: 'b34db5e3-b1c6-11ed-a79b-000c29f95a80' },
  // { label: 'Kumier Lou Arancon', value: '10' },
  // { label: 'Roland Bacayo', value: '11' },
  // { label: 'Alfred Perez', value: '12' },
  // { label: 'Elea Glen Lacerna', value: '13' },
  // { label: 'Ricky Libertad', value: '14' },
];

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
    trainingModalIsOpen,
    setIndividualTrainingDetails,
    nominatedEmployees,
    setNominatedEmployees,
    auxiliaryEmployees,
    setAuxiliaryEmployees,
    employeeList,
  } = useTrainingSelectionStore((state) => ({
    recommendedEmployees: state.recommendedEmployees,
    individualTrainingDetails: state.individualTrainingDetails,
    trainingModalIsOpen: state.setTrainingModalIsOpen,
    setIndividualTrainingDetails: state.setIndividualTrainingDetails,
    nominatedEmployees: state.nominatedEmployees,
    setNominatedEmployees: state.setNominatedEmployees,
    auxiliaryEmployees: state.auxiliaryEmployees,
    setAuxiliaryEmployees: state.setAuxiliaryEmployees,
    employeeList: state.employeeList,
  }));

  const [employeePool, setEmployeePool] = useState<Array<SelectOption>>([]);
  const [tempEmployeePool, setTempEmployeePool] = useState<Array<SelectOption>>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Array<SelectOption>>([]);
  const [selectedAuxiliaryEmployees, setSelectedAuxiliaryEmployees] = useState<Array<SelectOption>>([]);
  const [combinedNominatedEmployees, setCombinedNominatedEmployees] = useState<Array<SelectOption>>([]); // pool of selected and auxiliary employees
  const [isDuplicatedNominee, setIsDuplicatedNominee] = useState<boolean>(false);

  useEffect(() => {
    // setEmployeePool(listOfEmployees);
    setNominatedEmployees(selectedEmployees); //store
    setAuxiliaryEmployees(selectedAuxiliaryEmployees); //store
  }, [selectedEmployees, selectedAuxiliaryEmployees]);

  useEffect(() => {
    const uniqueNames = Array.from(new Set([...nominatedEmployees, ...auxiliaryEmployees]));
    setCombinedNominatedEmployees(uniqueNames);
  }, [nominatedEmployees, auxiliaryEmployees]);

  useEffect(() => {
    //remove employee from pool
    for (let i = 0; i < employeePool.length; i++) {
      for (let a = 0; a < combinedNominatedEmployees.length; a++) {
        if (employeePool[i].value === combinedNominatedEmployees[a].value) {
          // console.log(combinedNominatedEmployees[a].value);
          setEmployeePool(employeePool.filter((e) => e.value !== combinedNominatedEmployees[a].value));
        } else {
          //do nothing
        }
      }
    }
    //add back employee
    for (let i = 0; i < employeeList.length; i++) {
      if (!employeePool.includes(employeeList[i]) && !combinedNominatedEmployees.includes(employeeList[i])) {
        const uniqueNames = Array.from(new Set([...employeePool, employeeList[i]]));
        setEmployeePool(
          uniqueNames.sort(function (a, b) {
            return a.label.localeCompare(b.label);
          })
        );
      }
    }
  }, [combinedNominatedEmployees]);

  useEffect(() => {
    setEmployeePool(
      employeeList.sort(function (a, b) {
        return a.label.localeCompare(b.label);
      })
    );
  }, []);

  const { windowWidth } = UseWindowDimensions();

  return (
    <div>
      <Modal size={windowWidth > 1024 ? 'md' : 'full'} open={modalState} setOpen={setModalState} steady>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Nominate Employees</span>
              {/* <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button> */}
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {auxiliaryEmployees.length > 2 ? (
            <AlertNotification
              alertType="warning"
              notifMessage="Selected Auxiliary Participants exceeded"
              dismissible={false}
            />
          ) : null}

          {nominatedEmployees.length > individualTrainingDetails.numberOfSlots ? (
            <AlertNotification alertType="warning" notifMessage="Selected Participants exceeded" dismissible={false} />
          ) : null}

          {isDuplicatedNominee ? (
            <AlertNotification
              alertType="warning"
              notifMessage="There are duplicate employee nominations"
              dismissible={false}
            />
          ) : null}

          <div className="w-full h-full flex flex-col gap-2">
            <div className="w-full flex flex-col gap-2 p-4 rounded">
              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-start">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Recommended Participants:
                </label>

                <div className="w-auto sm:w-96 flex flex-col flex-wrap text-slate-500 text-md font-medium">
                  {recommendedEmployees.map((employee, index) => {
                    return <label key={index}>{index == 0 ? employee.name : `${employee.name}`}</label>;
                  })}
                </div>
              </div>

              <div className="flex flex-col md:gap-2 justify-between items-start">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Select Participants:
                </label>

                <MySelectList
                  isSelectedHidden={true}
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
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                onClick={closeModalAction}
                variant={'primary'}
                size={'md'}
                loading={false}
                form="ApplyOvertimeForm"
                type="submit"
                disabled={
                  auxiliaryEmployees.length > 2 || selectedEmployees.length > individualTrainingDetails.numberOfSlots
                    ? true
                    : false
                }
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TrainingNominationModal;
