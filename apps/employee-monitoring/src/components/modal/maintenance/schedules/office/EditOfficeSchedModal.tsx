/* eslint-disable react-hooks/exhaustive-deps */
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { MySelectList } from 'apps/employee-monitoring/src/components/inputs/SelectList';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';
import Toggle from 'apps/employee-monitoring/src/components/switch/Toggle';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import UseRestDaysOptionToNumberArray from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysOptionToNumberArray';
import UseConvertRestDaysToArray from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysToArray';
import { putEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { listOfRestDays } from 'libs/utils/src/lib/constants/rest-days.const';
import { listOfShifts } from 'libs/utils/src/lib/constants/shifts.const';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { categorySelection } from 'libs/utils/src/lib/constants/schedule-type';
import { yupResolver } from '@hookform/resolvers/yup';
import ScheduleSchema from '../ScheduleSchema';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

const removeSeconds = (value: string | null) => {
  if (isEmpty(value)) return null;
  else return dayjs('2000/01/01' + ' ' + value).format('HH:mm');
};

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Schedule;
};

const EditOfficeSchedModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const {
    IsLoading,
    UpdateSchedule,
    UpdateScheduleFail,
    UpdateScheduleSuccess,
  } = useScheduleStore((state) => ({
    SchedulePostResponse: state.schedule.postResponse,
    IsLoading: state.loading.loadingSchedule,
    UpdateSchedule: state.updateSchedule,
    UpdateScheduleSuccess: state.updateScheduleSuccess,
    UpdateScheduleFail: state.updateScheduleFail,
  }));

  const {
    setValue,
    handleSubmit,
    watch,
    getValues,
    reset,
    register,
    clearErrors,
    formState: { errors, isValid, dirtyFields },
  } = useForm<Schedule>({
    resolver: yupResolver(ScheduleSchema),
    mode: 'onChange',
    reValidateMode: 'onSubmit',
  });

  // load default values
  const loadNewDefaultValues = (sched: Schedule) => {
    if (
      sched.withLunch.toString() === 'true' ||
      sched.withLunch.toString() === '1'
    )
      sched.withLunch = true;
    else sched.withLunch = false;

    setValue('id', sched.id);
    setValue('name', sched.name);
    setValue('scheduleType', sched.scheduleType);
    setValue('timeIn', removeSeconds(sched.timeIn));
    setValue('timeOut', removeSeconds(sched.timeOut));
    setValue('scheduleBase', sched.scheduleBase);
    setValue('withLunch', sched.withLunch);
    setValue('lunchIn', removeSeconds(sched.lunchIn));
    setValue('lunchOut', removeSeconds(sched.lunchOut));
    setValue('shift', sched.shift);

    reset({
      id: rowData.id,
      name: rowData.name,
      scheduleType: rowData.scheduleType,
      timeIn: removeSeconds(rowData.timeIn),
      timeOut: removeSeconds(rowData.timeOut),
      scheduleBase: sched.scheduleBase,
      shift: rowData.shift,
      lunchIn: removeSeconds(rowData.lunchIn),
      lunchOut: removeSeconds(rowData.lunchOut),
      withLunch: rowData.withLunch,
    });

    // console.log(sched.withLunch);

    if (sched.withLunch) {
      setWithLunch(true);
    } else {
      setWithLunch(false);
    }
  };

  const [withLunch, setWithLunch] = useState<boolean>(true);

  const onSubmit: SubmitHandler<Schedule> = (sched: Schedule) => {
    // set loading to true
    UpdateSchedule();

    handleUpdateResult(sched);
  };

  const handleUpdateResult = async (data: Schedule) => {
    const { error, result } = await putEmpMonitoring('/schedules', data);

    if (error) {
      // set value for error message
      UpdateScheduleFail(result);
    } else {
      // set value from returned response
      UpdateScheduleSuccess(result);
      //   mutate('/holidays');

      reset();
      closeModalAction();
    }
  };

  // set it to null
  useEffect(() => {
    if (isEmpty(watch('lunchIn'))) setValue('lunchIn', null);
  }, [watch('lunchIn')]);

  // set it to null
  useEffect(() => {
    if (isEmpty(watch('lunchOut'))) setValue('lunchOut', null);
  }, [watch('lunchOut')]);

  // with lunch in/out listener
  useEffect(() => {
    if (withLunch) setValue('withLunch', true);
    else if (!withLunch) {
      setValue('withLunch', false);
      setValue('lunchIn', null);
      setValue('lunchOut', null);
    }
  }, [withLunch]);

  useEffect(() => {
    if (Boolean(getValues('withLunch')) === true) {
      setWithLunch(true);
    } else if (Boolean(getValues('withLunch')) === false) {
      setWithLunch(false);
    }
  }, [watch('withLunch')]);

  useEffect(() => {
    if (modalState === true) {
      register('withLunch');
      loadNewDefaultValues(rowData);
      clearErrors();
    }
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">Edit Office Schedule</span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModalAction}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          {/* Notification */}
          {IsLoading ? (
            <div className="fixed z-50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={false}
              />
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="addoffmodal">
            <div className="flex flex-col w-full gap-5">
              {/** name */}
              <LabelInput
                id={'scheduleName'}
                label={'Schedule Name'}
                controller={{ ...register('name') }}
                isError={errors.name ? true : false}
                errorMessage={errors.name?.message}
                disabled={IsLoading ? true : false}
              />

              {/** schedule type */}
              <SelectListRF
                id="scheduleCategory"
                selectList={categorySelection}
                controller={{
                  ...register('scheduleType'),
                }}
                label="Category"
                isError={errors.scheduleType ? true : false}
                errorMessage={errors.scheduleType?.message}
                disabled={IsLoading ? true : false}
              />

              {/** Time in */}
              <LabelInput
                id={'scheduleTimeIn'}
                type="time"
                label={'Time In'}
                controller={{ ...register('timeIn') }}
                isError={errors.timeIn ? true : false}
                errorMessage={errors.timeIn?.message}
                disabled={IsLoading ? true : false}
              />

              {/** Time Out */}
              <LabelInput
                id={'scheduleTimeOut'}
                type="time"
                label={'Time Out'}
                controller={{ ...register('timeOut') }}
                isError={errors.timeOut ? true : false}
                errorMessage={errors.timeOut?.message}
                disabled={IsLoading ? true : false}
              />

              {/** With Lunch */}
              <div className="flex gap-2 text-start">
                <Toggle
                  labelPosition="top"
                  enabled={withLunch}
                  setEnabled={setWithLunch}
                  label={'With Lunch In & Out:'}
                  disabled={IsLoading ? true : false}
                />

                <div
                  className={`text-xs ${
                    withLunch ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {withLunch ? (
                    <button
                      onClick={() => setWithLunch((prev) => !prev)}
                      className="underline"
                      type="button"
                      disabled={IsLoading ? true : false}
                    >
                      <span>Yes</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setWithLunch((prev) => !prev)}
                      className="underline"
                      type="button"
                      disabled={IsLoading ? true : false}
                    >
                      <span>No</span>
                    </button>
                  )}
                </div>
              </div>

              {/** Lunch Out */}
              {watch('withLunch') === true ? (
                <LabelInput
                  id={'scheduleLunchOut'}
                  type="time"
                  label={'Lunch Out'}
                  controller={{ ...register('lunchOut') }}
                  isError={errors.lunchOut ? true : false}
                  errorMessage={errors.lunchOut?.message}
                  disabled={IsLoading ? true : false}
                />
              ) : null}

              {/** Lunch In */}
              {watch('withLunch') === true ? (
                <LabelInput
                  id={'scheduleLunchIn'}
                  type="time"
                  label={'Lunch In'}
                  controller={{ ...register('lunchIn') }}
                  isError={errors.lunchIn ? true : false}
                  errorMessage={errors.lunchIn?.message}
                  disabled={IsLoading ? true : false}
                />
              ) : null}

              {/** Shift  */}
              <SelectListRF
                id="scheduleShift"
                selectList={listOfShifts}
                controller={{
                  ...register('shift', { required: true }),
                }}
                label="Shift"
                isError={errors.shift ? true : false}
                errorMessage={errors.shift?.message}
                disabled={IsLoading ? true : false}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addoffmodal"
              className="disabled:cursor-not-allowed"
              disabled={IsLoading ? true : !isValid ? true : false}
            >
              <span className="text-xs font-normal">Update</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditOfficeSchedModal;
