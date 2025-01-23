/* eslint-disable @next/next/no-img-element */
import { AlertNotification, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { EmployeeScheduleForm, useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
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
import { Notification } from 'libs/oneui/src/components/Notification/Notification';
import Toggle from '../../../switch/Toggle';
import DailyTimeRecordCalendar from '../DailyTimeRecordCalendar';

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
  // state for usage of date picker
  const [datePicker, setDatePicker] = useState<boolean>(false);

  // react hook form
  const {
    watch,
    getValues,
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeScheduleForm>();

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  const [selectScheduleModalIsOpen, setSelectScheduleModalIsopen] = useState<boolean>(false);

  const [selectedRestDays, setSelectedRestDays] = useState<Array<SelectOption>>([]);

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
    isLoading,
    selectedScheduleId,
    getScheduleById,
    getScheduleByIdFail,
    getEmployeeSchedules,
    postEmployeeSchedule,
    postEmployeeScheduleFail,
    postEmployeeScheduleSuccess,
    setSelectedScheduleId,
    getScheduleByIdSuccess,
    getEmployeeSchedulesFail,
    getEmployeeSchedulesSuccess,
    isError,
  } = useScheduleSheetStore((state) => ({
    schedule: state.schedule,
    selectedScheduleId: state.selectedScheduleId,
    setSelectedScheduleId: state.setSelectedScheduleId,
    getScheduleById: state.getScheduleById,
    getScheduleByIdSuccess: state.getScheduleByIdSuccess,
    getScheduleByIdFail: state.getScheduleByIdFail,
    postEmployeeSchedule: state.postEmployeeSchedule,
    postEmployeeScheduleSuccess: state.postEmployeeScheduleSuccess,
    postEmployeeScheduleFail: state.postEmployeeScheduleFail,
    getEmployeeSchedules: state.getEmployeeSchedules,
    getEmployeeSchedulesSuccess: state.getEmployeeSchedulesSuccess,
    getEmployeeSchedulesFail: state.getEmployeeSchedulesFail,
    isLoading: state.loading.loadingEmployeeSchedule,
    isError: state.error.errorEmployeeSchedule,
  }));

  // use SWR
  const {
    data: swrSchedule,
    isLoading: swrScheduleIsLoading,
    error: swrScheduleError,
  } = useSWR(!isEmpty(selectedScheduleId) ? `/schedules/${selectedScheduleId}` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // on submit
  const onSubmit = async (data: EmployeeScheduleForm) => {
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

    // call the function to start loading
    postEmployeeSchedule();

    // call the post function
    await handlePostScheduling(rest);
  };

  // function for posting the schedule sheet
  const handlePostScheduling = async (data: Partial<EmployeeScheduleForm>) => {
    const { error, result } = await postEmpMonitoring(`/employee-schedule/`, data);

    if (!error) {
      // post scheduling sheet success
      postEmployeeScheduleSuccess(result);

      // close the modal since it is a success
      onCloseScheduleSheet();
    } else if (error) {
      // post scheduling sheet fail
      postEmployeeScheduleFail(result);
    }
  };

  // function for selecting dates from picker
  // const handleDateSelect = (dates: string[]) => {
  //   setValue('dtrDates', dates);
  // };

  // on close sheet
  const onCloseScheduleSheet = () => {
    reset();
    setSelectedRestDays([]);
    setSelectedScheduleId('');
    closeModalAction();
  };

  // set value of selected dates to form value
  // useEffect(() => {
  //   setValue('dtrDates', selectedDates);
  // }, [selectedDates, setValue]);

  // set schedule id loading to true
  useEffect(() => {
    getScheduleById();
  }, [selectedScheduleId]);

  // set the schedule
  useEffect(() => {
    // success
    if (!isEmpty(swrSchedule)) getScheduleByIdSuccess(swrSchedule.data);

    // fail
    if (!isEmpty(swrScheduleError)) getScheduleByIdFail(swrScheduleError.message);
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
    } else {
      setDatePicker(false);
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
            {/* Notification */}
            {isLoading ? (
              <div className="fixed z-50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <AlertNotification
                  logo={<LoadingSpinner size="xs" />}
                  alertType="info"
                  notifMessage="Submitting request"
                  dismissible={false}
                />
              </div>
            ) : null}

            {/* ERROR */}
            {isError ? (
              <ToastNotification
                notifMessage="Something went wrong. Please try again within a few seconds."
                toastType="error"
              />
            ) : null}

            <form id="addEmpSchedForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col w-full gap-2 px-5">
                <div className="flex items-center gap-4 px-2 pb-4">
                  <div className="flex items-center gap-4 px-2">
                    {employeeData.photoUrl ? (
                      <div className="flex flex-wrap justify-center">
                        <div className="w-[6rem]">
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}${employeeData.photoUrl}`}
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
                      <div className="text-2xl font-semibold text-gray-600">{employeeData.fullName}</div>
                      <div className="text-xl text-gray-500">{employeeData.assignment.positionTitle}</div>
                    </div>
                  </div>
                </div>

                {/* Effectivity */}
                <div className="flex flex-col justify-center w-full pb-6">
                  <p className="flex items-center justify-start w-full font-light text-gray-400">Effectivity Date</p>

                  <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />
                  {/*  
                  <div className="flex gap-2 text-start pb-2">
                    <Toggle
                      labelPosition="top"
                      enabled={datePicker}
                      setEnabled={setDatePicker}
                      label={'Use Date Picker:'}
                    />
                    <div className={`text-xs ${datePicker ? 'text-blue-400' : 'text-gray-400'}`}>
                      {datePicker ? (
                        <button onClick={() => setDatePicker((prev) => !prev)} className="underline" type="button">
                          <span>Yes</span>
                        </button>
                      ) : (
                        <button onClick={() => setDatePicker((prev) => !prev)} className="underline" type="button">
                          <span>No</span>
                        </button>
                      )}
                    </div>
                  </div>
                  */}

                  {/* Input for date picker */}
                  {/* {datePicker === true ? (
                    <div className="grid gap-2 grid-cols-1">
                      <label className="text-md font-medium text-gray-900">Select Dates</label>
                      <DailyTimeRecordCalendar id="dtr-calendar" onDateSelect={handleDateSelect} />
                    </div>
                  ) : null} */}

                  {/* Input for date range */}
                  {/* {datePicker === false ? ( */}
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
                  {/* ) : null} */}
                </div>

                <div className="flex flex-col justify-between w-full h-full pb-2">
                  <p className="flex items-center justify-start w-full font-light text-gray-400">Schedule</p>
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
                              value={schedule.timeIn ? formatTime(schedule.timeIn) : '-- : --'}
                              isError={errors.scheduleId ? true : false}
                              errorMessage={errors.scheduleId?.message}
                              disabled
                            />
                          </div>

                          <div className="sm:w-full md:w-full lg:w-[50%] pb-2">
                            <LabelInput
                              id="scheduleTimeOut"
                              label="Time out"
                              value={schedule.timeOut ? formatTime(schedule.timeOut) : '-- : --'}
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
                              value={schedule.lunchIn ? formatTime(schedule.lunchIn) : '-- : --'}
                              isError={errors.scheduleId ? true : false}
                              errorMessage={errors.scheduleId?.message}
                              disabled
                            />
                          </div>

                          <div className="sm:w-full md:w-full lg:w-[50%] pb-2">
                            <LabelInput
                              id="scheduleLunchOut"
                              label="Lunch out"
                              value={schedule.lunchOut ? formatTime(schedule.lunchOut) : '-- : --'}
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
                isEmpty(getValues('scheduleId')) ? 'bg-gray-500 hover:bg-gray-400' : 'bg-blue-500 hover:bg-blue-400'
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
