import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { MySelectList } from 'apps/employee-monitoring/src/components/inputs/SelectList';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';
import Toggle from 'apps/employee-monitoring/src/components/switch/Toggle';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { listOfRestDays } from 'libs/utils/src/lib/constants/rest-days.const';
import { Categories } from 'libs/utils/src/lib/enums/category.enum';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const shiftSelection: Array<SelectOption> = [
  { label: 'Morning', value: 'morning' },
  { label: 'Night', value: 'night' },
];

const categorySelection: Array<SelectOption> = [
  { label: 'Regular', value: 'regular' },
  { label: 'Flexible', value: 'flexible' },
  { label: 'Pumping Operator AM', value: 'operator-am' },
  { label: 'Pumping Operator PM', value: 'operator-pm' },
];

const AddOfficeSchedModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorPostMessage, setErrorPostMessage] = useState<string>('');
  const [responsePost, setResponsePost] = useState<object>({});
  const [withLunch, setWithLunch] = useState<boolean>(true);
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
      id: '',
      scheduleType: null,
      timeIn: '',
      timeOut: '',
      withLunch: true,
      lunchIn: null,
      lunchOut: null,
      name: '',
      shift: null,
      restDays: [],
    },
  });

  const onSubmit: SubmitHandler<Schedule> = (data: Schedule) => {
    // set loading to true
    setIsLoading(true);

    handlePostResult(data);

    // empty the state to remove previous value
    setErrorPostMessage('');

    // empty the state to remove previous value
    setResponsePost({});
  };

  const handlePostResult = async (data: Schedule) => {
    const { error, result } = await postEmpMonitoring('/holidays', data);

    if (error) {
      // request is done so set loading to false
      setIsLoading(false);

      // set value for error message
      setErrorPostMessage(result);
    } else {
      // request is done so set loading to false
      setIsLoading(false);

      // set value from returned response
      setResponsePost(result);
      //   mutate('/holidays');

      reset();
      closeModalAction();
    }
  };

  useEffect(() => {
    register('restDays', { value: [] });
  }, []);

  useEffect(() => {}, [selectedRestDays]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="xl">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">New Schedule</span>
            <button
              className="w-[1.5rem] h-[1.5rem] items-center text-center text-white bg-gray-400 rounded-full"
              type="button"
              onClick={closeModalAction}
            >
              x
            </button>
          </div>
        </Modal.Header>
        <hr />
        <Modal.Body>
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
                  disabled={isLoading ? true : false}
                />

                {/** Shift */}
                <SelectListRF
                  id="scheduleCategory"
                  selectList={categorySelection}
                  controller={{
                    ...register('scheduleType', { required: true }),
                  }}
                  label="Category"
                  disabled={isLoading ? true : false}
                />

                {/** Time in */}
                <LabelInput
                  id={'scheduleTimeIn'}
                  type="time"
                  label={'Time In'}
                  controller={{ ...register('timeIn', { required: true }) }}
                  isError={errors.timeIn ? true : false}
                  errorMessage={errors.timeIn?.message}
                  disabled={isLoading ? true : false}
                />

                {/** Time Out */}
                <LabelInput
                  id={'scheduleTimeOut'}
                  type="time"
                  label={'Time Out'}
                  controller={{ ...register('timeOut', { required: true }) }}
                  isError={errors.timeOut ? true : false}
                  errorMessage={errors.timeOut?.message}
                  disabled={isLoading ? true : false}
                />

                {/** With Lunch */}
                <div className="flex gap-2 text-start">
                  <Toggle
                    labelPosition="top"
                    enabled={withLunch}
                    setEnabled={setWithLunch}
                    label={'With Lunch In & Out:'}
                    disabled={isLoading ? true : false}
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
                        disabled={isLoading ? true : false}
                      >
                        <span>Yes</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setWithLunch((prev) => !prev)}
                        className="underline"
                        type="button"
                        disabled={isLoading ? true : false}
                      >
                        <span>No</span>
                      </button>
                    )}
                  </div>
                </div>

                {/** Lunch In */}
                {watch('withLunch') === true ? (
                  <LabelInput
                    id={'scheduleLunchIn'}
                    type="time"
                    label={'Lunch In'}
                    controller={{ ...register('lunchIn') }}
                    isError={errors.lunchIn ? true : false}
                    errorMessage={errors.lunchIn?.message}
                    disabled={isLoading ? true : false}
                  />
                ) : null}

                {/** Lunch Out */}
                {watch('withLunch') === true ? (
                  <LabelInput
                    id={'scheduleLunchOut'}
                    type="time"
                    label={'Lunch Out'}
                    controller={{ ...register('lunchOut') }}
                    isError={errors.lunchOut ? true : false}
                    errorMessage={errors.lunchOut?.message}
                    disabled={isLoading ? true : false}
                  />
                ) : null}

                {/** Rest Day */}
                <div className="flex flex-col w-full min-h-[2.25rem]">
                  <MySelectList
                    id="scheduleRestDays"
                    label="Rest Day(s)"
                    multiple
                    options={listOfRestDays}
                    onChange={(o) => setSelectedRestDays(o)}
                    value={selectedRestDays}
                    disabled={isLoading ? true : false}
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
              disabled={isLoading ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddOfficeSchedModal;
