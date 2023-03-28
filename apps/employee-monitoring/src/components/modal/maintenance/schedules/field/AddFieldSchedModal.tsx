/* eslint-disable react-hooks/rules-of-hooks */
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
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { listOfRestDays } from 'libs/utils/src/lib/constants/rest-days.const';
import { listOfShifts } from 'libs/utils/src/lib/constants/shifts.const';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { categorySelection } from 'libs/utils/src/lib/constants/schedule-type';
import { Categories } from 'libs/utils/src/lib/enums/category.enum';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const AddFieldSchedModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  const {
    SchedulePostResponse,
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
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<Schedule>({
    mode: 'onChange',
    defaultValues: {
      scheduleType: Categories.FLEXIBLE,
      timeIn: '',
      timeOut: '',
      scheduleBase: ScheduleBases.FIELD,
      withLunch: false,
      lunchIn: null,
      lunchOut: null,
      name: '',
      shift: null,
      restDays: [],
    },
  });

  // reset all values
  const resetToDefaultValues = () => {
    setSelectedRestDays([]);
  };

  // convert
  const useRestDayArrayToNumberArray = (restDays: SelectOption[]) => {
    const restDayNumbers = restDays.map((restDay) => {
      return parseInt(restDay.value.toString());
    });
    return restDayNumbers;
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
      PostScheduleFail(false, result);
    } else {
      // request is done so set loading to false
      PostSchedule(false);

      // set value from returned response
      PostScheduleSuccess(false, result);

      // set default values
      resetToDefaultValues();

      // call the close modal action
      closeModalAction();
    }
  };

  // watch
  useEffect(() => {
    setValue('restDays', useRestDayArrayToNumberArray(selectedRestDays));
  }, [selectedRestDays]);

  // set to defaultValues during open
  useEffect(() => {
    reset();
    resetToDefaultValues();
  }, [modalState]);

  return (
    <>
      {!isEmpty(Error) ? (
        <ToastNotification toastType="error" notifMessage={Error} />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">New Field Schedule</span>
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

          <form onSubmit={handleSubmit(onSubmit)} id="addoffmodal">
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

                {/** schedule type */}
                <SelectListRF
                  id="scheduleCategory"
                  selectList={categorySelection}
                  controller={{
                    ...register('scheduleType', { required: true }),
                  }}
                  label="Category"
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
              form="addoffmodal"
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

export default AddFieldSchedModal;
