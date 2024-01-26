/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import {
  deleteEmpMonitoring,
  postEmpMonitoring,
} from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { CustomGroup } from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import { AlertNotification, DataTable, LoadingSpinner, Modal, useDataTable } from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { EmployeeAsOptionWithPosition } from 'libs/utils/src/lib/types/employee.type';
import { Card } from '../../../cards/Card';
import { Checkbox } from 'libs/oneui/src/components/Tables/DataTable';
import Select from 'react-select';
import { floatReactSelectOptionsStyles } from 'apps/employee-monitoring/styles/float-select-options';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: CustomGroup;
};

const MemberAssignmentModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const [selectedRows, setSelectedRows] = useState<Array<any>>([]);
  const [selectedOptions, setSelectedOptions] = useState<Array<any>>([]);

  // zustand store initialization
  const {
    LoadingAssignedMembers,
    LoadingUnassignedMembers,

    AssignedMembers,
    UnassignedMembers,
    AssignResponse,
    UnassignResponse,

    GetAssignedMembers,
    GetAssignedMembersSuccess,
    GetAssignedMembersFail,

    GetUnassignedMembers,
    GetUnassignedMembersSuccess,
    GetUnassignedMembersFail,

    LoadingMembers,
    ToAssignedMembers,
    ToUnassignedMembers,

    AssignMember,
    UnassignMember,

    PostMembers,
    PostMembersSuccess,
    PostMembersFail,

    DeleteMembers,
    DeleteMembersSuccess,
    DeleteMembersFail,

    SetIsRowSelected,
    SetIsOptionSelected,

    EmptyResponse,
  } = useCustomGroupStore((state) => ({
    LoadingAssignedMembers: state.loading.loadingAssignedMembers,
    LoadingUnassignedMembers: state.loading.loadingUnassignedMembers,

    AssignedMembers: state.assignedMembers,
    UnassignedMembers: state.unassignedMembers,
    AssignResponse: state.members.assignResponse,
    UnassignResponse: state.members.unassignResponse,

    GetAssignedMembers: state.getAssignedMembers,
    GetAssignedMembersSuccess: state.getAssignedMembersSuccess,
    GetAssignedMembersFail: state.getAssignedMembersFail,

    GetUnassignedMembers: state.getUnassignedMembers,
    GetUnassignedMembersSuccess: state.getUnassignedMembersSuccess,
    GetUnassignedMembersFail: state.getUnassignedMembersFail,

    LoadingMembers: state.loading.loadingMembers,
    ToAssignedMembers: state.toAssignMembers,
    ToUnassignedMembers: state.toUnassignMembers,

    AssignMember: state.assignMember,
    UnassignMember: state.unassignMember,

    PostMembers: state.postMembers,
    PostMembersSuccess: state.postMembersSuccess,
    PostMembersFail: state.postMembersFail,

    DeleteMembers: state.deleteMembers,
    DeleteMembersSuccess: state.deleteMembersSuccess,
    DeleteMembersFail: state.deleteMembersFail,

    SetIsRowSelected: state.setIsRowSelected,
    SetIsOptionSelected: state.setIsOptionSelected,

    EmptyResponse: state.emptyResponse,
  }));

  // useSWR for assigned employees
  const {
    data: swrAssignedEmployees,
    isLoading: swrAssignedEmployeesIsLoading,
    error: swrAssignedEmployeesError,
    mutate: mutateAssignedMembers,
  } = useSWR(modalState ? `/custom-groups/${rowData.id}/assigned` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // useSWR for unassigned employees
  const {
    data: swrUnassignedEmployees,
    isLoading: swrUnassignedEmployeesIsLoading,
    error: swrUnassignedEmployeesError,
    mutate: mutateUnassignedMembers,
  } = useSWR(modalState ? `/custom-groups/${rowData.id}/unassigned/dropdown/rank-file` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Render checkbox in the table component
  const renderCheckBox = (row: any) => {
    return (
      <div className="px-1">
        <Checkbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    );
  };

  // Define table columns
  const columnHelper = createColumnHelper<EmployeeAsOptionWithPosition>();
  const columns = [
    columnHelper.accessor('employeeId', {
      id: 'select',
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          {...{
            checked: table.getIsAllRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => renderCheckBox(row),
    }),
    columnHelper.accessor('employeeId', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('companyId', {
      header: 'Company ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('fullName', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('positionTitle', {
      header: 'Position',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('assignment', {
      header: 'Assignment',
      cell: (info) => info.getValue(),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: AssignedMembers,
    enableRowSelection: true,
    columnVisibility: { employeeId: false, assignment: false },
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrAssignedEmployeesIsLoading) {
      GetAssignedMembers();
    }
  }, [swrAssignedEmployeesIsLoading]);

  // Initial zustand state update
  useEffect(() => {
    if (swrUnassignedEmployeesIsLoading) {
      GetUnassignedMembers();
    }
  }, [swrUnassignedEmployeesIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrAssignedEmployees)) {
      GetAssignedMembersSuccess(swrAssignedEmployees.data);
    }

    if (!isEmpty(swrAssignedEmployeesError)) {
      GetAssignedMembersFail(swrAssignedEmployeesError.message);
    }
  }, [swrAssignedEmployees, swrAssignedEmployeesError]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrUnassignedEmployees)) {
      GetUnassignedMembersSuccess(swrUnassignedEmployees.data);
    }

    if (!isEmpty(swrUnassignedEmployeesError)) {
      GetUnassignedMembersFail(swrUnassignedEmployeesError.message);
    }
  }, [swrUnassignedEmployees, swrUnassignedEmployeesError]);

  /*
    ASSIGN MEMBERS
  */
  // Every time the options in the select component changes, update the ToAssignedMembers state in store
  const handleMultiSelect = (selectedMulti: Array<any>) => {
    const employeeIds = [];
    selectedMulti.map((option) => {
      const employeeId = option.value.employeeId;
      employeeIds.push(employeeId);
    });

    AssignMember(employeeIds);
    setSelectedOptions(selectedMulti);
  };

  // Assign employees from custom group
  const handleAssignMembers = () => {
    if (ToAssignedMembers.length <= 0) {
      SetIsOptionSelected(false);
    } else {
      SetIsOptionSelected(true);

      PostMembers();

      handleAssignMembersResult(ToAssignedMembers);
    }
  };

  // Async request to unassign members in the group
  const handleAssignMembersResult = async (ToAssignedMembers: Array<string>) => {
    const bodyRequest = {
      customGroupId: rowData.id,
      employeeIds: ToAssignedMembers,
    };

    const { error, result } = await postEmpMonitoring(`custom-groups/members`, bodyRequest);

    if (error) {
      PostMembersFail(result);
    } else {
      PostMembersSuccess(result);
    }
  };

  /*
    UNASSIGN MEMBERS
  */
  // Unassign employees from custom group
  const handleUnassignMembers = () => {
    if (table.getSelectedRowModel().flatRows.length <= 0) {
      SetIsRowSelected(false);
    } else {
      SetIsRowSelected(true);
      setSelectedRows(table.getSelectedRowModel().flatRows);
    }
  };

  // Transfer to zustand state the employeeId's
  useEffect(() => {
    if (selectedRows.length > 0) {
      selectedRows.map((employee) => {
        UnassignMember(employee.original.employeeId);
      });
    }
  }, [selectedRows]);

  // If the zustand state for unassigned members has been filled, execute the async request
  useEffect(() => {
    if (ToUnassignedMembers.length > 0) {
      DeleteMembers();

      handleUnassignMembersResult(ToUnassignedMembers);
    }
  }, [ToUnassignedMembers]);

  // Async request to unassign members in the group
  const handleUnassignMembersResult = async (ToUnassignedMembers: Array<string>) => {
    const bodyRequest = {
      data: {
        customGroupId: rowData.id,
        employeeIds: ToUnassignedMembers,
      },
    };

    const { error, result } = await deleteEmpMonitoring(`custom-groups/members`, bodyRequest);

    if (error) {
      DeleteMembersFail(result);
    } else {
      DeleteMembersSuccess(result);
    }
  };

  // Reset responses from all modal actions
  useEffect(() => {
    if (!isEmpty(AssignResponse) || !isEmpty(UnassignResponse)) {
      mutateAssignedMembers();
      mutateUnassignedMembers();

      // Clear selected options in select input
      setSelectedOptions([]);

      // Clear selected rows in table
      table.resetRowSelection();

      setTimeout(() => {
        EmptyResponse();
      }, 5000);
    }
  }, [AssignResponse, UnassignResponse]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="lg">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">{rowData.name}</span>
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
          <div>
            {/* Notifications */}
            {LoadingMembers ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={true}
              />
            ) : null}

            <div className="mx-5">
              <Card>
                {LoadingAssignedMembers ? (
                  <div className="flex justify-center order-3 w-full mt-2">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : (
                  <div className="flex flex-row flex-wrap">
                    <div className="flex justify-end order-2 w-1/2 table-actions-wrapper">
                      <Select
                        id="customReactSelectEmployees"
                        name="employees"
                        options={UnassignedMembers}
                        className="z-50 w-2/3 text-xs font-normal basic-multi-select"
                        classNamePrefix="select2-selection"
                        onChange={(e: Array<any>) => {
                          handleMultiSelect(e);
                        }}
                        value={selectedOptions}
                        isMulti
                        menuPosition={'fixed'}
                        styles={floatReactSelectOptionsStyles}
                        isLoading={LoadingUnassignedMembers ? true : false}
                      />

                      <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 ml-2 text-center inline-flex items-center dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                        onClick={handleAssignMembers}
                      >
                        <i className="bx bxs-plus-square"></i>&nbsp; Assign
                      </button>
                    </div>

                    <DataTable model={table} showGlobalFilter={true} showColumnFilter={false} paginate={false} />

                    <div className="flex justify-start order-last mt-4">
                      <button
                        type="button"
                        className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-red-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-600"
                        onClick={handleUnassignMembers}
                      >
                        <i className="bx bx-trash"></i>&nbsp; Unassign Employees
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MemberAssignmentModal;
