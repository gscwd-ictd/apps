/* eslint-disable react-hooks/exhaustive-deps */
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { MySelectList } from 'apps/employee-monitoring/src/components/inputs/SelectList';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';
import { useScheduleStore } from 'apps/employee-monitoring/src/store/schedule.store';
import UseRestDaysOptionToNumberArray from 'apps/employee-monitoring/src/utils/functions/ConvertRestDaysOptionToNumberArray';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { listOfRestDays } from 'libs/utils/src/lib/constants/rest-days.const';
import { listOfShifts } from 'libs/utils/src/lib/constants/shifts.const';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const ScheduleSchema = yup.object().shape({
  id: yup.string().notRequired().trim(),
  scheduleType: yup.string().nullable().notRequired().label('Schedule type'),
  name: yup.string().nullable(false).required().trim().label('Name'),
  timeIn: yup.string().nullable().required().label('Time in'),
  timeOut: yup.string().nullable().required().label('Time out'),
  withLunch: yup.boolean().notRequired(),
  lunchIn: yup
    .string()
    .label('Lunch in')
    .when('withLunch', {
      is: true,
      then: yup
        .string()
        .required()
        .typeError('Time in is a required field')
        .trim()
        .label('Time in'),
    })
    .when('withLunch', {
      is: false,
      then: yup.string().notRequired().nullable().label('Time in'),
    }),
  lunchOut: yup
    .string()
    .label('Lunch out')
    .when('withLunch', {
      is: true,
      then: yup
        .string()
        .required()
        .typeError('Time out is a required field')
        .trim()
        .label('Time out'),
    })
    .when('withLunch', {
      is: false,
      then: yup.string().notRequired().nullable().label('Time out'),
    }),
  shift: yup.string().nullable().required().label('Shift'),
});

const AddStationSchedModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  const {
    IsLoading,
    Error,
    PostSchedule,
    PostScheduleFail,
    PostScheduleSuccess,
  } = useScheduleStore((state) => ({
    SchedulePostResponse: state.schedule.postResponse,
    IsLoading: state.loading.loadingSchedule,
    Error: state.error.errorSchedule,

    PostSchedule: state.postSchedule,
    PostScheduleSuccess: state.postScheduleSuccess,
    PostScheduleFail: state.postScheduleFail,
  }));

  const [selectedRestDays, setSelectedRestDays] = useState<Array<SelectOption>>(
    []
  );

  const {
    setValue,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<Schedule>({
    resolver: yupResolver(ScheduleSchema),
    mode: 'onChange',
    defaultValues: {
      scheduleType: null,
      timeIn: '',
      timeOut: '',
      scheduleBase: ScheduleBases.PUMPING_STATION,
      name: '',
      withLunch: false,
      shift: null,
      restDays: [],
      lunchIn: null,
      lunchOut: null,
    },
  });

  // reset all values
  const resetToDefaultValues = () => {
    setSelectedRestDays([]);
    reset();
  };

  const onSubmit: SubmitHandler<Schedule> = (sched: Schedule) => {
    // set loading to true
    PostSchedule(true);

    handlePostResult(sched);
  };

  const handlePostResult = async (data: Schedule) => {
    const { error, result } = await postEmpMonitoring('/schedule', data);

    if (error) {
      // request is done so set loading to false
      PostSchedule(false);

      // set value for error message
      PostScheduleFail(result);
    } else {
      // request is done so set loading to false
      PostSchedule(false);

      // set value from returned response
      PostScheduleSuccess(result);
      //   mutate('/holidays');

      reset();
      closeModalAction();
    }
  };

  // watch
  useEffect(() => {
    setValue('restDays', UseRestDaysOptionToNumberArray(selectedRestDays));
  }, [selectedRestDays]);

  useEffect(() => {
    if (modalState === true) resetToDefaultValues();
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">
              New Pumping Station Schedule
            </span>
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

          <form onSubmit={handleSubmit(onSubmit)} id="addstationmodal">
            <div className="w-full mt-5">
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

                {/** Shift  */}
                <SelectListRF
                  id="scheduleShift"
                  selectList={listOfShifts}
                  controller={{
                    ...register('shift'),
                  }}
                  label="Shift"
                  isError={errors.shift ? true : false}
                  errorMessage={errors.shift?.message}
                  disabled={IsLoading ? true : false}
                />

                {/** Rest Day */}
                <div className="flex flex-col w-full min-h-[2.25rem]">
                  <MySelectList
                    id="scheduleRestDays"
                    label="Rest Day(s)"
                    multiple
                    options={listOfRestDays}
                    onChange={(o) => setSelectedRestDays(o)}
                    value={selectedRestDays}
                    disabled={IsLoading ? true : false}
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addstationmodal"
              className="disabled:cursor-not-allowed"
              disabled={IsLoading ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddStationSchedModal;
