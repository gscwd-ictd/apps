import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { CustomGroup } from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import { EmployeeAsOptionWithRestDays } from 'libs/utils/src/lib/types/employee.type';
import {
  CurrentScheduleSheet,
  ScheduleSheet,
  useScheduleSheetStore,
} from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import { useForm } from 'react-hook-form';
import { LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import ViewEmployeesSsTable from '../ViewEmployeesSsTable';

type ViewOfficeSsModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: CurrentScheduleSheet;
};

type ScheduleSheetForm = ScheduleSheet & {
  employees: Array<EmployeeAsOptionWithRestDays>;
};

const ViewOfficeSsModal: FunctionComponent<ViewOfficeSsModalProps> = ({
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
    setIsLoadingMembers(false);
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

  //  date format to YYYY-MM-DD
  const formatDate = (date: string | null) => {
    if (date === null) return '-';
    else return dayjs(date).format('YYYY-MM-DD');
  };

  // loading
  const [isLoadingMembers, setIsLoadingMembers] = useState<boolean>(false);

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

    getScheduleSheet,
    getScheduleSheetSuccess,
    getScheduleSheetFail,

    getScheduleById,
    getScheduleByIdSuccess,
    getScheduleByIdFail,

    clearScheduleSheet,
  } = useScheduleSheetStore((state) => ({
    scheduleSheet: state.getScheduleSheetResponse,
    schedule: state.schedule,
    selectedGroupId: state.selectedGroupId,
    selectedScheduleId: state.selectedScheduleId,
    currentScheduleSheet: state.currentScheduleSheet,

    setCurrentScheduleSheet: state.setCurrentScheduleSheet,
    setSelectedGroupId: state.setSelectedGroupId,
    setSelectedScheduleId: state.setSelectedScheduleId,

    getScheduleSheet: state.getScheduleSheet,
    getScheduleSheetSuccess: state.getScheduleSheetSuccess,
    getScheduleSheetFail: state.getScheduleSheetFail,

    getScheduleById: state.getScheduleById,
    getScheduleByIdSuccess: state.getScheduleByIdSuccess,
    getScheduleByIdFail: state.getScheduleByIdFail,

    clearScheduleSheet: state.clearScheduleSheet,
  }));

  // custom group store
  const { setSelectedCustomGroupWithMembers } = useCustomGroupStore((state) => ({
    setSelectedCustomGroupWithMembers: state.setSelectedCustomGroupWithMembers,
  }));

  // useSWR for members of scheduling sheet
  const {
    data: swrScheduleSheet,
    isLoading: swrScheduleSheetIsLoading,
    error: swrScheduleSheetError,
  } = useSWR(
    modalState
      ? `/custom-groups/${rowData.customGroupId}/?date_from=${formatDate(rowData.dateFrom)}&date_to=${formatDate(
          rowData.dateTo
        )}&schedule_id=${rowData.scheduleId}`
      : null,
    fetcherEMS,
    {}
  );

  // useSWR for schedule details
  const {
    data: swrSchedule,
    isLoading: swrScheduleIsLoading,
    error: swrScheduleError,
  } = useSWR(!isEmpty(rowData.scheduleId) && modalState ? `/schedules/${rowData.scheduleId}` : null, fetcherEMS, {});

  // set default values
  const setDefaultValues = (rowData: CurrentScheduleSheet) => {
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
      dtrDates: {
        dateFrom: dayjs(rowData.dateFrom).format('MM-DD-YYYY'),
        dateTo: dayjs(rowData.dateTo).format('MM-DD-YYYY'),
      },
    });
  };

  // register then group id and schedule ids
  useEffect(() => {
    if (modalState) {
      register('scheduleId', { required: true });
      register('customGroupId', { required: true });
      setDefaultValues(rowData);
      setIsLoadingMembers(true);
    }
  }, [modalState]);

  // swr schedule sheet details loading
  useEffect(() => {
    if (swrScheduleSheetIsLoading) {
      // getScheduleSheet();
    }
  }, [swrScheduleSheetIsLoading]);

  // swr schedule sheet details success or fail
  useEffect(() => {
    // success
    if (!isEmpty(swrScheduleSheet)) {
      getScheduleSheetSuccess(swrScheduleSheet.data);
    }

    // fail
    if (!isEmpty(swrScheduleSheetError)) {
      getScheduleSheetFail(swrScheduleSheetError.message);
    }
  }, [swrScheduleSheet, swrScheduleSheetError]);

  // swr schedule loading
  useEffect(() => {
    if (swrScheduleIsLoading) {
      getScheduleById();
    }
  }, [swrScheduleIsLoading]);

  // set the schedule
  useEffect(() => {
    // success
    if (!isEmpty(swrSchedule)) getScheduleByIdSuccess(swrSchedule.data);

    // fail
    if (!isEmpty(swrScheduleError)) getScheduleByIdFail(swrScheduleError.message);
  }, [swrSchedule, swrScheduleError]);

  // load the members

  useEffect(() => {
    if (!isEmpty(scheduleSheet.members)) {
      // map the selected group and assign an empty array to rest days
      const membersWithRestDays = scheduleSheet?.members.map((member) => {
        return { ...member };
      });

      setCurrentScheduleSheet({
        ...currentScheduleSheet,
        employees: membersWithRestDays,
      });

      // assign the selected custom group with members on submit only
      setSelectedCustomGroupWithMembers({
        customGroupDetails: scheduleSheet.customGroupDetails,
        members: membersWithRestDays,
      });

      setIsLoadingMembers(false);
    }
  }, [scheduleSheet]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="lg" steady>
        <Modal.Header>
          <h1 className="px-5 text-xl font-medium">View Office Scheduling Sheet</h1>
        </Modal.Header>

        <Modal.Body>
          <div className=" xs:px-0 sm:px-0 md:px-0 lg:px-4">
            <div className="flex w-full gap-10 mb-2 xs:flex-col sm:flex-col md:flex-col lg:flex-row xs:h-auto sm:h-auto md:h-auto lg:h-[16rem]">
              {/* Effectivity */}
              <section className="flex flex-col w-full h-full gap-2 px-5 py-4 rounded-xl">
                <div className="flex flex-col justify-start w-full pb-2">
                  <p className="flex items-center justify-start w-full font-light">Effectivity Date</p>
                  <hr className="h-1 mt-2 mb-4 bg-gray-200 border-0 rounded" />
                  <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ">
                    <LabelInput
                      id="officesStartDate"
                      name="dateFrom"
                      type="date"
                      label="Start Date"
                      controller={{
                        ...register('dateFrom', {
                          onChange: (e) =>
                            setCurrentScheduleSheet({
                              ...currentScheduleSheet,
                              dtrDates: {
                                ...currentScheduleSheet.dtrDates,
                                dateFrom: e.target.value,
                              },
                            }),
                        }),
                      }}
                      isError={errors.dateFrom ? true : false}
                      errorMessage={errors.dateFrom?.message}
                    />
                    <LabelInput
                      id="officeSsEndDate"
                      name="dateTo"
                      type="date"
                      label="End Date"
                      controller={{
                        ...register('dateTo', {
                          onChange: (e) =>
                            setCurrentScheduleSheet({
                              ...currentScheduleSheet,
                              dtrDates: {
                                ...currentScheduleSheet.dtrDates,
                                dateTo: e.target.value,
                              },
                            }),
                        }),
                      }}
                      isError={errors.dateTo ? true : false}
                      errorMessage={errors.dateTo?.message}
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-center w-full">
                  <LabelInput
                    id="officeGroupName"
                    name="groupName"
                    type="text"
                    label="Group Name"
                    value={!isEmpty(rowData.customGroupName) ? rowData.customGroupName : '--'}
                    isError={errors.dateFrom ? true : false}
                    errorMessage={errors.dateFrom?.message}
                    disabled
                  />
                </div>
              </section>

              {/* Schedule */}
              <section className="flex flex-col w-full h-full gap-2 px-5 py-4 rounded-xl">
                <div className="flex flex-col justify-start w-full h-full">
                  <p className="flex items-center justify-start w-full font-light">Office Schedule</p>
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
              {isLoadingMembers ? <LoadingSpinner size="lg" /> : <ViewEmployeesSsTable />}
            </section>
          </div>
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

export default ViewOfficeSsModal;
