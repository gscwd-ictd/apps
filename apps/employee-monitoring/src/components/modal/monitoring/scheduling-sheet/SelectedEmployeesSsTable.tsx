import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, useDataTable } from '@gscwd-apps/oneui';
import Select from 'react-select';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

import {
  EmployeeAsOptionLabelWithPosition,
  EmployeeAsOptionWithRestDays,
} from 'libs/utils/src/lib/types/employee.type';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import SelectRdByNModal from './SelectRdByNModal';
import UseConvertRestDaysToString from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysToString';
import UseRenderRestDays from 'apps/employee-monitoring/src/utils/functions/RenderRestDays';
import { floatReactSelectOptionsStyles } from 'apps/employee-monitoring/styles/float-select-options';
import { MySelectList } from '../../../inputs/SelectList';
import { listOfRestDays } from 'libs/utils/src/lib/constants/rest-days.const';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import UseRestDaysOptionToNumberArray from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysOptionToNumberArray';

const SelectedEmployeesSsTable = () => {
  const [selectedOptions, setSelectedOptions] = useState<Array<any>>([]);
  const [isDateRangeFilled, setIsDateRangeFilled] = useState<boolean>(false);
  const [selectedRestDays, setSelectedRestDays] = useState<Array<SelectOption>>([]);
  const [freeUnassignedMembers, setFreeUnassignedMembers] = useState<Array<EmployeeAsOptionLabelWithPosition>>([]);

  const [currentRowData, setCurrentRowData] = useState<EmployeeAsOptionWithRestDays>(
    {} as EmployeeAsOptionWithRestDays
  );

  //  zustand initialization for schedule sheet
  const { currentScheduleSheet, setCurrentScheduleSheet, ToAssignEmployees, SetToAssignEmployees } =
    useScheduleSheetStore((state) => ({
      currentScheduleSheet: state.currentScheduleSheet,
      setCurrentScheduleSheet: state.setCurrentScheduleSheet,

      ToAssignEmployees: state.toAssignEmployees,
      SetToAssignEmployees: state.setToAssignEmployees,
    }));

  // zustand initialization for custom group
  const {
    LoadingUnassignedMembers,
    UnassignedMembers,

    GetUnassignedMembers,
    GetUnassignedMembersSuccess,
    GetUnassignedMembersFail,

    EmptyResponseCG,
  } = useCustomGroupStore((state) => ({
    LoadingUnassignedMembers: state.loading.loadingUnassignedMembers,
    UnassignedMembers: state.unassignedMembers,

    GetUnassignedMembers: state.getUnassignedMembers,
    GetUnassignedMembersSuccess: state.getUnassignedMembersSuccess,
    GetUnassignedMembersFail: state.getUnassignedMembersFail,

    EmptyResponseCG: state.emptyResponse,
  }));

  // useSWR for unassigned employees
  const {
    data: swrUnassignedEmployees,
    isLoading: swrUnassignedEmployeesIsLoading,
    error: swrUnassignedEmployeesError,
  } = useSWR(
    !isEmpty(currentScheduleSheet.customGroupId)
      ? `/custom-groups/${currentScheduleSheet.customGroupId}/unassigned/dropdown/job-order-cos`
      : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      //   revalidateOnMount: false,
      //   revalidateOnReconnect: false,
    }
  );

  const [restDaysModalIsOpen, setRestDaysModalIsOpen] = useState<boolean>(false);
  const openRestDaysModal = (rowData: EmployeeAsOptionWithRestDays) => {
    setRestDaysModalIsOpen(true);
    setCurrentRowData(rowData);
  };
  const closeRestDaysModal = () => {
    setRestDaysModalIsOpen(false);
  };

  /*
    ASSIGN MEMBERS
  */
  // Every time the options in the select component changes, update the ToAssignedMembers state in store
  const handleMultiSelect = (selectedMulti: Array<any>) => {
    const additionalEmployees = [];
    selectedMulti.map((option) => {
      const employee = {
        employeeId: option.value.employeeId,
        companyId: option.value.companyId,
        fullName: option.label,
        positionTitle: option.value.positionTitle,
        assignment: option.value.assignment,
        restDays: [],
      };
      additionalEmployees.push(employee);
    });

    SetToAssignEmployees(additionalEmployees);
    setSelectedOptions(selectedMulti);
  };

  // Assign employees from custom group
  const handleAssignMembers = () => {
    const currentEmployees = currentScheduleSheet.employees;
    const updatedEmployees = currentEmployees.concat(ToAssignEmployees);

    setCurrentScheduleSheet({
      ...currentScheduleSheet,
      employees: updatedEmployees,
    });
    setSelectedOptions([]);
  };

  // Remove employee to be scheduled
  const removeEmployee = (rowData: EmployeeAsOptionWithRestDays) => {
    const currentEmployees = currentScheduleSheet.employees;
    const updatedEmployees = currentEmployees.filter((employees) => employees.employeeId != rowData.employeeId);

    setCurrentScheduleSheet({
      ...currentScheduleSheet,
      employees: updatedEmployees,
    });
  };

  // Assign all employees in the current schedule sheet with rest days
  const handleAssignRestDays = () => {
    const membersWithAssignedRestDays = [
      ...currentScheduleSheet.employees.map((employee) => {
        employee.restDays = UseRestDaysOptionToNumberArray(selectedRestDays);

        return employee;
      }),
    ];

    setCurrentScheduleSheet({
      ...currentScheduleSheet,
      employees: membersWithAssignedRestDays,
    });
    setSelectedRestDays([]);
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: EmployeeAsOptionWithRestDays) => {
    return (
      <div className="text-center">
        <button
          type="button"
          className="text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
          onClick={() => openRestDaysModal(rowData)}
        >
          <i className="text-md bx bx-bed"></i>
        </button>

        {isEmpty(rowData.restDays) ? (
          <button
            type="button"
            className="text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
            onClick={() => removeEmployee(rowData)}
          >
            <i className="bx bx-trash-alt"></i>
          </button>
        ) : null}
      </div>
    );
  };

  // Define table columns
  const columnHelper = createColumnHelper<EmployeeAsOptionWithRestDays>();
  const columns = [
    columnHelper.accessor('employeeId', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('fullName', {
      header: 'Full Name',
      enableSorting: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('positionTitle', {
      header: 'Position Title',
      enableSorting: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('restDays', {
      header: 'Rest Days',
      enableSorting: false,
      cell: (info) => UseRenderRestDays(UseConvertRestDaysToString(info.getValue())),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="flex justify-center w-full">Edit</div>,
      enableColumnFilter: false,
      cell: (props) => renderRowActions(props.row.original),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: !isEmpty(currentScheduleSheet.employees) ? currentScheduleSheet.employees : [],
    columnVisibility: { employeeId: false },
  });

  // listens to date from and date to, if both are filled-out then set the state to true
  useEffect(() => {
    if (!isEmpty(currentScheduleSheet.dtrDates?.dateFrom) && !isEmpty(currentScheduleSheet.dtrDates?.dateTo)) {
      setIsDateRangeFilled(true);
    }
  }, [currentScheduleSheet.dtrDates?.dateFrom, currentScheduleSheet.dtrDates?.dateTo]);

  // Initial zustand state update
  useEffect(() => {
    if (swrUnassignedEmployeesIsLoading) {
      GetUnassignedMembers();
    }
  }, [swrUnassignedEmployeesIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrUnassignedEmployees)) {
      GetUnassignedMembersSuccess(swrUnassignedEmployees.data);
    }

    if (!isEmpty(swrUnassignedEmployeesError)) {
      GetUnassignedMembersFail(swrUnassignedEmployeesError.message);
    }
  }, [swrUnassignedEmployees, swrUnassignedEmployeesError]);

  // Remove JO employee if assigned to the current list
  useEffect(() => {
    if (!isEmpty(UnassignedMembers) && !isEmpty(currentScheduleSheet?.employees)) {
      const currentEmployees = currentScheduleSheet.employees;
      const currentEmployeesIds = new Set(currentEmployees.map((ce) => ce.employeeId));

      const unassignedEmployeesFiltered = UnassignedMembers.filter(
        (um) => !currentEmployeesIds.has(um.value?.employeeId)
      );

      setFreeUnassignedMembers(unassignedEmployeesFiltered);
    }
  }, [UnassignedMembers, currentScheduleSheet]);

  return (
    <>
      {currentScheduleSheet && isDateRangeFilled && !isEmpty(currentScheduleSheet.customGroupId) ? (
        <>
          <SelectRdByNModal
            modalState={restDaysModalIsOpen}
            setModalState={setRestDaysModalIsOpen}
            closeModalAction={closeRestDaysModal}
            rowData={currentRowData}
          />

          {/* <hr className="mt-2 border border-dashed rounded " /> */}

          <p className="flex items-center justify-start w-full px-5 font-light">Employees</p>
          <hr className="h-1 mt-2 mb-5 bg-gray-200 border-0 rounded" />

          <div className="flex flex-row flex-wrap">
            {/* flex-col justify-items-end  */}
            <div className="grid grid-cols-2 gap-4 order-2 w-full table-actions-wrapper">
              {/* Rest days dropdown input */}
              <div className="grid grid-cols-3 gap-2">
                <MySelectList
                  id="scheduleRestDays"
                  multiple
                  options={listOfRestDays}
                  onChange={(o) => setSelectedRestDays(o)}
                  value={selectedRestDays}
                  className="col-span-2"
                />

                <button
                  type="button"
                  className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-green-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600 col-span-1"
                  onClick={handleAssignRestDays}
                  disabled={isEmpty(selectedRestDays) ? true : false}
                >
                  <span className="w-full text-center">
                    <i className="bx bxs-plus-square"></i>&nbsp; Set Rest Days
                  </span>
                </button>
              </div>

              {/* Job order employees dropdown input */}
              <div className="grid grid-cols-3 gap-2">
                <Select
                  id="customReactSelectEmployees"
                  name="employees"
                  options={freeUnassignedMembers}
                  className="z-50 w-full text-xs font-normal basic-multi-select col-span-2"
                  classNamePrefix="select2-selection"
                  onChange={(e: Array<any>) => {
                    handleMultiSelect(e);
                  }}
                  value={selectedOptions}
                  isMulti
                  menuPosition={'fixed'}
                  styles={floatReactSelectOptionsStyles}
                  isLoading={LoadingUnassignedMembers ? true : false}
                  getOptionLabel={(option) => `${option.label} | ${option.value.assignment}`}
                />

                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600 disabled:cursor-not-allowed col-span-1"
                  onClick={handleAssignMembers}
                  disabled={isEmpty(selectedOptions) ? true : false}
                >
                  <span className="w-full text-center">
                    <i className="bx bxs-plus-square"></i>&nbsp; Assign JO
                  </span>
                </button>
              </div>
            </div>

            <DataTable model={table} paginate={!isEmpty(currentScheduleSheet.employees) ? true : false} />
          </div>
        </>
      ) : null}
    </>
  );
};

export default SelectedEmployeesSsTable;
