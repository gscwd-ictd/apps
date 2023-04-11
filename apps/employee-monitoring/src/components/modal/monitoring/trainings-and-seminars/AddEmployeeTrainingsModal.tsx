/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { DataTableHrms, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { useEmployeeStore } from 'apps/employee-monitoring/src/store/employee.store';
import fetcherHRIS from 'apps/employee-monitoring/src/utils/fetcher/FetcherHRIS';
import {
  EmployeeAsOption,
  EmployeeProfile,
} from 'libs/utils/src/lib/types/employee.type';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import useSWR from 'swr';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { createColumnHelper } from '@tanstack/react-table';
import { Training } from 'libs/utils/src/lib/types/training.type';
import { useTrainingsStore } from 'apps/employee-monitoring/src/store/training.store';

interface SelectOption {
  readonly label: string;
  readonly value: string;
}

type AddEmpTrainingsModalProps = {
  rowData: Training; // training id
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const AddEmpTrainingsModal: FunctionComponent<AddEmpTrainingsModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  const [unassignedEmployees, setUnassignedEmployees] = useState<
    Array<SelectOption>
  >([]);
  //   const [assignedEmployees, setAssignedEmployees] = useState<Array<string>>([]);
  const [isAssigned, setIsAssigned] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<EmployeeAsOption>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<readonly SelectOption[] | null>();

  const {
    assignedEmployees,
    employeeIdsForRemove,
    setAssignedEmployees,
    setEmployeeIdsForRemove,
  } = useTrainingsStore((state) => ({
    assignedEmployees: state.assignedEmployees,
    setAssignedEmployees: state.setAssignedEmployees,
    employeeIdsForRemove: state.employeeIdsForRemove,
    setEmployeeIdsForRemove: state.setEmployeeIdsForRemove,
  }));

  const getArrayOfIds = (employees: readonly SelectOption[]) => {
    const ids = employees.map((employee: SelectOption) => {
      return employee.value;
    });
    return ids;
  };

  // use swr function
  const {
    data: swrEmployees,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutateEmployees,
  } = useSWR('/employees', fetcherHRIS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // use employee store
  const {
    GetEmployeeAsOptions,
    GetEmployeeAsOptionsFail,
    GetEmployeeAsOptionsSuccess,
  } = useEmployeeStore((state) => ({
    GetEmployeeAsOptions: state.getEmployeeAsOptions,
    GetEmployeeAsOptionsSuccess: state.getEmployeeAsOptionsSuccess,
    GetEmployeeAsOptionsFail: state.getEmployeeAsOptionsFail,
  }));

  // mutate
  const mutateEmployeeFromFetch = (employees: Array<EmployeeProfile>) => {
    const newEmployees = employees.map((employee: EmployeeProfile) => {
      return {
        value: employee.employmentDetails.employeeId,
        label: employee.personalDetails.fullName,
      };
    });
    setUnassignedEmployees(newEmployees);
  };

  // on change checkbox
  const onChangeCheckBox = (rowData: EmployeeAsOption, e: boolean) => {
    // if (e) {
    //   // setEmployeeIdsForRemove([...employeeIdsForRemove, rowData.employeeId]);
    //   setEmployeeIdsForRemove(rowData.employeeId);
    //   console.log(e);
    //   // setEmployeeIdsForRemove()
    // } else {
    //   console.log(e);
    //   //   setEmployeeIdsForRemove([
    //   //     ...employeeIdsForRemove.filter((id) => id !== rowData.employeeId),
    //   //   ]);
    // }
    setEmployeeIdsForRemove(rowData.employeeId);
  };

  // mutate the assigned employees
  const getFilteredAssignedEmployees = (employeeIds: string[]) => {
    const finalEmployeeIds = employeeIds.map((employeeId) => {
      const filteredEmployees = unassignedEmployees.find(
        (filteredEmployee) => filteredEmployee.value === employeeId
      );
      return {
        employeeId: filteredEmployees.value,
        fullName: filteredEmployees.label,
      };
    });
    return finalEmployeeIds;
  };

  // define table columns
  const columnHelper = createColumnHelper<EmployeeAsOption>();
  const columns = [
    columnHelper.accessor('employeeId', { cell: (info) => info.getValue() }),
    columnHelper.display({
      header: () => '',
      id: 'deleteCheckbox',
      cell: (props) => renderRowActions(props.row.original),
    }),
    columnHelper.accessor('fullName', {
      enableColumnFilter: false,
      enableSorting: false,
      header: () => 'Full Name',
    }),
  ];

  // render row actions in the table component
  const renderRowActions = (employeeData: EmployeeAsOption) => {
    return (
      <>
        <input
          type="checkbox"
          className="text-red-400 rounded focus:ring-red-500 focus:outline-none"
          checked={true}
          onChange={(e) => onChangeCheckBox(employeeData, e.target.checked)}
        />
      </>
    );
  };

  const columnVisibility = { employeeId: false };

  // use effect for swr loading
  useEffect(() => {
    if (swrIsLoading) {
      GetEmployeeAsOptions();
    }
  }, [swrIsLoading]);

  // use effect for swr success or error
  useEffect(() => {
    if (!isEmpty(swrEmployees)) {
      GetEmployeeAsOptionsSuccess(swrEmployees.data);
      mutateEmployeeFromFetch(swrEmployees.data);
    }

    if (!isEmpty(swrError)) {
      GetEmployeeAsOptionsFail(swrError);
    }
  }, [swrEmployees, swrError]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="lg" steady>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full px-2">
            <span className="text-2xl text-gray-600">
              Assign Employees to {rowData.name}
            </span>
            <button
              className="w-[1.5rem] h-[1.5rem] items-center text-center text-white bg-gray-400 rounded"
              type="button"
              onClick={closeModalAction}
            >
              x
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="min-h-[20rem] px-2 flex flex-col">
            {swrIsLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <>
                <div className="flex items-center w-full gap-4">
                  <Select
                    isMulti
                    name="employees"
                    options={unassignedEmployees}
                    className="z-50 w-full basic-multi-select"
                    classNamePrefix="select2-selection"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                  <button
                    className="p-2 w-[5rem] text-sm text-white bg-blue-400 active:bg-blue-300 rounded"
                    onClick={() => {
                      setAssignedEmployees([
                        ...assignedEmployees,
                        ...getArrayOfIds(value),
                      ]);
                      setIsAssigned(true);
                      setValue(null);
                    }}
                  >
                    Assign
                  </button>
                </div>
                {!isAssigned ? (
                  <div className="flex items-center h-[22rem] justify-center flex-1 text-gray-600">
                    --No Assigned Employees--
                  </div>
                ) : (
                  <>
                    <div className="w-full mt-5">
                      <div className="flex flex-col w-full gap-5">
                        <DataTableHrms
                          data={getFilteredAssignedEmployees(assignedEmployees)}
                          columns={columns}
                          columnVisibility={columnVisibility}
                          paginate
                          // showGlobalFilter
                        />
                        <button
                          onClick={() => console.log(employeeIdsForRemove)}
                        >
                          LOG
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddEmpTrainingsModal;
