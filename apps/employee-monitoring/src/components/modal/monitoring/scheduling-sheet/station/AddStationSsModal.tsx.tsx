import { Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { ScheduleSheet, useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import SelectFieldGroupSsModal from '../SelectGroupSsModal';
import SelectStationSchedSsModal from './SelectStationSchedSsModal';
import SelectedEmployeesSsTable from '../SelectedEmployeesSsTable';
import { EmployeeAsOptionWithRestDays } from 'libs/utils/src/lib/types/employee.type';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import SelectGroupSsModal from '../SelectGroupSsModal';

type AddStationSsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type ScheduleSheetForm = ScheduleSheet & {
  employees: Array<EmployeeAsOptionWithRestDays>;
};

const AddStationSsModal: FunctionComponent<AddStationSsModalProps> = ({
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
      scheduleId: '',
      employees: [],
      scheduleName: '',
      dateFrom: '',
      dateTo: '',
    },
  });

  // on close sheet
  const onCloseScheduleSheet = () => {
    reset();
    setCurrentScheduleSheet({
      id: '',
      scheduleId: '',
      customGroupId: '',
      dateFrom: '',
      dateTo: '',
    }) as unknown as ScheduleSheet;
    setSelectedGroupId('');
    setSelectedScheduleId('');
    closeModalAction();
  };

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  const [selectGroupModalIsOpen, setSelectGroupModalIsOpen] = useState<boolean>(false);

  // open select group modal
  const openSelectGroupModal = () => setSelectGroupModalIsOpen(true);

  // close select group modal
  const closeSelectGroupModal = () => {
    setSelectGroupModalIsOpen(false);
  };

  const [selectScheduleModalIsOpen, setSelectScheduleModalIsopen] = useState<boolean>(false);

  // open select schedule modal
  const openSelectScheduleModal = () => setSelectScheduleModalIsopen(true);

  // close select schedule modal
  const closeSelectScheduleModal = () => {
    setSelectScheduleModalIsopen(false);
  };

  // schedule sheet store
  const {
    group,
    schedule,
    selectedGroupId,
    selectedScheduleId,
    currentScheduleSheet,
    getGroupById,
    getScheduleById,
    getGroupByIdFail,
    postScheduleSheet,
    setSelectedGroupId,
    getScheduleByIdFail,
    getGroupByIdSuccess,
    postScheduleSheetFail,
    setSelectedScheduleId,
    getScheduleByIdSuccess,
    setCurrentScheduleSheet,
    postScheduleSheetSuccess,
  } = useScheduleSheetStore((state) => ({
    group: state.group,
    schedule: state.schedule,
    selectedGroupId: state.selectedGroupId,
    selectedScheduleId: state.selectedScheduleId,
    currentScheduleSheet: state.currentScheduleSheet,
    setCurrentScheduleSheet: state.setCurrentScheduleSheet,
    setSelectedGroupId: state.setSelectedGroupId,
    setSelectedScheduleId: state.setSelectedScheduleId,
    getScheduleById: state.getScheduleById,
    getScheduleByIdSuccess: state.getScheduleByIdSuccess,
    getScheduleByIdFail: state.getScheduleByIdFail,
    getGroupById: state.getGroupById,
    getGroupByIdSuccess: state.getGroupByIdSuccess,
    getGroupByIdFail: state.getGroupByIdFail,
    postScheduleSheet: state.postScheduleSheet,
    postScheduleSheetSuccess: state.postScheduleSheetSuccess,
    postScheduleSheetFail: state.postScheduleSheetFail,
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

  // fetch
  const {
    data: swrGroupDetails,
    isLoading: swrGroupDetailsIsLoading,
    error: swrGroupDetailsError,
  } = useSWR(`/custom-groups/${selectedGroupId}`, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnMount: false,
  });

  // on submit
  const onSubmit = async () => {
    // extract the unnecessary items for posting
    const { scheduleName, customGroupName, id, customGroupId, ...rest } = currentScheduleSheet;

    // call the function to start loading
    postScheduleSheet();

    // call the post function
    await handlePostScheduling(rest);
  };

  // function for posting the schedule sheet
  const handlePostScheduling = async (data: any) => {
    const { error, result } = await postEmpMonitoring('/employee-schedule/group', data);

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
    if (!isEmpty(swrScheduleError)) getScheduleByIdFail(swrScheduleError.message);
  }, [swrSchedule, swrScheduleError]);

  // swr is loading
  useEffect(() => {
    if (swrGroupDetailsIsLoading) {
      getGroupById();
    }
  }, [swrGroupDetailsIsLoading]);

  // swr group details success or fail
  useEffect(() => {
    // success
    if (!isEmpty(swrGroupDetails)) {
      getGroupByIdSuccess(swrGroupDetails.data);
    }

    // fail
    if (!isEmpty(swrGroupDetailsError)) {
      getGroupByIdFail(swrGroupDetailsError.message);
    }
  }, [swrGroupDetails, swrGroupDetailsError]);

  useEffect(() => {
    if (!isEmpty(schedule)) {
      setValue('scheduleId', schedule.id);
    }
  }, [schedule]);

  useEffect(() => {
    if (!isEmpty(group)) {
      if (!isEmpty(group.customGroupDetails)) {
        setValue('customGroupId', group.customGroupDetails.id);
        setValue('customGroupName', group.customGroupDetails.name);
      }
    }
  }, [group]);

  // watch
  useEffect(() => {
    // sched id
    if (!isEmpty(watch('scheduleId'))) {
      setCurrentScheduleSheet({
        ...currentScheduleSheet,
        scheduleId: getValues('scheduleId'),
      });
    }
  }, [watch('scheduleId')]);

  useEffect(() => {
    if (!isEmpty(watch('customGroupId'))) {
      setCurrentScheduleSheet({
        ...currentScheduleSheet,
        customGroupId: getValues('customGroupId'),
      });
    }
  }, [watch('customGroupId')]);

  // register then group id and schedule ids
  useEffect(() => {
    if (modalState) {
      register('scheduleId', { required: true });
      register('customGroupId', { required: true });
    }
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="lg" steady>
        <Modal.Header>
          <h1 className="px-5 text-xl font-medium">Add Station Scheduling Sheet</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="sm:px-0 md:px-0 lg:px-4">
            <SelectGroupSsModal
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
              <div className="flex w-full gap-10 mb-2 xs:flex-col sm:flex-col md:flex-col lg:flex-row xs:h-auto sm:h-auto md:h-auto lg:h-[20rem]">
                {/* Effectivity */}
                <section className="flex flex-col w-full h-full gap-2 px-5 py-4 rounded-xl">
                  <div className="flex flex-col justify-center w-full pb-2">
                    <p className="flex items-center justify-start w-full font-light">Effectivity Date</p>
                    <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />
                    <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                      <LabelInput
                        id="stationSsStartDate"
                        name="dateFrom"
                        type="date"
                        label="Start Date"
                        controller={{
                          ...register('dateFrom', {
                            onChange: (e) =>
                              setCurrentScheduleSheet({
                                ...currentScheduleSheet,
                                dateFrom: e.target.value,
                              }),
                          }),
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
                          ...register('dateTo', {
                            onChange: (e) =>
                              setCurrentScheduleSheet({
                                ...currentScheduleSheet,
                                dateTo: e.target.value,
                              }),
                          }),
                        }}
                        isError={errors.dateTo ? true : false}
                        errorMessage={errors.dateTo?.message}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center w-full ">
                    <p className="flex items-center justify-start w-full text-sm font-light">Group Name</p>
                    <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />

                    {swrGroupDetailsIsLoading ? (
                      <LoadingSpinner size="lg" />
                    ) : (
                      <LabelInput
                        id="stationGroupName"
                        name="groupName"
                        type="text"
                        label=""
                        value={!isEmpty(group.customGroupDetails) ? group.customGroupDetails.name : '--'}
                        isError={errors.dateFrom ? true : false}
                        errorMessage={errors.dateFrom?.message}
                        disabled
                      />
                    )}
                  </div>

                  <div className="flex items-end h-full gap-2">
                    <button
                      className="w-full px-2 py-2 text-white rounded disabled:cursor-not-allowed bg-slate-700 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={openSelectGroupModal}
                      type="button"
                      disabled={!isEmpty(getValues('dateFrom')) && !isEmpty(getValues('dateTo')) ? false : true}
                    >
                      <span className="text-xs ">Select Group</span>
                    </button>
                  </div>
                </section>

                {/* Schedule */}
                <section className="flex flex-col justify-between w-full h-full gap-2 px-5 py-4 rounded-xl">
                  <div className="flex flex-col justify-between w-full h-full">
                    <p className="flex items-center justify-start w-full font-light">Station Schedule</p>
                    <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />
                    <div className="flex flex-col w-full gap-2">
                      {swrScheduleIsLoading ? (
                        <LoadingSpinner size="lg" />
                      ) : (
                        <div className="flex flex-col gap-5 pt-1">
                          <LabelInput
                            id="scheduleName"
                            label="Name"
                            value={schedule.name ?? '--'}
                            isError={errors.scheduleId ? true : false}
                            errorMessage={errors.scheduleId?.message}
                            disabled
                          />
                          <div className="gap-2 sm:flex-col md:flex-col lg:flex-row lg:flex">
                            <div className="sm:w-full md:w-full lg:w-[50%]">
                              <LabelInput
                                id="scheduleTimeIn"
                                label="Time in"
                                value={schedule.timeIn ? formatTime(schedule.timeIn) : '-- : --'}
                                isError={errors.scheduleId ? true : false}
                                errorMessage={errors.scheduleId?.message}
                                disabled
                              />
                            </div>

                            <div className="sm:w-full md:w-full lg:w-[50%]">
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
                </section>
              </div>
              <section className="col-span-2 rounded bg-inherit min-h-auto">
                <SelectedEmployeesSsTable />
              </section>
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
                isEmpty(currentScheduleSheet.employees) || isEmpty(getValues('scheduleId'))
                  ? 'bg-gray-500 hover:bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-400'
              } rounded text-sm disabled:cursor-not-allowed `}
              type="submit"
              form="addStationSsForm"
              disabled={isEmpty(currentScheduleSheet.employees) || isEmpty(getValues('scheduleId')) ? true : false}
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
