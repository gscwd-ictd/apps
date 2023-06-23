import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { Holiday } from 'apps/employee-monitoring/src/utils/types/holiday.type';
import { useHolidaysStore } from 'apps/employee-monitoring/src/store/holidays.store';

import {
  Modal,
  AlertNotification,
  LoadingSpinner,
  Button,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';

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

  // yup error handling initialization
  const yupSchema = yup
    .object({
      name: yup.string().required('Holiday name is required'),
      holidayDate: yup.string().required('Holiday date is required'),
      type: yup.string().required('Type of holiday is required'),
    })
    .required();

  // React hook form
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Holiday>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      holidayDate: '',
      type: '',
    },
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<Holiday> = (data: Holiday) => {
    PostHoliday();

    handlePostResult(data);
  };

  const handlePostResult = async (data: Holiday) => {
    const { error, result } = await postEmpMonitoring('/holidays', data);

    if (error) {
      PostHolidayFail(result);
    } else {
      PostHolidaySuccess(result);

      reset();
      closeModalAction();
    }
  };

  // Reset input value to empty every time that modal is closed
  useEffect(() => {
    if (!modalState) {
      reset();
    }
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">New Holiday</span>
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
                <LabelInput
                  id={'holidayName'}
                  label={'Holiday Name'}
                  controller={{ ...register('name') }}
                  isError={errors.name ? true : false}
                  errorMessage={errors.name?.message}
                />
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                {/* Holiday date input*/}
                <div className="mb-6">
                  <LabelInput
                    id={'holidayDate'}
                    label={'Date'}
                    type="date"
                    controller={{ ...register('holidayDate') }}
                    isError={errors.holidayDate ? true : false}
                    errorMessage={errors.holidayDate?.message}
                  />
                </div>

                {/* Holiday type input */}
                <div className="mb-6">
                  <SelectListRF
                    id="holidayLabel"
                    label="Type of Holiday"
                    selectList={holidayTypesSelection}
                    controller={{
                      ...register('type'),
                    }}
                    isError={errors.type ? true : false}
                    errorMessage={errors.type?.message}
                  />
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
