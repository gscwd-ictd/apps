/* eslint-disable @nx/enforce-module-boundaries */
import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { LabelValue } from 'apps/employee-monitoring/src/components/labels/LabelValue';
import { MutatedSsSelectOption, useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { UseCapitalizer } from 'apps/employee-monitoring/src/utils/functions/Capitalizer';
import dayjs from 'dayjs';
import { ScheduleShifts } from 'libs/utils/src/lib/enums/schedule.enum';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { isEmpty } from 'lodash';
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import Select from 'react-select';
import useSWR from 'swr';

type SelectSchedSsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const SelectFieldSchedSsModal: FunctionComponent<SelectSchedSsModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // use SWR
  const {
    data: swrSchedules,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(modalState ? '/schedules?base=Field' : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // use schedule sheet store
  const { selectedScheduleId, setSelectedScheduleId } = useScheduleSheetStore((state) => ({
    selectedScheduleId: state.selectedScheduleId,
    setSelectedScheduleId: state.setSelectedScheduleId,
  }));

  // on submit
  const onSubmit = () => {
    setSelectedScheduleId(selectedSchedule.value.toString());
    closeModalAction();
  };

  // on cancel
  const onCancel = () => {
    closeModalAction();
  };

  // state for the transformed schedules for rendering
  const [transformedScheds, setTransformedScheds] = useState<Array<MutatedSsSelectOption>>([]);

  // state value for the mutated component
  const [selectedSchedule, setSelectedSchedule] = useState<MutatedSsSelectOption>({
    label: '',
    lunchIn: '',
    lunchOut: '',
    shift: ScheduleShifts.DAY,
    timeIn: '',
    timeOut: '',
    value: '',
    withLunch: false,
  } as MutatedSsSelectOption);

  //  schedule store
  const { schedules, getSchedules, getSchedulesFail, getSchedulesSuccess } = useScheduleStore((state) => ({
    schedules: state.schedules,
    getSchedules: state.getSchedules,
    getSchedulesSuccess: state.getSchedulesSuccess,
    getSchedulesFail: state.getSchedulesFail,
  }));

  // transform schedules
  const transformSchedules = (schedules: Array<Schedule>) => {
    const tempScheds = schedules.map((schedule) => {
      return {
        label: schedule.name,
        value: schedule.id,
        timeIn: schedule.timeIn,
        lunchIn: schedule.lunchIn,
        lunchOut: schedule.lunchOut,
        timeOut: schedule.timeOut,
        shift: schedule.shift,
      };
    });

    setTransformedScheds(tempScheds);
  };

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  // swr loading
  useEffect(() => {
    if (swrIsLoading) {
      getSchedules();
    }
  }, [modalState, swrIsLoading]);

  // swr success or error
  useEffect(() => {
    // if data
    if (!isEmpty(swrSchedules)) {
      getSchedulesSuccess(swrSchedules.data);
    }

    // if error
    if (!isEmpty(swrError)) {
      getSchedulesFail(swrError.message);
    }
  }, [swrSchedules, swrError]);

  // if schedules is fetched, mutate it to be used by the dropdown select component
  useEffect(() => {
    if (!isEmpty(schedules)) transformSchedules(schedules);
  }, [schedules]);

  // load the selected schedule by the provided id
  useEffect(() => {
    if (!isEmpty(transformedScheds) && !isEmpty(selectedScheduleId)) {
      const filtered = transformedScheds.filter((sched) => sched.value === selectedScheduleId);

      setSelectedSchedule(filtered[0]);
    }
  }, [selectedScheduleId, transformedScheds]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header>
          <h1 className="text-xl font-medium">Select a Field Schedule</h1>
        </Modal.Header>
        <Modal.Body>
          {transformedScheds ? (
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
              {!isEmpty(selectedSchedule.value) ? (
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
                      value={selectedSchedule.lunchIn ? formatTime(selectedSchedule.lunchIn) : 'N/A'}
                    />
                    <LabelValue
                      label="Lunch out: "
                      direction="left-to-right"
                      textSize="sm"
                      value={selectedSchedule.lunchOut ? formatTime(selectedSchedule.lunchOut) : 'N/A'}
                    />
                    <LabelValue
                      label="Shift: "
                      direction="left-to-right"
                      textSize="sm"
                      value={selectedSchedule.shift ? UseCapitalizer(selectedSchedule.shift) : null}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center w-full mt-2 text-gray-400">--No selected schedule--</div>
              )}
            </>
          ) : (
            <LoadingSpinner size="lg" />
          )}
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
                disabled={isEmpty(selectedSchedule.label) ? true : false}
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

export default SelectFieldSchedSsModal;
