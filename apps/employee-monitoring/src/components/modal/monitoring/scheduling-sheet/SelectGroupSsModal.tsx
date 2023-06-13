/* eslint-disable @nx/enforce-module-boundaries */
import {
  DataTable,
  LoadingSpinner,
  Modal,
  useDataTable,
} from '@gscwd-apps/oneui';
import { createColumnHelper } from '@tanstack/react-table';
import { LabelValue } from 'apps/employee-monitoring/src/components/labels/LabelValue';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import {
  CustomGroup,
  CustomGroupWithMembers,
} from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import dayjs from 'dayjs';
import { EmployeeAsOptionWithPosition } from 'libs/utils/src/lib/types/employee.type';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { isEmpty } from 'lodash';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Select from 'react-select';
import useSWR from 'swr';

type SelectGroupSsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const SelectGroupSsModal: FunctionComponent<SelectGroupSsModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // use schedule sheet store
  const {
    selectedGroupId,
    currentScheduleSheet,
    setSelectedGroupId,
    setCurrentScheduleSheet,
  } = useScheduleSheetStore((state) => ({
    currentScheduleSheet: state.currentScheduleSheet,
    selectedGroupId: state.selectedGroupId,
    setSelectedGroupId: state.setSelectedGroupId,
    setCurrentScheduleSheet: state.setCurrentScheduleSheet,
  }));

  // use custom groups store
  const {
    groups,
    groupWithMembers,
    emptyResponse,
    getCustomGroups,
    getCustomGroupsFail,
    getCustomGroupsSuccess,
    getCustomGroupWithMembers,
    getCustomGroupWithMembersFail,
    getCustomGroupWithMembersSuccess,
    setSelectedCustomGroupWithMembers,
  } = useCustomGroupStore((state) => ({
    groups: state.customGroups,
    groupWithMembers: state.customGroupWithMembers,

    setSelectedCustomGroupWithMembers: state.setSelectedCustomGroupWithMembers,
    getCustomGroups: state.getCustomGroups,
    getCustomGroupsSuccess: state.getCustomGroupsSuccess,
    getCustomGroupsFail: state.getCustomGroupsFail,
    getCustomGroupWithMembers: state.getCustomGroupWithMembers,
    getCustomGroupWithMembersSuccess: state.getCustomGroupWithMembersSuccess,
    getCustomGroupWithMembersFail: state.getCustomGroupWithMembersFail,
    emptyResponse: state.emptyResponse,
  }));

  // local state for the selected group with members component
  //
  const [selectedGroup, setSelectedGroup] = useState<SelectOption>({
    label: '',
    value: '',
  } as SelectOption);

  // conditional fetch
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);

  // local state for the selected group id
  const [localSelectedGroupId, setLocalSelectedGroupId] =
    useState<string>(selectedGroupId);

  // transformed groups
  const [transformedGroups, setTransformedGroups] = useState<
    Array<SelectOption>
  >([]);

  // use SWR for all groups
  const {
    data: swrGroups,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR('/custom-groups', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // use SWR for all groups
  const {
    data: swrGroupDetails,
    isLoading: swrGroupDetailsIsLoading,
    error: swrGroupDetailsError,
  } = useSWR(
    shouldFetch ? `/custom-groups/${localSelectedGroupId}` : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // transform
  const transformGroups = (groups: Array<CustomGroup>) => {
    const mutatedSelectOptionGroups = groups.map((group) => {
      return {
        label: group.name,
        value: group.id,
      };
    });
    setTransformedGroups(mutatedSelectOptionGroups);
  };

  // on submit
  const onSubmit = () => {
    // sets the store group id based on locally submitted group based on group id
    setSelectedGroupId(localSelectedGroupId);

    // map the selected group and assign an empty array to rest days
    const membersWithRestDays = groupWithMembers.members.map((member) => {
      return { ...member, restDays: [] };
    });
    setCurrentScheduleSheet({
      ...currentScheduleSheet,
      employees: membersWithRestDays,
    });

    // assign the selected custom group with members on submit only
    setSelectedCustomGroupWithMembers({
      customGroupDetails: groupWithMembers.customGroupDetails,
      members: membersWithRestDays,
    });

    // close the modal
    closeModalAction();
  };

  // on cancel
  const onCancel = () => {
    closeModalAction();
  };

  // Define table columns
  const columnHelper = createColumnHelper<EmployeeAsOptionWithPosition>();
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
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: groupWithMembers.members,
    columnVisibility: { employeeId: false },
  });

  // swr loading
  useEffect(() => {
    if (swrIsLoading && modalState) {
      getCustomGroups();
    }
  }, [modalState, swrIsLoading]);

  // swr loading for the custom group details
  useEffect(() => {
    if (swrGroupDetailsIsLoading) {
      //
    }
  }, [swrGroupDetailsIsLoading]);

  // swr success or error
  useEffect(() => {
    // if data
    if (!isEmpty(swrGroups)) {
      getCustomGroupsSuccess(swrGroups.data);
    }

    // if error
    if (!isEmpty(swrError)) {
      getCustomGroupsFail(swrError.message);
    }
  }, [swrGroups, swrError]);

  // transform/mutate group
  useEffect(() => {
    if (!isEmpty(groups)) {
      transformGroups(groups);
    }
  }, [groups]);

  // fetch by id
  useEffect(() => {
    if (swrGroupDetailsIsLoading && !isEmpty(localSelectedGroupId)) {
      getCustomGroupWithMembers();
    }
  }, [localSelectedGroupId, swrGroupDetailsIsLoading]);

  // fetch group success or fail
  useEffect(() => {
    if (!isEmpty(localSelectedGroupId)) {
      if (!isEmpty(swrGroupDetails)) {
        getCustomGroupWithMembersSuccess(swrGroupDetails.data);
      }

      if (!isEmpty(swrGroupDetailsError))
        getCustomGroupWithMembersFail(swrGroupDetailsError.message);
    }
  }, [swrGroupDetails, localSelectedGroupId, swrGroupDetailsError]);

  // on open modal
  useEffect(() => {
    if (modalState) setLocalSelectedGroupId(selectedGroupId);
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header>
          <h1 className="text-2xl font-medium">Select a Group</h1>
        </Modal.Header>
        <Modal.Body>
          <>
            <Select
              id="customReactGroups"
              name="groups"
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              options={transformedGroups ?? []}
              className="z-50 w-full basic-multi-select"
              classNamePrefix="select2-selection"
              value={selectedGroup}
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView
              onChange={(newValue) => {
                setShouldFetch(true);
                setSelectedGroup(newValue);
                setLocalSelectedGroupId(newValue.value.toString());
              }}
            />
            {!isEmpty(localSelectedGroupId) && !isEmpty(groupWithMembers) ? (
              <div className="px-2 py-4 mt-2 border border-dashed rounded bg-gray-100/50">
                <div className="grid grid-cols-2 grid-rows-3">
                  <LabelValue
                    label="Group Name: "
                    direction="left-to-right"
                    textSize="sm"
                    value={groupWithMembers.customGroupDetails.name}
                  />
                  <LabelValue
                    label="Description: "
                    direction="left-to-right"
                    textSize="sm"
                    value={groupWithMembers.customGroupDetails.description}
                  />
                </div>
                <DataTable
                  model={table}
                  paginate={!isEmpty(groupWithMembers.members) ? true : false}
                />
              </div>
            ) : (
              <div className="flex justify-center w-full mt-2 text-gray-400">
                --No selected group--
              </div>
            )}
          </>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <div className="flex gap-2">
              <button
                className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 text-sm text-white bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400"
                type="button"
                onClick={onSubmit}
                disabled={isEmpty(groupWithMembers.members) ? true : false}
              >
                Submit
              </button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SelectGroupSsModal;
