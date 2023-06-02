/* eslint-disable @nx/enforce-module-boundaries */
import { Modal } from '@gscwd-apps/oneui';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { CustomGroupWithMembers } from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import dayjs from 'dayjs';
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

type SelectSchedSsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const SelectStationGroupSsModal: FunctionComponent<SelectSchedSsModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // use schedule sheet store
  const { selectedGroupId, setSelectedGroupId } = useScheduleSheetStore(
    (state) => ({
      selectedGroupId: state.selectedGroupId,
      setSelectedGroupId: state.setSelectedGroupId,
    })
  );

  // use custom groups store
  const {
    groups,
    groupWithMembers,
    getCustomGroups,
    getCustomGroupsFail,
    getCustomGroupsSuccess,
  } = useCustomGroupStore((state) => ({
    groups: state.customGroups,
    groupWithMembers: state.customGroupWithMembers,
    getCustomGroups: state.getCustomGroups,
    getCustomGroupsSuccess: state.getCustomGroupsSuccess,
    getCustomGroupsFail: state.getCustomGroupsFail,
  }));

  // local state for the selected group with members component
  const [selectedGroup, setSelectedGroup] =
    useState<CustomGroupWithMembers>(groupWithMembers);

  // local state for the selected group id
  const [localSelectedGroupId, setLocalSelectedGroupId] =
    useState<string>(selectedGroupId);

  // use SWR for all groups
  const {
    data: swrGroups,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR('/groups', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // use SWR for all groups
  const {
    data: swrGroupDetails,
    isLoading: swrGroupDetailsIsLoading,
    error: swrGroupDetailsError,
  } = useSWR(
    isEmpty(localSelectedGroupId) ? `/groups/${localSelectedGroupId}` : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // on submit
  const onSubmit = () => {
    // sets the store group id based on locally submitted group based on group id
    setSelectedGroupId(localSelectedGroupId);
    closeModalAction();
  };

  // on cancel
  const onCancel = () => {
    setSelectedGroupId('');
    closeModalAction();
  };

  // swr loading
  useEffect(() => {
    if (swrIsLoading) {
      getCustomGroups(true);
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
      getCustomGroupsSuccess(swrIsLoading, swrGroups.data);
    }

    // if error
    if (!isEmpty(swrError)) {
      getCustomGroupsFail(swrIsLoading, swrError.message);
    }
  }, [swrGroups, swrError]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header>
          <h1 className="text-2xl font-medium">Select a Group</h1>
        </Modal.Header>
        <Modal.Body>
          {/* {transformedScheds ? (
            <>
              <Select
                id="customReactSchedule"
                name="schedules"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                options={transformedScheds}
                className="z-50 w-full basic-multi-select"
                classNamePrefix="select2-selection"
                value={selectedSchedule}
                menuPosition="fixed"
                menuPlacement="auto"
                menuShouldScrollIntoView
                onChange={(newValue) => setSelectedSchedule(newValue)}
              />
              {!isEmpty(selectedSchedule) ? (
                <div className="px-2 py-4 mt-2 bg-gray-200 border rounded">
                  <div className="grid grid-cols-2 grid-rows-3">
                    <LabelValue
                      label="Time in: "
                      direction="left-to-right"
                      textSize="sm"
                      value={formatTime(selectedSchedule.timeIn)}
                    />
                    <LabelValue
                      label="Time out: "
                      direction="left-to-right"
                      textSize="sm"
                      value={formatTime(selectedSchedule.timeOut)}
                    />
                    <LabelValue
                      label="Lunch in: "
                      direction="left-to-right"
                      textSize="sm"
                      value={
                        selectedSchedule.lunchIn
                          ? formatTime(selectedSchedule.lunchIn)
                          : 'N/A'
                      }
                    />
                    <LabelValue
                      label="Lunch out: "
                      direction="left-to-right"
                      textSize="sm"
                      value={
                        selectedSchedule.lunchOut
                          ? formatTime(selectedSchedule.lunchOut)
                          : 'N/A'
                      }
                    />
                    <LabelValue
                      label="Shift: "
                      direction="left-to-right"
                      textSize="sm"
                      value={UseCapitalizer(selectedSchedule.shift)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center w-full mt-2 text-gray-400">
                  --No selected group--
                </div>
              )}
            </>
          ) : (
            <LoadingSpinner size="lg" />
          )} */}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <div className="flex gap-2">
              <button
                className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={closeModalAction}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 text-sm text-white bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400"
                type="button"
                onClick={onSubmit}
                // disabled={isEmpty(selectedSchedule) ? true : false}
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

export default SelectStationGroupSsModal;
