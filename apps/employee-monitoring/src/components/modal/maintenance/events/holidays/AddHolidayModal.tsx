import { Modal, ToastNotification } from '@gscwd-apps/oneui';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { FunctionComponent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HolidayRowData } from '../../../../../utils/types/table-row-types/maintenance/holiday-row.type';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { isEmpty } from 'lodash';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorPostMessage, setErrorPostMessage] = useState<string>('');
  const [responsePost, setResponsePost] = useState<object>({});

  // React hook form
  const {
    setValue,
    watch,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HolidayRowData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      holidayDate: '',
      type: '',
    },
  });

  const onSubmit: SubmitHandler<HolidayRowData> = async (data) => {
    const { error, result } = await postEmpMonitoring('/holidays', data);

    // set loading to true
    setIsLoading(true);

    if (error) {
      // request is done so set loading to false
      setIsLoading(false);

      // empty the state to remove previous value
      setResponsePost(result);

      // set value for error message
      setErrorPostMessage(result);
    } else {
      // request is done so set loading to false
      setIsLoading(false);

      // empty the state to remove previous value
      setErrorPostMessage('');

      // set value from returned response
      setResponsePost(result);
    }
  };

  return (
    <>
      {/* Notification */}
      {!isEmpty(errorPostMessage) ? (
        <ToastNotification toastType="error" notifMessage={errorPostMessage} />
      ) : null}

      {!isEmpty(responsePost) ? (
        <ToastNotification
          toastType="success"
          notifMessage="Successfully added"
        />
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
