import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { CustomGroup } from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import { EmployeeAsOptionWithRestDays } from 'libs/utils/src/lib/types/employee.type';
import { ScheduleSheet, useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import { useForm } from 'react-hook-form';
import { LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import ViewEmployeesSsTable from '../ViewEmployeesSsTable';

type ViewFieldSsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: ScheduleSheet;
};

type ScheduleSheetForm = ScheduleSheet & {
  employees: Array<EmployeeAsOptionWithRestDays>;
};

const ViewFieldSsModal: FunctionComponent<ViewFieldSsModalProps> = ({
  modalState,
  closeModalAction,
  setModalState,
  rowData,
}) => {
  // react hook form
  const {
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<ScheduleSheetForm>();

  // on close sheet
  const onCloseScheduleSheet = () => {
    reset();
    setIsLoading(false);
    clearScheduleSheet();
    setSelectedCustomGroupWithMembers({
      customGroupDetails: {} as CustomGroup,
      members: [],
    });
    closeModalAction();
  };

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  // loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setSelectedGroupId,
    getScheduleByIdFail,
    getGroupByIdSuccess,
    setSelectedScheduleId,
    getScheduleByIdSuccess,
    setCurrentScheduleSheet,
    clearScheduleSheet,
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
    clearScheduleSheet: state.clearScheduleSheet,
  }));

  // custom group store
  const { setSelectedCustomGroupWithMembers } = useCustomGroupStore((state) => ({
    setSelectedCustomGroupWithMembers: state.setSelectedCustomGroupWithMembers,
  }));

  // useSWR for schedule details
  const {
    data: swrSchedule,
    isLoading: swrScheduleIsLoading,
    error: swrScheduleError,
  } = useSWR(!isEmpty(selectedScheduleId) ? `/schedules/${selectedScheduleId}` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // useSWR for members of scheduling sheet
  const {
    data: swrGroupDetails,
    isLoading: swrGroupDetailsIsLoading,
    error: swrGroupDetailsError,
  } = useSWR(
    !isEmpty(selectedGroupId)
      ? `/custom-groups/${selectedGroupId}/?dateFrom=${rowData.dateFrom}&dateTo=${rowData.dateTo}&scheduleId=${rowData.scheduleId}&`
      : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnMount: false,
    }
  );

  // set default values
  const setDefaultValues = (rowData: ScheduleSheet) => {
    setValue('scheduleId', rowData.scheduleId);
    setValue('customGroupId', rowData.customGroupId);
    setValue('customGroupName', rowData.customGroupName);
    setValue('dateFrom', dayjs(rowData.dateFrom).format('YYYY-MM-DD'));
    setValue('dateTo', dayjs(rowData.dateTo).format('YYYY-MM-DD'));
    setValue('scheduleName', rowData.scheduleName);
    setSelectedGroupId(rowData.customGroupId);
    setSelectedScheduleId(rowData.scheduleId);
    setCurrentScheduleSheet({
      ...currentScheduleSheet,
      scheduleId: rowData.scheduleId,
      scheduleName: rowData.scheduleName,
      customGroupId: rowData.customGroupId,
      customGroupName: rowData.customGroupName,
      dateFrom: dayjs(rowData.dateFrom).format('MM-DD-YYYY'),
      dateTo: dayjs(rowData.dateTo).format('MM-DD-YYYY'),
    });
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

  // load the members
  useEffect(() => {
    if (!isEmpty(group.members)) {
      // map the selected group and assign an empty array to rest days
      const membersWithRestDays = group.members.map((member) => {
        return { ...member };
      });

      //! Replaced with groupWithMembers later if rest days are available
      setCurrentScheduleSheet({
        ...currentScheduleSheet,
        employees: membersWithRestDays,
      });

      // assign the selected custom group with members on submit only
      setSelectedCustomGroupWithMembers({
        customGroupDetails: group.customGroupDetails,
        members: membersWithRestDays,
      });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [group]);

  // register then group id and schedule ids
  useEffect(() => {
    if (modalState && rowData) {
      setIsLoading(true);
      register('scheduleId', { required: true });
      register('customGroupId', { required: true });
      setDefaultValues(rowData);
    }
  }, [modalState, rowData]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="lg" steady>
        <Modal.Header>
          <h1 className="px-5 text-xl font-medium">View Field Scheduling Sheet</h1>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <div className=" xs:px-0 sm:px-0 md:px-0 lg:px-4">
              <div className="flex w-full gap-10 mb-2 xs:flex-col sm:flex-col md:flex-col lg:flex-row xs:h-auto sm:h-auto md:h-auto lg:h-[16rem]">
                {/* Effectivity */}
                <section className="flex flex-col w-full h-full gap-2 px-5 py-4 rounded-xl">
                  <div className="flex flex-col justify-start w-full pb-2">
                    <p className="flex items-center justify-start w-full font-light">Effectivity Date</p>
                    <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />
                    <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ">
                      <LabelInput
                        id="fieldsStartDate"
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
                        id="fieldSsEndDate"
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

                  <div className="flex flex-col justify-center w-full">
                    {swrGroupDetailsIsLoading ? (
                      <LoadingSpinner size="lg" />
                    ) : (
                      <LabelInput
                        id="fieldGroupName"
                        name="groupName"
                        type="text"
                        label="Group Name"
                        value={!isEmpty(group.customGroupDetails) ? group.customGroupDetails.name : '--'}
                        isError={errors.dateFrom ? true : false}
                        errorMessage={errors.dateFrom?.message}
                        disabled
                      />
                    )}
                  </div>
                </section>

                {/* Schedule */}
                <section className="flex flex-col w-full h-full gap-2 px-5 py-4 rounded-xl">
                  <div className="flex flex-col justify-start w-full h-full">
                    <p className="flex items-center justify-start w-full font-light">Field Schedule</p>
                    <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />
                    <div className="flex flex-col w-full gap-4">
                      {swrScheduleIsLoading ? (
                        <LoadingSpinner size="lg" />
                      ) : (
                        <div className="flex flex-col gap-4">
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
                </section>
              </div>
              <section className="col-span-2 rounded bg-inherit min-h-auto">
                <ViewEmployeesSsTable />
              </section>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              onClick={onCloseScheduleSheet}
            >
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewFieldSsModal;
