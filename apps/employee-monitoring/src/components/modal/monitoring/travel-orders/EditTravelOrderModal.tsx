/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState, Fragment } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import useSWR from 'swr';
import { putEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { FormTravelOrder, TravelOrder } from 'libs/utils/src/lib/types/travel-order.type';
import { useTravelOrderStore } from 'apps/employee-monitoring/src/store/travel-order.store';
import { useEmployeeStore } from 'apps/employee-monitoring/src/store/employee.store';

import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import ConvertFullMonthNameToDigit from 'apps/employee-monitoring/src/utils/functions/ConvertFullMonthNameToDigit';
import { SelectListRF } from '../../../inputs/SelectListRF';
import fetcherHRMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherHRMS';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: TravelOrder;
};

enum TravelOrderKeys {
  TRAVEL_NO = 'travelOrderNo',
  EMPLOYEE = 'employee',
  PURPOSE_OF_TRAVEL = 'purposeOfTravel',
  DATE_FROM = 'dateFrom',
  DATE_TO = 'dateTo',
  DATE_REQUESTED = 'dateRequested',
  ITINERARY = 'itinerary',
}

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

const EditTravelOrderModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // fetch data for list of employees
  const {
    data: employees,
    error: employeesError,
    isLoading: employeesLoading,
  } = useSWR(modalState ? '/employees/options/v2' : null, fetcherHRMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // zustand store initialization for travel order
  const { SetUpdateTravelOrder, SetErrorTravelOrder, EmptyResponse } = useTravelOrderStore((state) => ({
    SetUpdateTravelOrder: state.setUpdateTravelOrder,
    SetErrorTravelOrder: state.setErrorTravelOrder,
    EmptyResponse: state.emptyResponse,
  }));

  // zustand initialization for employees
  const { EmployeeOptions, SetEmployeeOptions } = useEmployeeStore((state) => ({
    EmployeeOptions: state.employeeOptions,
    SetEmployeeOptions: state.setEmployeeOptions,
  }));

  // React hook form
  const {
    reset,
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting: patchFormLoading },
  } = useForm<FormTravelOrder>({
    mode: 'onChange',
    resolver: yupResolver(yupSchema),
  });

  // dynamic fields in the itinerary
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itinerary',
  });

  // form submission
  const onSubmit: SubmitHandler<FormTravelOrder> = (data: FormTravelOrder) => {
    EmptyResponse();

    handlePatchResult(data);
  };

  const handlePatchResult = async (data: FormTravelOrder) => {
    const { error, result } = await putEmpMonitoring('/travel-order', data);

    if (error) {
      SetErrorTravelOrder(result);
    } else {
      SetUpdateTravelOrder(result);

      reset();
      closeModalAction();
    }
  };

  // If modal is open, set action to fetch for employee list
  useEffect(() => {
    if (!modalState) {
      reset();
    }
  }, [modalState]);

  // Upon success of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(employees)) {
      SetEmployeeOptions(employees.data);
    }
  }, [employees]);

  // Set default values in the form
  useEffect(() => {
    if (modalState === true && !isEmpty(rowData) && !isEmpty(EmployeeOptions)) {
      const keys = Object.keys(rowData);

      // traverse to each object and setValue
      keys.forEach((key: TravelOrderKeys) => {
        if (key === 'employee') {
          setValue('employeeId', rowData[key].employeeId, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else if (key === 'dateFrom') {
          setValue('dateFrom', ConvertFullMonthNameToDigit(rowData[key]));
        } else if (key === 'dateTo') {
          setValue('dateTo', ConvertFullMonthNameToDigit(rowData[key]));
        } else if (key === 'dateRequested') {
          setValue('dateRequested', ConvertFullMonthNameToDigit(rowData[key]));
        } else {
          setValue(key, rowData[key], {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });
    }
  }, [EmployeeOptions]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">Edit Travel Order</span>
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
            {patchFormLoading ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={false}
              />
            ) : null}

            {employeesError ? (
              <AlertNotification alertType="info" notifMessage={employeesError} dismissible={true} />
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} id="editTravelOrderForm">
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

                {/* Date Requested */}
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
                {/* Employee */}
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
                    disabled={employeesLoading}
                    isLoading={employeesLoading}
                  />
                </div>

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

              <div className="grid md:grid-cols-2 md:gap-6">
                {/* Date From*/}
                <div className="mb-6">
                  <LabelInput
                    id={'dateFrom'}
                    label={'Date From'}
                    type="date"
                    controller={{ ...register('dateFrom') }}
                    isError={errors.dateFrom ? true : false}
                    errorMessage={errors.dateFrom?.message}
                    disabled={true}
                  />
                </div>

                {/* Date To*/}
                <div className="mb-6">
                  <LabelInput
                    id={'dateTo'}
                    label={'Date To'}
                    type="date"
                    controller={{ ...register('dateTo') }}
                    isError={errors.dateTo ? true : false}
                    errorMessage={errors.dateTo?.message}
                    disabled={true}
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

                      {/* Add or Remove button */}
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
              form="editTravelOrderForm"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
              disabled={patchFormLoading ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditTravelOrderModal;
