/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { useHolidaysStore } from 'apps/employee-monitoring/src/store/holidays.store';
import ConvertFullMonthNameToDigit from 'apps/employee-monitoring/src/utils/functions/ConvertFullMonthNameToDigit';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Holiday } from '../../../../../../src/utils/types/holiday.type';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Holiday;
};

type Item = {
  label: string;
  value: any;
};

enum HolidayKeys {
  ID = 'id',
  NAME = 'name',
  HOLIDAYDATE = 'holidayDate',
  TYPE = 'type',
}

const holidayTypesSelection: Array<SelectOption> = [
  { label: 'Regular', value: 'regular' },
  { label: 'Special', value: 'special' },
];

const EditHolidayModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    IsLoading,

    UpdateHoliday,
    UpdateHolidaySuccess,
    UpdateHolidayFail,
  } = useHolidaysStore((state) => ({
    IsLoading: state.loading.loadingHoliday,

    UpdateHoliday: state.updateHoliday,
    UpdateHolidaySuccess: state.updateHolidaySuccess,
    UpdateHolidayFail: state.updateHolidayFail,
  }));

  // React hook form
  const { reset, register, setValue, handleSubmit } = useForm<Holiday>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<Holiday> = (data: Holiday) => {
    // set loading to true
    UpdateHoliday(true);

    handlePostResult(data);
  };

  const handlePostResult = async (data: Holiday) => {
    const { error, result } = await patchEmpMonitoring('/holidays', data);

    if (error) {
      // request is done so set loading to false
      UpdateHoliday(false);

      // set value for error message
      UpdateHolidayFail(false, result);
    } else {
      // request is done so set loading to false
      UpdateHoliday(false);

      // set value from returned response
      UpdateHolidaySuccess(false, result);

      reset();
      closeModalAction();
    }
  };

  // Set default values in the form
  useEffect(() => {
    if (!isEmpty(rowData)) {
      const keys = Object.keys(rowData);

      // traverse to each object and setValue
      keys.forEach((key: HolidayKeys) => {
        if (key === 'holidayDate') {
          setValue(key, ConvertFullMonthNameToDigit(rowData[key]), {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else {
          setValue(key, rowData[key], {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });
    }
  }, [rowData]);

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

            <form onSubmit={handleSubmit(onSubmit)} id="editHolidayForm">
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
              form="editHolidayForm"
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

export default EditHolidayModal;
