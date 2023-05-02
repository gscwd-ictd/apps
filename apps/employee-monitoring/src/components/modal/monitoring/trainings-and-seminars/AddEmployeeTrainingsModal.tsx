/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  DataTable,
  LoadingSpinner,
  Modal,
  useDataTable,
} from '@gscwd-apps/oneui';
import { useEmployeeStore } from 'apps/employee-monitoring/src/store/employee.store';
import fetcherHRIS from 'apps/employee-monitoring/src/utils/fetcher/FetcherHRIS';
import {
  EmployeeAsOption,
  EmployeeProfile,
} from 'libs/utils/src/lib/types/employee.type';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import Select from 'react-select';
import { createColumnHelper } from '@tanstack/react-table';
import { Training } from 'libs/utils/src/lib/types/training.type';
import { useTrainingsStore } from 'apps/employee-monitoring/src/store/training.store';
import { info } from 'console';
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
  const [checked, setChecked] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<EmployeeAsOption>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<readonly SelectOption[] | null>();
  const checkbox = useRef<any>();

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

  // mutate select option element to employee as option
  const getArrayOfIds = (employees: readonly SelectOption[]) => {
    const employee = employees.map((employee: SelectOption) => {
      return { employeeId: employee.value, fullName: employee.label };
    });
    return employee;
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
    if (employees && employees.length > 0) {
      const newEmployees = employees.map((employee: EmployeeProfile) => {
        return {
          value: employee.employmentDetails.employeeId,
          label: employee.personalDetails.fullName,
        };
      });
      setUnassignedEmployees(newEmployees);
    }
  };

  const columnHelper = createColumnHelper<EmployeeAsOption>();
  const columns = [
    // columnHelper.accessor('employeeId', { cell: (info) => info.getValue() }),
    columnHelper.accessor('employeeId', {
      header: '',
      enableSorting: false,
      cell: (info) => (
        <input
          type="checkbox"
          checked={info.row.getIsSelected()}
          className="rounded"
          onChange={info.row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor('fullName', {
      enableColumnFilter: false,
      enableSorting: false,
      header: () => 'Full Name',
      cell: (props) => props.getValue(),
    }),
  ];

  const { table } = useDataTable({
    columns: columns,
    data: assignedEmployees,
    enableRowSelection: true,
  });

  useEffect(
    () =>
      console.log(
        table
          .getSelectedRowModel()
          .rows.map((selectedRow) => selectedRow.original.employeeId)
      ),
    [table.getState().rowSelection]
  );

  // define table columns

  const columnVisibility = { employeeId: false };

  // use data table

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
      <Modal open={modalState} setOpen={setModalState} size="md" steady>
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
          <div className="min-h-[30rem] px-2 flex flex-col">
            {swrIsLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <>
                <div className="flex items-center w-full gap-4">
                  <Select
                    id="customReactSelect"
                    isMulti
                    name="employees"
                    options={unassignedEmployees}
                    className="z-50 w-full basic-multi-select"
                    classNamePrefix="select2-selection"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                  <button
                    className="p-2 w-[5rem] text-xs text-white bg-blue-400 active:bg-blue-300 rounded"
                    onClick={() => {
                      setAssignedEmployees(getArrayOfIds(value));
                      setValue([]);
                    }}
                  >
                    Assign
                  </button>
                </div>
                {assignedEmployees.length > 0 ? (
                  <DataTable
                    model={table}
                    showGlobalFilter={false}
                    showColumnFilter={false}
                    paginate={true}
                  />
                ) : (
                  <div className="flex items-center h-[22rem] justify-center flex-1 text-gray-600">
                    --No Assigned Employees--
                  </div>
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
