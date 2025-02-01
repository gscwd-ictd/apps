import { LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { ScheduleSheetForm, useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import SelectGroupSsModal from '../SelectGroupSsModal';
import SelectOfficeSchedSsModal from './SelectOfficeSchedSsModal';
import SelectedEmployeesSsTable from '../SelectedEmployeesSsTable';
import { EmployeeAsOptionWithRestDays } from 'libs/utils/src/lib/types/employee.type';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

type AddOfficeSsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const AddOfficeSsModal: FunctionComponent<AddOfficeSsModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // state for checking if restday is empty
  const [employeeRestDayIsEmpty, setEmployeeRestDayIsEmpty] = useState<boolean>(true);

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
      dtrDates: {
        dateFrom: '',
        dateTo: '',
      },
    },
  });

  // on close sheet
  const onCloseScheduleSheet = () => {
    reset();
    setCurrentScheduleSheet({
      id: '',
      scheduleId: '',
      customGroupId: '',
      dtrDates: {
        dateFrom: '',
        dateTo: '',
      },
    }) as unknown as ScheduleSheetForm;
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

  const [selectScheduleModalIsOpen, setSelectScheduleModalIsOpen] = useState<boolean>(false);

  // open select schedule modal
  const openSelectScheduleModal = () => setSelectScheduleModalIsOpen(true);

  // close select schedule modal
  const closeSelectScheduleModal = () => {
    setSelectScheduleModalIsOpen(false);
  };

  // schedule sheet store
  const {
    scheduleSheet,
    schedule,
    selectedGroupId,
    selectedScheduleId,
    currentScheduleSheet,

    setCurrentScheduleSheet,
    setSelectedGroupId,
    setSelectedScheduleId,

    getScheduleById,
    getScheduleByIdSuccess,
    getScheduleByIdFail,

    getScheduleSheet,
    getScheduleSheetSuccess,
    getScheduleSheetFail,

    postScheduleSheet,
    postScheduleSheetSuccess,
    postScheduleSheetFail,
  } = useScheduleSheetStore((state) => ({
    scheduleSheet: state.getScheduleSheetResponse,
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

    getScheduleSheet: state.getScheduleSheet,
    getScheduleSheetSuccess: state.getScheduleSheetSuccess,
    getScheduleSheetFail: state.getScheduleSheetFail,

    postScheduleSheet: state.postScheduleSheet,
    postScheduleSheetSuccess: state.postScheduleSheetSuccess,
    postScheduleSheetFail: state.postScheduleSheetFail,
  }));

  // custom group store
  const { getCustomGroups, getCustomGroupsSuccess, getCustomGroupsFail } = useCustomGroupStore((state) => ({
    customGroups: state.customGroups,
    getCustomGroups: state.getCustomGroups,
    getCustomGroupsSuccess: state.getCustomGroupsSuccess,
    getCustomGroupsFail: state.getCustomGroupsFail,
  }));

  // get all schedules for Office
  const {
    data: swrSchedule,
    isLoading: swrScheduleIsLoading,
    error: swrScheduleError,
  } = useSWR(!isEmpty(selectedScheduleId) ? `/schedules/${selectedScheduleId}` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // fetch all custom groups
  const {
    data: swrGroupDetails,
    isLoading: swrGroupDetailsIsLoading,
    error: swrGroupDetailsError,
  } = useSWR(modalState ? `/custom-groups/${selectedGroupId}` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnMount: false,
  });

  // fetch data for list of custom groups
  const {
    data: swrCustomGroups,
    isLoading: swrCustomGroupsIsLoading,
    error: swrCustomGroupsError,
  } = useSWR('/custom-groups', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // on submit
  const onSubmit = async () => {
    // extract the unnecessary items for posting
    const { scheduleName, customGroupName, id, ...rest } = currentScheduleSheet;

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

      // close the modal since the scheduling sheet is a success
      onCloseScheduleSheet();
    } else if (error) {
      // post scheduling sheet fail
      postScheduleSheetFail(result);
    }
  };

  // fetch of custom groups
  useEffect(() => {
    if (swrCustomGroupsIsLoading) {
      getCustomGroups();
    }
  }, [swrCustomGroupsIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrCustomGroups)) {
      getCustomGroupsSuccess(swrCustomGroups.data);
    }

    if (!isEmpty(swrCustomGroupsError)) {
      getCustomGroupsFail(swrCustomGroupsError.message);
    }
  }, [swrCustomGroups, swrCustomGroupsError]);

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
      getScheduleSheet();
    }
  }, [swrGroupDetailsIsLoading]);

  // swr group details success or fail
  useEffect(() => {
    // success
    if (!isEmpty(swrGroupDetails)) {
      getScheduleSheetSuccess(swrGroupDetails.data);
    }

    // fail
    if (!isEmpty(swrGroupDetailsError)) {
      getScheduleSheetFail(swrGroupDetailsError.message);
    }
  }, [swrGroupDetails, swrGroupDetailsError]);

  useEffect(() => {
    if (!isEmpty(schedule)) {
      setValue('scheduleId', schedule.id);
    }
  }, [schedule]);

  useEffect(() => {
    if (!isEmpty(scheduleSheet)) {
      if (!isEmpty(scheduleSheet.customGroupDetails)) {
        setValue('customGroupId', scheduleSheet.customGroupDetails.id);
        setValue('customGroupName', scheduleSheet.customGroupDetails.name);
      }
    }
  }, [scheduleSheet]);

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

  // Disable submit if an employee has an empty rest day
  useEffect(() => {
    if (!isEmpty(currentScheduleSheet.employees)) {
      const result = currentScheduleSheet.employees.some((employeeRestDays) => isEmpty(employeeRestDays.restDays));
      if (result) {
        setEmployeeRestDayIsEmpty(true);
      } else {
        setEmployeeRestDayIsEmpty(false);
      }
    }
  }, [currentScheduleSheet]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="lg" steady>
        <Modal.Header>
          <h1 className="px-5 text-xl font-medium">Add Office Scheduling Sheet</h1>
        </Modal.Header>

        <Modal.Body>
          <div className=" xs:px-0 sm:px-0 md:px-0 lg:px-4">
            <SelectGroupSsModal
              modalState={selectGroupModalIsOpen}
              setModalState={setSelectGroupModalIsOpen}
              closeModalAction={closeSelectGroupModal}
            />

            <SelectOfficeSchedSsModal
              modalState={selectScheduleModalIsOpen}
              setModalState={setSelectScheduleModalIsOpen}
              closeModalAction={closeSelectScheduleModal}
            />
            <form id="addOfficeSsForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex w-full gap-10 mb-2 xs:flex-col sm:flex-col md:flex-col lg:flex-row xs:h-auto sm:h-auto md:h-auto lg:h-[20rem]">
                {/* Effectivity */}
                <section className="flex flex-col w-full h-full gap-2 px-5 py-4 rounded-xl">
                  <div className="flex flex-col justify-center w-full pb-2">
                    <p className="flex items-center justify-start w-full font-light">Effectivity Date</p>

                    <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />

                    <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                      <LabelInput
                        id="fieldsStartDate"
                        name="dtrDates.dateFrom"
                        type="date"
                        label="Start Date"
                        controller={{
                          ...register('dtrDates.dateFrom', {
                            onChange: (e) =>
                              setCurrentScheduleSheet({
                                ...currentScheduleSheet,
                                dtrDates: { ...currentScheduleSheet.dtrDates, dateFrom: e.target.value },
                              }),
                          }),
                        }}
                        isError={errors.dtrDates?.dateFrom ? true : false}
                        errorMessage={errors.dtrDates?.dateFrom.message}
                      />
                      <LabelInput
                        id="fieldSsEndDate"
                        name="dtrDates.dateTo"
                        type="date"
                        label="End Date"
                        controller={{
                          ...register('dtrDates.dateTo', {
                            onChange: (e) =>
                              setCurrentScheduleSheet({
                                ...currentScheduleSheet,
                                dtrDates: { ...currentScheduleSheet.dtrDates, dateTo: e.target.value },
                              }),
                          }),
                        }}
                        isError={errors.dtrDates?.dateTo ? true : false}
                        errorMessage={errors.dtrDates?.dateTo?.message}
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
                        id="officeGroupName"
                        name="groupName"
                        type="text"
                        label=""
                        value={
                          !isEmpty(scheduleSheet.customGroupDetails) ? scheduleSheet.customGroupDetails.name : '--'
                        }
                        isError={errors.dtrDates?.dateFrom ? true : false}
                        errorMessage={errors.dtrDates?.dateFrom.message}
                        disabled
                      />
                    )}
                  </div>

                  <div className="flex items-end h-full gap-2">
                    <button
                      className="w-full px-2 py-2 text-white rounded disabled:cursor-not-allowed bg-slate-700 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={openSelectGroupModal}
                      type="button"
                      disabled={!isEmpty(getValues('dtrDates.dateFrom')) && !isEmpty(getValues('dtrDates.dateTo'))}
                    >
                      <span className="text-xs ">Select Group</span>
                    </button>
                  </div>
                </section>

                {/* Schedule */}
                <section className="flex flex-col justify-between w-full h-full gap-2 px-5 py-4 rounded-xl">
                  <div className="flex flex-col justify-between w-full h-full">
                    <p className="flex items-center justify-start w-full font-light">Office Schedule</p>
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
              <section className="col-span-2 rounded bg-inherit min-h-auto pt-3">
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
              className={`px-3 py-2 text-white  ${
                isEmpty(currentScheduleSheet.employees) || isEmpty(getValues('scheduleId')) || employeeRestDayIsEmpty
                  ? 'bg-gray-500 hover:bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-400'
              } rounded text-sm disabled:cursor-not-allowed `}
              type="submit"
              form="addOfficeSsForm"
              disabled={
                isEmpty(currentScheduleSheet.employees) || isEmpty(getValues('scheduleId')) || employeeRestDayIsEmpty
                  ? true
                  : false
              }
            >
              Submit
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddOfficeSsModal;
