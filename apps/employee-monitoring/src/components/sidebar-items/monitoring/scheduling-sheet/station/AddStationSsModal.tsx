import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import {
  ScheduleSheet,
  useScheduleSheetStore,
} from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import SelectStationSchedSsModal from './SelectStationSchedSsModal';
import RadioGroup from 'apps/employee-monitoring/src/components/radio/RadioGroup';
import { RadioButtonRF } from 'apps/employee-monitoring/src/components/radio/RadioButtonRF';
import { useForm } from 'react-hook-form';
import SelectStationGroupSsModal from './SelectStationGroupSsModal';

type AddStationGsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type ScheduleSheetForm = ScheduleSheet & {
  employees: Array<any>;
};

const AddStationSsModal: FunctionComponent<AddStationGsModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // react hook form
  const {
    watch,
    getValues,
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleSheetForm>({
    defaultValues: {
      id: '',
      scheduleId: '',
      employees: [],
      scheduleName: '',
      scheduleSheetDateFrom: '',
      scheduleSheetDateTo: '',
      scheduleSheetRefName: '',
    },
  });

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  const [selectGroupModalIsOpen, setSelectGroupModalIsOpen] =
    useState<boolean>(false);

  // open select group modal
  const openSelectGroupModal = () => setSelectGroupModalIsOpen(true);

  // close select group modal
  const closeSelectGroupModal = () => {
    setSelectGroupModalIsOpen(false);
  };

  const [selectScheduleModalIsOpen, setSelectScheduleModalIsopen] =
    useState<boolean>(false);

  // open select schedule modal
  const openSelectScheduleModal = () => setSelectScheduleModalIsopen(true);

  // close select schedule modal
  const closeSelectScheduleModal = () => {
    setSelectScheduleModalIsopen(false);
  };

  // schedule sheet store
  const {
    schedule,
    selectedScheduleId,
    getScheduleById,
    getScheduleByIdFail,
    getScheduleByIdSuccess,
  } = useScheduleSheetStore((state) => ({
    schedule: state.schedule,
    selectedScheduleId: state.selectedScheduleId,
    getScheduleById: state.getScheduleById,
    getScheduleByIdSuccess: state.getScheduleByIdSuccess,
    getScheduleByIdFail: state.getScheduleByIdFail,
  }));

  // use SWR
  const {
    data: swrSchedule,
    isLoading: swrScheduleIsLoading,
    error: swrScheduleError,
  } = useSWR(
    !isEmpty(selectedScheduleId) ? `/schedules/${selectedScheduleId}` : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // on submit
  const onSubmit = (data: ScheduleSheetForm) => {
    console.log(data);
  };

  // set loading to true
  useEffect(() => {
    getScheduleById();
  }, [selectedScheduleId]);

  // set the schedule
  useEffect(() => {
    // success
    if (!isEmpty(swrSchedule)) getScheduleByIdSuccess(swrSchedule.data);

    // fail
    if (!isEmpty(swrScheduleError))
      getScheduleByIdFail(swrScheduleError.message);
  }, [swrSchedule, swrScheduleError]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="lg" steady>
        <Modal.Header>
          <h1 className="text-2xl font-medium">Add Station Scheduling Sheet</h1>
        </Modal.Header>
        <Modal.Body>
          <>
            <SelectStationGroupSsModal
              modalState={selectGroupModalIsOpen}
              setModalState={setSelectGroupModalIsOpen}
              closeModalAction={closeSelectGroupModal}
            />

            <SelectStationSchedSsModal
              modalState={selectScheduleModalIsOpen}
              setModalState={setSelectScheduleModalIsopen}
              closeModalAction={closeSelectScheduleModal}
            />
            <form id="addStationSsForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex w-full grid-cols-2 grid-rows-2 gap-2">
                {/* Effectivity */}
                <section className="flex flex-col w-full min-h-[15rem] p-2 gap-2 bg-gray-200/50 border border-dashed rounded">
                  <div className="flex flex-col justify-center w-full ">
                    <p className="flex justify-center w-full font-semibold">
                      Effectivity Date
                    </p>
                    <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                      <LabelInput
                        id="stationSsStartDate"
                        name="dateFrom"
                        type="date"
                        label="Start Date"
                        controller={{ ...register('scheduleSheetDateFrom') }}
                        isError={errors.scheduleSheetDateFrom ? true : false}
                        errorMessage={errors.scheduleSheetDateFrom?.message}
                      />
                      <LabelInput
                        id="stationSsEndDate"
                        name="dateTo"
                        type="date"
                        label="End Date"
                        controller={{ ...register('scheduleSheetDateTo') }}
                        isError={errors.scheduleSheetDateTo ? true : false}
                        errorMessage={errors.scheduleSheetDateTo?.message}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center w-full ">
                    <p className="flex justify-center w-full font-semibold">
                      Group
                    </p>
                    <LabelInput
                      id="stationGroupName"
                      name="groupName"
                      type="text"
                      label="Group Name"
                      controller={{ ...register('scheduleSheetRefName') }}
                      isError={errors.scheduleSheetDateFrom ? true : false}
                      errorMessage={errors.scheduleSheetDateFrom?.message}
                      disabled
                    />
                  </div>

                  <div className="flex items-end h-full gap-2">
                    <button
                      className="w-full px-2 py-2 text-white bg-red-500 rounded hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={openSelectGroupModal}
                      type="button"
                    >
                      <span className="text-xs ">Select Group</span>
                    </button>
                  </div>
                </section>

                {/* Schedule */}
                <section className="flex flex-col w-full min-h-[15rem] p-2 gap-2 bg-gray-200/50 border rounded">
                  <div className="flex flex-col justify-center w-full">
                    <p className="flex items-center justify-center w-full font-semibold">
                      Station Schedule
                    </p>
                    <div className="flex flex-col w-full gap-2">
                      {swrScheduleIsLoading ? (
                        <LoadingSpinner size="lg" />
                      ) : (
                        <>
                          <LabelInput
                            id="scheduleName"
                            label="Name"
                            value={schedule.name ?? '--'}
                            disabled
                          />
                          <div className="gap-2 border sm:flex-col md:flex-col lg:flex-row lg:flex">
                            <div className="sm:w-full md:w-full lg:w-[50%]">
                              <LabelInput
                                id="scheduleTimeIn"
                                label="Time in"
                                value={
                                  schedule.timeIn
                                    ? formatTime(schedule.timeIn)
                                    : '-- : --'
                                }
                                disabled
                              />
                            </div>

                            <div className="sm:w-full md:w-full lg:w-[50%]">
                              <LabelInput
                                id="scheduleTimeOut"
                                label="Time out"
                                value={
                                  schedule.timeOut
                                    ? formatTime(schedule.timeOut)
                                    : '-- : --'
                                }
                                disabled
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end h-full gap-2">
                    <button
                      className="w-full px-2 py-2 text-white bg-red-500 rounded hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={openSelectScheduleModal}
                      type="button"
                    >
                      <span className="text-xs ">Select Schedule</span>
                    </button>
                  </div>
                </section>
              </div>
            </form>
          </>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 py-2 text-gray-700 bg-gray-200 rounded text-md hover:bg-gray-300"
              onClick={closeModalAction}
            >
              Cancel
            </button>

            <button
              className="px-3 py-2 text-white bg-blue-500 rounded text-md disabled:cursor-not-allowed hover:bg-blue-400"
              type="submit"
              form="addStationSsForm"
            >
              Submit
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddStationSsModal;
