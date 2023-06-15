/* eslint-disable @next/next/no-img-element */
import { LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import {
  EmployeeWithSchedule,
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
import { useForm } from 'react-hook-form';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import SelectSchedModal from './SelectSchedModal';
import { MySelectList } from '../../../inputs/SelectList';
import { listOfRestDays } from 'libs/utils/src/lib/constants/rest-days.const';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import UseRestDaysOptionToNumberArray from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysOptionToNumberArray';

type AddEmpSchedModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  employeeData: any;
};

const AddEmpSchedModal: FunctionComponent<AddEmpSchedModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
  employeeData,
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
  } = useForm<EmployeeWithSchedule>();

  // on close sheet
  const onCloseScheduleSheet = () => {
    reset();
    setSelectedRestDays([]);
    setSelectedScheduleId('');
    closeModalAction();
  };

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  const [selectScheduleModalIsOpen, setSelectScheduleModalIsopen] =
    useState<boolean>(false);

  const [selectedRestDays, setSelectedRestDays] = useState<Array<SelectOption>>(
    []
  );

  // open select schedule modal
  const openSelectScheduleModal = () => setSelectScheduleModalIsopen(true);

  // close select schedule modal
  const closeSelectScheduleModal = () => {
    setSelectedRestDays([]);
    setSelectScheduleModalIsopen(false);
  };

  // schedule sheet store
  const {
    schedule,
    selectedScheduleId,
    getScheduleById,
    postScheduleSheet,
    getScheduleByIdFail,
    getEmployeeSchedules,
    postScheduleSheetFail,
    setSelectedScheduleId,
    getScheduleByIdSuccess,
    getEmployeeSchedulesFail,
    postScheduleSheetSuccess,
    getEmployeeSchedulesSuccess,
  } = useScheduleSheetStore((state) => ({
    schedule: state.schedule,
    selectedScheduleId: state.selectedScheduleId,
    setSelectedScheduleId: state.setSelectedScheduleId,
    getScheduleById: state.getScheduleById,
    getScheduleByIdSuccess: state.getScheduleByIdSuccess,
    getScheduleByIdFail: state.getScheduleByIdFail,
    postScheduleSheet: state.postScheduleSheet,
    postScheduleSheetSuccess: state.postScheduleSheetSuccess,
    postScheduleSheetFail: state.postScheduleSheetFail,
    getEmployeeSchedules: state.getEmployeeSchedules,
    getEmployeeSchedulesSuccess: state.getEmployeeSchedulesSuccess,
    getEmployeeSchedulesFail: state.getEmployeeSchedulesFail,
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
  const onSubmit = async (data: EmployeeWithSchedule) => {
    //append the restDays to employeewithschedule object
    data.restDays = UseRestDaysOptionToNumberArray(selectedRestDays);

    const {
      id,
      lunchIn,
      lunchOut,
      scheduleBase,
      scheduleType,
      scheduleName,
      shift,
      timeIn,
      timeOut,
      withLunch,
      ...rest
    } = data;
    console.log(rest);

    // call the function to start loading
    // postScheduleSheet();

    // call the post function
    // await handlePostScheduling(rest);
  };

  // function for posting the schedule sheet
  const handlePostScheduling = async (data: Partial<EmployeeWithSchedule>) => {
    const { error, result } = await postEmpMonitoring(
      '/employee-schedule/group',
      data
    );

    if (!error) {
      // post scheduling sheet success
      postScheduleSheetSuccess(result);

      // close the modal since it is a success
      onCloseScheduleSheet();
    } else if (error) {
      // post scheduling sheet fail
      postScheduleSheetFail(result);
    }
  };

  // set schedule id loading to true
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

  useEffect(() => {
    if (!isEmpty(schedule)) {
      setValue('scheduleId', schedule.id);
    }
  }, [schedule]);

  // watch
  useEffect(() => {
    // sched id
    if (!isEmpty(watch('scheduleId'))) {
      setValue('scheduleBase', schedule.scheduleBase);
      setValue('scheduleName', schedule.name);
      setValue('scheduleType', schedule.scheduleType);
      setValue('timeIn', schedule.timeIn);
    }
  }, [schedule]);

  // register then group id and schedule ids
  useEffect(() => {
    if (modalState) {
      register('scheduleId', { required: true });
      setValue('employeeId', employeeData.userId);
    }
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="md" steady>
        <Modal.Header>
          <h1 className="px-8 text-2xl font-medium">Add Employee Schedule</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="sm:px-0 md:px-0 lg:px-4">
            <SelectSchedModal
              modalState={selectScheduleModalIsOpen}
              setModalState={setSelectScheduleModalIsopen}
              closeModalAction={closeSelectScheduleModal}
            />
            <form id="addEmpSchedForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col w-full gap-2 px-5">
                <div className="flex items-center gap-4 px-2 pb-4">
                  <div className="flex items-center gap-4 px-2">
                    {employeeData.photoUrl ? (
                      <div className="flex flex-wrap justify-center">
                        <div className="w-[6rem]">
                          <img
                            src={employeeData.photoUrl}
                            alt="user-circle"
                            width={100}
                            height={100}
                            className="h-auto max-w-full align-middle border-none rounded-full shadow"
                          />
                        </div>
                      </div>
                    ) : (
                      <i className="text-gray-400 text-7xl bx bxs-user-circle"></i>
                    )}

                    <div className="flex flex-col">
                      <div className="text-2xl font-semibold text-gray-600">
                        {employeeData.fullName}
                      </div>
                      <div className="text-xl text-gray-500">
                        {employeeData.assignment.positionTitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Effectivity */}
                <div className="flex flex-col justify-center w-full pb-6">
                  <p className="flex items-center justify-start w-full font-light text-gray-400">
                    Effectivity Date
                  </p>
                  <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />
                  <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                    <LabelInput
                      id="stationSsStartDate"
                      name="dateFrom"
                      type="date"
                      label="Start Date"
                      controller={{
                        ...register('dateFrom'),
                      }}
                      isError={errors.dateFrom ? true : false}
                      errorMessage={errors.dateFrom?.message}
                    />
                    <LabelInput
                      id="stationSsEndDate"
                      name="dateTo"
                      type="date"
                      label="End Date"
                      controller={{
                        ...register('dateTo'),
                      }}
                      isError={errors.dateTo ? true : false}
                      errorMessage={errors.dateTo?.message}
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between w-full h-full pb-2">
                  <p className="flex items-center justify-start w-full font-light text-gray-400">
                    Schedule
                  </p>
                  <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />
                  <div className="flex flex-col w-full gap-2">
                    {swrScheduleIsLoading ? (
                      <LoadingSpinner size="lg" />
                    ) : (
                      <div className="flex flex-col gap-2 pt-1">
                        <LabelInput
                          id="scheduleName"
                          label="Name"
                          value={schedule.name ?? '--'}
                          isError={errors.scheduleId ? true : false}
                          errorMessage={errors.scheduleId?.message}
                          disabled
                        />
                        <div className="gap-2 sm:flex-col md:flex-col lg:flex-row lg:flex">
                          <div className="sm:w-full md:w-full lg:w-[50%] pb-2">
                            <LabelInput
                              id="scheduleTimeIn"
                              label="Time in"
                              controller={{
                                ...register('timeIn'),
                              }}
                              value={
                                schedule.timeIn
                                  ? formatTime(schedule.timeIn)
                                  : '-- : --'
                              }
                              isError={errors.scheduleId ? true : false}
                              errorMessage={errors.scheduleId?.message}
                              disabled
                            />
                          </div>

                          <div className="sm:w-full md:w-full lg:w-[50%] pb-2">
                            <LabelInput
                              id="scheduleTimeOut"
                              label="Time out"
                              value={
                                schedule.timeOut
                                  ? formatTime(schedule.timeOut)
                                  : '-- : --'
                              }
                              isError={errors.scheduleId ? true : false}
                              errorMessage={errors.scheduleId?.message}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="gap-2 sm:flex-col md:flex-col lg:flex-row lg:flex">
                          <div className="sm:w-full md:w-full lg:w-[50%] pb-2">
                            <LabelInput
                              id="scheduleLunchIn"
                              label="Lunch in"
                              value={
                                schedule.lunchIn
                                  ? formatTime(schedule.lunchIn)
                                  : '-- : --'
                              }
                              isError={errors.scheduleId ? true : false}
                              errorMessage={errors.scheduleId?.message}
                              disabled
                            />
                          </div>

                          <div className="sm:w-full md:w-full lg:w-[50%] pb-2">
                            <LabelInput
                              id="scheduleLunchOut"
                              label="Lunch out"
                              value={
                                schedule.lunchOut
                                  ? formatTime(schedule.lunchOut)
                                  : '-- : --'
                              }
                              isError={errors.scheduleId ? true : false}
                              errorMessage={errors.scheduleId?.message}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-end w-full h-full">
                  <button
                    className="w-full px-2 py-2 text-white rounded bg-slate-700 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={openSelectScheduleModal}
                    type="button"
                  >
                    <span className="text-xs ">Select Schedule</span>
                  </button>
                </div>

                <MySelectList
                  id="scheduleRestDays"
                  label="Rest Days"
                  multiple
                  options={listOfRestDays}
                  onChange={(o) => setSelectedRestDays(o)}
                  value={selectedRestDays}
                />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onCloseScheduleSheet}
            >
              Cancel
            </button>

            <button
              className={`px-3 py-2 text-white ${
                isEmpty(getValues('scheduleId'))
                  ? 'bg-gray-500 hover:bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-400'
              } rounded text-sm disabled:cursor-not-allowed `}
              type="submit"
              form="addEmpSchedForm"
              disabled={isEmpty(getValues('scheduleId')) ? true : false}
            >
              Submit
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEmpSchedModal;
