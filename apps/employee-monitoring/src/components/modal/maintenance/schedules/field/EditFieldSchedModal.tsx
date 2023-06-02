/* eslint-disable react-hooks/exhaustive-deps */
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import { putEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { listOfShifts } from 'libs/utils/src/lib/constants/shifts.const';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ScheduleSchema from '../ScheduleSchema';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Schedule;
};

const EditFieldSchedModal: FunctionComponent<EditModalProps> = ({
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
    IsLoading: state.loading.loadingSchedule,
    UpdateSchedule: state.updateSchedule,
    UpdateScheduleSuccess: state.updateScheduleSuccess,
    UpdateScheduleFail: state.updateScheduleFail,
  }));

  // load default values
  const loadNewDefaultValues = (sched: Schedule) => {
    setValue('id', sched.id);
    setValue('name', sched.name);
    setValue('scheduleType', sched.scheduleType);
    setValue('withLunch', false);
    setValue('timeIn', sched.timeIn);
    setValue('timeOut', sched.timeOut);
    setValue('lunchIn', sched.lunchIn);
    setValue('lunchOut', sched.lunchOut);
    setValue('shift', sched.shift);
  };

  const {
    setValue,
    handleSubmit,
    reset,
    register,
    clearErrors,
    formState: { errors, isValid, isDirty },
  } = useForm<Schedule>({
    resolver: yupResolver(ScheduleSchema),
    mode: 'onChange',
    reValidateMode: 'onSubmit',
    defaultValues: {
      id: rowData.id,
      name: rowData.name,
      scheduleType: rowData.scheduleType,
      timeIn: rowData.timeIn,
      timeOut: rowData.timeOut,
      scheduleBase: ScheduleBases.FIELD,
      shift: rowData.shift,
      lunchIn: rowData.lunchIn,
      lunchOut: rowData.lunchOut,
    },
  });

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

  useEffect(() => {
    if (modalState === true) {
      loadNewDefaultValues(rowData);
      clearErrors();
    }
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">Edit Field Schedule</span>
            <button
              className="w-[1.5rem] h-[1.5rem] items-center text-center text-white bg-gray-400 rounded"
              type="button"
              onClick={closeModalAction}
            >
              x
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

          <form onSubmit={handleSubmit(onSubmit)} id="addfieldmodal">
            <div className="w-full mt-5">
              <div className="flex flex-col w-full gap-5">
                {/** name */}
                <LabelInput
                  id={'scheduleName'}
                  label={'Schedule Name'}
                  controller={{ ...register('name', { required: true }) }}
                  isError={errors.name ? true : false}
                  errorMessage={errors.name?.message}
                  disabled={IsLoading ? true : false}
                />

                {/** Time in */}
                <LabelInput
                  id={'scheduleTimeIn'}
                  type="time"
                  label={'Time In'}
                  controller={{ ...register('timeIn', { required: true }) }}
                  isError={errors.timeIn ? true : false}
                  errorMessage={errors.timeIn?.message}
                  disabled={IsLoading ? true : false}
                />

                {/** Time Out */}
                <LabelInput
                  id={'scheduleTimeOut'}
                  type="time"
                  label={'Time Out'}
                  controller={{ ...register('timeOut', { required: true }) }}
                  isError={errors.timeOut ? true : false}
                  errorMessage={errors.timeOut?.message}
                  disabled={IsLoading ? true : false}
                />

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
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addfieldmodal"
              className="disabled:cursor-not-allowed"
              disabled={
                IsLoading ? true : !isValid ? true : !isDirty ? true : false
              }
            >
              <span className="text-xs font-normal">Update</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditFieldSchedModal;
