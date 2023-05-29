/* eslint-disable @nx/enforce-module-boundaries */
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import {
  EmployeeSchedule,
  useDtrStore,
} from 'apps/employee-monitoring/src/store/dtr.store';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { EmployeeRowData } from 'apps/employee-monitoring/src/utils/types/table-row-types/monitoring/employee.type';
import { scheduleBaseSelection } from 'libs/utils/src/lib/constants/schedule-type';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { isEmpty } from 'lodash';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { LabelInput } from '../../../inputs/LabelInput';
import { SelectListRF } from '../../../inputs/SelectListRF';

type ViewEmployeeScheduleProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeAction: () => void;
  employee: EmployeeRowData;
};

type EmployeeWithSchedule = {
  employeeId: string;
  employeeName: string;
  scheduleId: string;
  scheduleBase: ScheduleBases;
};

const ViewEmployeeSchedule: FunctionComponent<ViewEmployeeScheduleProps> = ({
  modalState,
  setModalState,
  closeAction,
  employee,
}) => {
  const [employeeId, setEmployeeId] = useState<string>('');
  const [listOfSchedules, setListOfSchedules] = useState<
    Array<SelectOption & { scheduleBase: string }>
  >([]);

  const [filteredSchedules, setFilteredSchedules] = useState<
    Array<SelectOption>
  >([]);

  // employee schedule dtr store
  const {
    selectedEmployee,
    employeeWithSchedule,
    loadingEmployeeWithSchedule,
    defineSchedule,
    defineScheduleFail,
    defineScheduleSuccess,
    getEmployeeSchedule,
    getEmployeeScheduleFail,
    getEmployeeScheduleSuccess,
  } = useDtrStore((state) => ({
    selectedEmployee: state.selectedEmployee,
    employeeWithSchedule: state.employeeWithSchedule,
    defineSchedule: state.defineSchedule,
    defineScheduleSuccess: state.defineScheduleSuccess,
    defineScheduleFail: state.defineScheduleFail,
    getEmployeeSchedule: state.getEmployeeSchedule,
    getEmployeeScheduleFail: state.getEmployeeScheduleFail,
    getEmployeeScheduleSuccess: state.getEmployeeScheduleSuccess,
    loadingEmployeeWithSchedule: state.loading.loadingEmployeeWithSchedule,
  }));

  // schedule store
  const { schedules, getSchedules, getSchedulesFail, getSchedulesSuccess } =
    useScheduleStore((state) => ({
      schedules: state.schedules,
      getSchedules: state.getSchedules,
      getSchedulesSuccess: state.getSchedulesSuccess,
      getSchedulesFail: state.getSchedulesFail,
    }));

  const {
    setValue,
    getValues,
    handleSubmit,
    watch,
    reset,
    register,
    clearErrors,
    formState: { errors, isDirty, isValid, isValidating },
  } = useForm<EmployeeWithSchedule>({
    mode: 'onChange',
    reValidateMode: 'onSubmit',
    defaultValues: {
      employeeId: '',
      employeeName: '',
      scheduleBase: null,
      scheduleId: '',
    },
  });

  // initial swr : get the employee schedule first priority
  // swr employee with schedule
  const {
    data: swrEmployeeWithSchedule,
    isLoading: swrEwsIsLoading,
    error: swrEwsError,
  } = useSWR(`/employee-schedule/${employeeId}`, fetcherEMS, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // swr schedules: get the list of all schedules second priority
  const {
    data: swrSchedules,
    isLoading: swrSchedulesIsLoading,
    error: swrScheduleError,
    mutate: mutateSchedules,
  } = useSWR('/schedule', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // fire submit
  const onSubmit = (data: EmployeeWithSchedule) => {
    const { employeeName, scheduleBase, ...rest } = data;

    defineSchedule();
    handlePostResult(rest);
  };

  const closeModal = () => {
    // set the employee id to empty every time the modal is closed
    setEmployeeId('');

    reset();
    closeAction();
  };

  // post route for submitting the data to the db
  const handlePostResult = async (data: any) => {
    const { error, result } = await postEmpMonitoring(
      '/employee-schedule',
      data
    );

    if (error) {
      // set value for error message
      defineScheduleFail(result);
    } else {
      // set value from returned response
      defineScheduleSuccess(result);
      //   mutate('/holidays');

      reset();
      closeModal();
    }
  };

  // set default values
  useEffect(() => {
    if (!isEmpty(employeeWithSchedule)) {
      setValue('employeeId', employeeWithSchedule.employeeId);
      setValue('employeeName', employeeWithSchedule.employeeName);

      // if schedules are fetched using swr, load the default values
      if (!isEmpty(schedules)) {
        setValue('scheduleBase', employeeWithSchedule.schedule.scheduleBase);
      }
    }
  }, [employeeWithSchedule, schedules]);

  // after schedule base is changed
  useEffect(() => {
    if (!isEmpty(filteredSchedules))
      setValue('scheduleId', employeeWithSchedule.schedule.id);
  }, [filteredSchedules]);

  // employee schedule loading
  useEffect(() => {
    if (swrEwsIsLoading) {
      getEmployeeSchedule();
    }
  }, [swrEwsIsLoading]);

  // schedules is loading
  useEffect(() => {
    if (swrSchedulesIsLoading) {
      getSchedules(swrSchedulesIsLoading);
    }
  }, [swrSchedulesIsLoading]);

  // set employee schedule swr
  useEffect(() => {
    if (!isEmpty(swrEmployeeWithSchedule)) {
      const employeeData: EmployeeSchedule = {
        employeeId: employee.id,
        employeeName: swrEmployeeWithSchedule.data.employeeName,
        schedule: swrEmployeeWithSchedule.data.schedule,
      };

      getEmployeeScheduleSuccess(employeeData);
    }

    if (swrEwsError) {
      getEmployeeScheduleFail(swrEwsError);
    }
  }, [swrEwsError, swrEmployeeWithSchedule]);

  // set schedules swr
  useEffect(() => {
    if (!isEmpty(swrSchedules)) {
      getSchedulesSuccess(swrSchedules.data);
    }

    if (!isEmpty(swrScheduleError)) {
      getSchedulesFail(swrScheduleError);
    }
  }, [swrScheduleError, swrSchedules]);

  // mutate schedules and return with label, value, and scheduleBase
  useEffect(() => {
    if (!isEmpty(schedules)) {
      const tempSchedules = schedules.map((schedule) => {
        return {
          label: schedule.name,
          value: schedule.id,
          scheduleBase: schedule.scheduleBase,
        };
      });

      setListOfSchedules(tempSchedules);
    }
  }, [schedules]);

  // filter list of schedules by scheduleBase
  useEffect(() => {
    if (!isEmpty(listOfSchedules) && !isEmpty(getValues('scheduleBase'))) {
      const tempSchedules = listOfSchedules.filter(
        (sched) => sched.scheduleBase === getValues('scheduleBase')
      );
      setFilteredSchedules(tempSchedules);
    }
  }, [listOfSchedules, watch('scheduleBase')]);

  // this is needed to re-run swr every time the modal opens
  useEffect(() => {
    if (modalState) {
      setEmployeeId(employee.id);
    }
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady>
        <Modal.Header>
          <div className="flex items-center justify-between w-full">
            <div className="text-2xl font-medium">Employee Schedule</div>
            <div>
              <button
                className="px-2 py-1 rounded hover:bg-gray-200"
                onClick={closeModal}
              >
                x
              </button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <>
            {/* Notification */}
            {loadingEmployeeWithSchedule ? (
              <div className="fixed z-50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <AlertNotification
                  logo={<LoadingSpinner size="xs" />}
                  alertType="info"
                  notifMessage="Submitting request"
                  dismissible={false}
                />
              </div>
            ) : null}

            <form
              onSubmit={handleSubmit(onSubmit)}
              id="setEmployeeScheduleModal"
            >
              <div className="w-full my-5">
                <div className="flex flex-col w-full gap-5">
                  <LabelInput
                    id={'employeeScheduleName'}
                    type="text"
                    label={'Employee Name'}
                    controller={{ ...register('employeeName') }}
                    isError={errors.employeeName ? true : false}
                    errorMessage={errors.employeeName?.message}
                    disabled={true}
                  />

                  {/** Schedule Base  */}
                  <SelectListRF
                    id="scheduleBase"
                    selectList={scheduleBaseSelection}
                    controller={{
                      ...register('scheduleBase', { required: true }),
                    }}
                    label="Schedule Base"
                    isError={errors.scheduleBase ? true : false}
                    errorMessage={errors.scheduleBase?.message}
                    disabled={swrEwsIsLoading ? true : false}
                  />

                  {/** Schedule Base  */}
                  <SelectListRF
                    id="scheduleName"
                    selectList={filteredSchedules}
                    defaultValue={getValues('scheduleId')}
                    controller={{
                      ...register('scheduleId', {
                        required: true,
                        onChange: (e) => setValue('scheduleId', e.target.value),
                      }),
                    }}
                    label="Schedule Name"
                    isError={errors.scheduleId ? true : false}
                    errorMessage={errors.scheduleId?.message}
                    disabled={swrEwsIsLoading ? true : false}
                  />
                </div>
                <div></div>
              </div>
            </form>
          </>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="setEmployeeScheduleModal"
              className="disabled:cursor-not-allowed"
              disabled={
                swrEwsIsLoading
                  ? true
                  : !isDirty
                  ? true
                  : !isValid
                  ? true
                  : isValidating
                  ? true
                  : false
              }
            >
              <span className="text-xs font-normal">Set</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewEmployeeSchedule;
