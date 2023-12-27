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
  { label: 'Mikhail Sebua', value: '1' },
  { label: 'Jay Nosotros', value: '2' },
  { label: 'Eric Sison', value: '3' },
  { label: 'Allyn Joseph Cubero', value: '4' },
  { label: 'John Henry Alfeche', value: '5' },
  { label: 'Phyll Patrick Fragata', value: '6' },
  { label: 'Deo Del Rosario', value: '7' },
  { label: 'Cara Jade Reyes', value: '8' },
  { label: 'Rizza Baugbog', value: '9' },
  { label: 'Kumier Lou Arancon', value: '10' },
  { label: 'Roland Bacayo', value: '11' },
  { label: 'Alfred Perez', value: '12' },
  { label: 'Elea Glen Lacerna', value: '13' },
  { label: 'Ricky Libertad', value: '14' },
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
  } = useTrainingSelectionStore((state) => ({
    recommendedEmployees: state.recommendedEmployees,
    individualTrainingDetails: state.individualTrainingDetails,
    trainingModalIsOpen: state.setTrainingModalIsOpen,
    setIndividualTrainingDetails: state.setIndividualTrainingDetails,
    nominatedEmployees: state.nominatedEmployees,
    setNominatedEmployees: state.setNominatedEmployees,
    auxiliaryEmployees: state.auxiliaryEmployees,
    setAuxiliaryEmployees: state.setAuxiliaryEmployees,
  }));

  const [employeePool, setEmployeePool] = useState<Array<SelectOption>>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Array<SelectOption>>([]);
  const [selectedAuxiliaryEmployees, setSelectedAuxiliaryEmployees] = useState<Array<SelectOption>>([]);
  const [isDuplicatedNominee, setIsDuplicatedNominee] = useState<boolean>(false);

  const setParticipant = (employee: Array<SelectOption>) => {
    setSelectedEmployees(employee);

    //remove employee from pool
    for (let a = 0; a < employee.length; a++) {
      setEmployeePool(employeePool.filter((e) => e.value !== employee[a].value));
    }

    //add back employee to pool if they don't exist in selectedEmployees or selectedAuxiliaryEmployees
    for (let i = 0; i < listOfEmployees.length; i++) {
      for (let j = 0; j < selectedEmployees.length; j++) {
        //check if selectedEmployee has specific employee in its array
        if (listOfEmployees[i].value === selectedEmployees[j].value) {
          const uniqueNames = Array.from(new Set([...employeePool, listOfEmployees[i]]));
          setEmployeePool(
            uniqueNames.sort(function (a, b) {
              return a.label.localeCompare(b.label);
            })
          );
          // console.log(listOfEmployees[i], `added ${i}`);
        } else {
          // console.log(listOfEmployees[i], `not added ${i}`);
          for (let k = 0; k < selectedAuxiliaryEmployees.length; k++) {
            if (listOfEmployees[i].value === selectedAuxiliaryEmployees[k].value) {
              const uniqueNames = Array.from(new Set([...employeePool, listOfEmployees[i]]));
              setEmployeePool(
                uniqueNames.sort(function (a, b) {
                  return a.label.localeCompare(b.label);
                })
              );
            } else {
              //do nothing
            }
          }
        }
      }
    }
    console.log(employeePool);
  };

  const setAuxParticipant = (employee: Array<SelectOption>) => {
    setSelectedAuxiliaryEmployees(employee);

    //remove employee from pool
    for (let a = 0; a < employee.length; a++) {
      setEmployeePool(employeePool.filter((e) => e.value !== employee[a].value));
    }

    //add back employee to pool if they don't exist in selectedEmployees or selectedAuxiliaryEmployees
    for (let i = 0; i < listOfEmployees.length; i++) {
      for (let j = 0; j < selectedAuxiliaryEmployees.length; j++) {
        //check if selectedEmployee has specific employee in its array
        if (listOfEmployees[i].value === selectedAuxiliaryEmployees[j].value) {
          const uniqueNames = Array.from(new Set([...employeePool, listOfEmployees[i]]));
          setEmployeePool(
            uniqueNames.sort(function (a, b) {
              return a.label.localeCompare(b.label);
            })
          );
          // console.log(listOfEmployees[i], `added ${i}`);
        } else {
          // console.log(listOfEmployees[i], `not added ${i}`);
          for (let k = 0; k < selectedEmployees.length; k++) {
            if (listOfEmployees[i].value === selectedEmployees[k].value) {
              const uniqueNames = Array.from(new Set([...employeePool, listOfEmployees[i]]));
              setEmployeePool(
                uniqueNames.sort(function (a, b) {
                  return a.label.localeCompare(b.label);
                })
              );
            } else {
              //do nothing
            }
          }
        }
      }
    }
    console.log(employeePool);
  };

  const CheckForDuplicate = () => {
    console.log(selectedEmployees);
    console.log(selectedAuxiliaryEmployees);
    for (let i = 0; i < selectedEmployees.length; i++) {
      for (let j = 0; j < selectedAuxiliaryEmployees.length; j++) {
        if (selectedEmployees[i].value === selectedAuxiliaryEmployees[j].value) {
          setIsDuplicatedNominee(true);
        } else {
          setIsDuplicatedNominee(false);
        }
      }
    }
  };

  useEffect(() => {
    setNominatedEmployees(selectedEmployees);
    setAuxiliaryEmployees(selectedAuxiliaryEmployees);
    CheckForDuplicate();
  }, [selectedEmployees, selectedAuxiliaryEmployees]);

  useEffect(() => {
    setEmployeePool(
      listOfEmployees.sort(function (a, b) {
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

                <div className="w-auto sm:w-96 flex flex-wrap text-slate-500 text-md font-medium">
                  {recommendedEmployees.map((employee, index) => {
                    return <label key={index}>{index == 0 ? employee.name : `, ${employee.name}`}</label>;
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
                  onChange={(o) => setParticipant(o)}
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
                  onChange={(o) => setAuxParticipant(o)}
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
