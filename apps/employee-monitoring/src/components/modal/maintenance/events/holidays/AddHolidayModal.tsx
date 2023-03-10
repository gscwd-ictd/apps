import {
  Modal,
  ToastNotification,
  AlertNotification,
  LoadingSpinner,
} from '@gscwd-apps/oneui';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { isEmpty } from 'lodash';
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
  const {
    HolidayPostResponse,
    IsLoading,
    Error,

    PostHoliday,
    PostHolidaySuccess,
    PostHolidayFail,

    // EmptyResponse,
  } = useHolidaysStore((state) => ({
    HolidayPostResponse: state.holiday.postResponse,
    IsLoading: state.loading.loadingHoliday,
    Error: state.error.errorHoliday,

    PostHoliday: state.postHoliday,
    PostHolidaySuccess: state.postHolidaySuccess,
    PostHolidayFail: state.postHolidayFail,

    // EmptyResponse: state.emptyResponse,
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
    PostHoliday(true);

    handlePostResult(data);
  };

  const handlePostResult = async (data: Holiday) => {
    const { error, result } = await postEmpMonitoring('/holidays', data);

    if (error) {
      // request is done so set loading to false
      PostHoliday(false);

      // set value for error message
      PostHolidayFail(false, result);
    } else {
      // request is done so set loading to false
      PostHoliday(false);

      // set value from returned response
      PostHolidaySuccess(false, result);

      reset();
      closeModalAction();
      // EmptyResponse();
    }
  };

  return (
    <>
      {/* Notifications */}
      {!isEmpty(Error) ? (
        <ToastNotification toastType="error" notifMessage={Error} />
      ) : null}

      {!isEmpty(HolidayPostResponse) ? (
        <ToastNotification toastType="success" notifMessage="Sending Request" />
      ) : null}

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

            <form onSubmit={handleSubmit(onSubmit)}>
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

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 text-xs rounded-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddHolidayModal;
