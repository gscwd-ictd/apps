/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState, Fragment } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { TravelOrder } from 'libs/utils/src/lib/types/travel-order.type';
import { EmployeeOption, EmployeeProfile } from 'libs/utils/src/lib/types/employee.type';
import { useTravelOrderStore } from 'apps/employee-monitoring/src/store/travel-order.store';
import { useEmployeeStore } from 'apps/employee-monitoring/src/store/employee.store';

import { Modal, AlertNotification, LoadingSpinner, Button, ToastNotification } from '@gscwd-apps/oneui';
import { LabelInput } from '../../../inputs/LabelInput';
import { getHRIS, postHRIS } from 'apps/employee-monitoring/src/utils/helper/hris-axios-helper';
import { SelectListRF } from '../../../inputs/SelectListRF';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// yup error handling initialization
const yupSchema = yup
  .object({
    travelOrderNo: yup.string().required('Travel Order No is required'),
    employeeId: yup.string().required('Employee is required'),
    dateRequested: yup.string().required('Date requested is required'),
    itinerary: yup.array().of(
      yup.object().shape({
        scheduleDate: yup.string().required('Date of visit is required'),
        schedulePlace: yup.string().required('Place of visit is required'),
      })
    ),
  })
  .required();

const AddTravelOrderModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction }) => {
  const [isLoadingEmployeeOptions, setIsLoadingEmployeeOptions] = useState<boolean>(false);

  // zustand store initialization for travel order
  const {
    SetPostTravelOrder,

    SetErrorTravelOrder,

    EmptyResponse,
  } = useTravelOrderStore((state) => ({
    SetPostTravelOrder: state.setPostTravelOrder,

    SetErrorTravelOrder: state.setErrorTravelOrder,

    EmptyResponse: state.emptyResponse,
  }));

  // zustand initialization for employees
  const {
    EmployeeOptions,
    SetEmployeeOptions,

    ErrorEmployeeOptions,
    SetErrorEmployeeOptions,
  } = useEmployeeStore((state) => ({
    EmployeeOptions: state.employeeOptions,
    SetEmployeeOptions: state.setEmployeeOptions,

    ErrorEmployeeOptions: state.errorEmployeeOptions,
    SetErrorEmployeeOptions: state.setErrorEmployeeOptions,
  }));

  // React hook form
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting: postFormLoading },
  } = useForm<TravelOrder>({
    mode: 'onChange',
    defaultValues: {
      travelOrderNo: '',
      employeeId: '',
      dateRequested: '',
      itinerary: [{ scheduleDate: '', schedulePlace: '' }],
    },
    resolver: yupResolver(yupSchema),
  });

  // dynamic fields in the itinerary
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itinerary',
  });

  // form submission
  const onSubmit: SubmitHandler<TravelOrder> = (data: TravelOrder) => {
    // set loading to true
    EmptyResponse();

    handlePostResult(data);
  };

  const handlePostResult = async (data: TravelOrder) => {
    const { error, result } = await postEmpMonitoring('/travel-order', data);

    if (error) {
      SetErrorTravelOrder(result);
    } else {
      SetPostTravelOrder(result);

      reset();
      closeModalAction();
    }
  };

  // asynchronous request to fetch employee list
  const fetchEmployeeList = async () => {
    const { error, result } = await getHRIS(`/employees/options`);
    setIsLoadingEmployeeOptions(true);

    if (error) {
      SetErrorEmployeeOptions(result);
      setIsLoadingEmployeeOptions(false);
    } else {
      SetEmployeeOptions(result);
      setIsLoadingEmployeeOptions(false);
    }
  };

  // If modal is open, set action to fetch for employee list
  useEffect(() => {
    if (modalState) {
      fetchEmployeeList();
    } else {
      reset();
    }
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">New Travel Order</span>
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
            {postFormLoading ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={true}
              />
            ) : null}

            {ErrorEmployeeOptions ? (
              <AlertNotification alertType="info" notifMessage={ErrorEmployeeOptions} dismissible={true} />
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} id="addTravelForm">
              <div className="grid md:grid-cols-2 md:gap-6">
                {/* Travel order no input */}
                <div className="mb-6">
                  <LabelInput
                    id={'travelOrderNo'}
                    label={'Travel Order No.'}
                    controller={{ ...register('travelOrderNo') }}
                    isError={errors.travelOrderNo ? true : false}
                    errorMessage={errors.travelOrderNo?.message}
                  />
                </div>

                {/* Date requested input */}
                <div className="mb-6">
                  <LabelInput
                    id={'dateRequested'}
                    label={'Date Requested'}
                    type="date"
                    controller={{ ...register('dateRequested') }}
                    isError={errors.dateRequested ? true : false}
                    errorMessage={errors.dateRequested?.message}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                {/** Employee */}
                <div className="z-20 mb-6">
                  <SelectListRF
                    id="employeeId"
                    selectList={EmployeeOptions}
                    controller={{
                      ...register('employeeId'),
                    }}
                    label="Employee"
                    isError={errors.employeeId ? true : false}
                    errorMessage={errors.employeeId?.message}
                    disabled={isLoadingEmployeeOptions}
                    isLoading={isLoadingEmployeeOptions}
                  />
                </div>

                {/* Purpose of Travel*/}
                <div className="mb-6">
                  <LabelInput
                    id={'purposeOfTravel'}
                    label={'Purpose of Travel'}
                    type="text"
                    controller={{ ...register('purposeOfTravel') }}
                    isError={errors.purposeOfTravel ? true : false}
                    errorMessage={errors.purposeOfTravel?.message}
                  />
                </div>
              </div>

              {/* Itinerary dynamic fields */}
              <div className="mb-6">
                <label className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-800">Itinerary</label>
                {fields.map((item, index) => {
                  return (
                    <div className="grid pb-1 md:grid-cols-11 md:gap-3" key={item.id}>
                      <div className="col-span-5">
                        <input
                          type="date"
                          className={`rounded-lg disabled:hover:cursor-not-allowed w-full outline-none sm:text-xs text-sm text-gray-900 h-[2.5rem]
                          block p-2.5
                          bg-gray-50 border ${
                            errors?.itinerary?.[index]?.scheduleDate
                              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                              : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                          }`}
                          {...register(`itinerary.${index}.scheduleDate`)}
                        />
                        {errors?.itinerary?.[index]?.scheduleDate ? (
                          <div className="mt-1 text-xs text-red-400">
                            {errors?.itinerary?.[index]?.scheduleDate?.message}
                          </div>
                        ) : null}
                      </div>

                      <div className="col-span-5">
                        <input
                          type="text"
                          className={`col-span-5 rounded-lg disabled:hover:cursor-not-allowed w-full outline-none sm:text-xs text-sm text-gray-900 h-[2.5rem]
                        block p-2.5
                        bg-gray-50 border ${
                          errors?.itinerary?.[index]?.schedulePlace
                            ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                            : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                          placeholder="Place"
                          {...register(`itinerary.${index}.schedulePlace`)}
                        />

                        {errors?.itinerary?.[index]?.schedulePlace ? (
                          <div className="mt-1 text-xs text-red-400">
                            {errors?.itinerary?.[index]?.schedulePlace?.message}
                          </div>
                        ) : null}
                      </div>

                      {index === 0 ? (
                        <Button
                          variant="info"
                          type="button"
                          onClick={() => {
                            append({ scheduleDate: '', schedulePlace: '' });
                          }}
                        >
                          <i className="bx bx-plus"></i>
                        </Button>
                      ) : (
                        <Button variant="danger" type="button" onClick={() => remove(index)}>
                          <i className="bx bx-minus"></i>
                        </Button>
                      )}
                    </div>
                  );
                })}
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
              form="addTravelForm"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
              disabled={postFormLoading ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddTravelOrderModal;
