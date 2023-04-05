import {
  Modal,
  AlertNotification,
  LoadingSpinner,
  Button,
} from '@gscwd-apps/oneui';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { useHolidaysStore } from 'apps/employee-monitoring/src/store/holidays.store';
import { Holiday } from 'apps/employee-monitoring/src/utils/types/holiday.type';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type Item = {
  label: string;
  value: any;
};

const holidayTypesSelection: Array<SelectOption> = [
  { label: 'Regular', value: 'regular' },
  { label: 'Special', value: 'special' },
];

const AddHolidayModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  // zustand store initialization
  const {
    IsLoading,

    PostHoliday,
    PostHolidaySuccess,
    PostHolidayFail,
  } = useHolidaysStore((state) => ({
    IsLoading: state.loading.loadingHoliday,

    PostHoliday: state.postHoliday,
    PostHolidaySuccess: state.postHolidaySuccess,
    PostHolidayFail: state.postHolidayFail,
  }));

  // React hook form
  const { reset, register, handleSubmit } = useForm<Holiday>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      holidayDate: '',
      type: '',
    },
  });

  const onSubmit: SubmitHandler<Holiday> = (data: Holiday) => {
    // set loading to true
    PostHoliday();

    handlePostResult(data);
  };

  const handlePostResult = async (data: Holiday) => {
    const { error, result } = await postEmpMonitoring('/holidays', data);

    if (error) {
      // request is done so set loading to false
      PostHolidayFail(result);
    } else {
      // request is done so set loading to false
      PostHolidaySuccess(result);

      reset();
      closeModalAction();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600"></span>
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
          <div>
            {/* Notifications */}
            {IsLoading ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={true}
              />
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} id="addHolidayForm">
              {/* Holiday name input */}
              <div className="mb-6">
                <label
                  htmlFor="holiday_name"
                  className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-800"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="holiday_name"
                  id="holiday_name"
                  className="bg-gray-50 border border-gray-300 sm:text-xs text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-400 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=" "
                  required
                  {...register('name')}
                />
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                {/* Holiday date input*/}
                <div className="mb-6">
                  <label
                    htmlFor="holiday_date"
                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-800"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    name="holiday_date"
                    id="floating_password"
                    className="bg-gray-50 border border-gray-300 sm:text-xs text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-400 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder=" "
                    required
                    {...register('holidayDate')}
                  />
                </div>

                {/* Holiday type input */}
                <div className="mb-6">
                  <label
                    htmlFor="countries"
                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-800"
                  >
                    Type of Holiday
                  </label>
                  <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 sm:text-xs text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-400 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    {...register('type')}
                  >
                    <option value="" disabled>
                      -
                    </option>
                    {holidayTypesSelection.map((item: Item, idx: number) => (
                      <option value={item.value} key={idx}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* Submit button */}
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addHolidayForm"
              className="text-gray-400 ml-1 disabled:cursor-not-allowed"
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

export default AddHolidayModal;
