/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState, Fragment } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import {
  getEmpMonitoring,
  patchEmpMonitoring,
  putEmpMonitoring,
} from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { TravelOrder } from 'libs/utils/src/lib/types/travel-order.type';
import {
  EmployeeAsOption,
  EmployeeProfile,
} from 'libs/utils/src/lib/types/employee.type';
import { useTravelOrderStore } from 'apps/employee-monitoring/src/store/travel-order.store';
import { useEmployeeStore } from 'apps/employee-monitoring/src/store/employee.store';

import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import ConvertFullMonthNameToDigit from 'apps/employee-monitoring/src/utils/functions/ConvertFullMonthNameToDigit';
import { getHRIS } from 'apps/employee-monitoring/src/utils/helper/hris-axios-helper';
import Toggle from '../../../switch/Toggle';

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
  IS_PTR_REQUIRED = 'isPtrRequired',
}

// yup error handling initialization
const yupSchema = yup
  .object({
    travelOrderNo: yup.string().required('Travel Order No is required'),
    employee: yup
      .object()
      .shape({ employeeId: yup.string().required('Employee is required') }),
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
  // selected employee from combobox option
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeAsOption>(
    {} as EmployeeAsOption
  );
  // value from combobox input
  const [employeeQuery, setEmployeeQuery] = useState('');

  const [isPtrRequired, setIsPtrRequired] = useState<boolean>(false);

  // zustand store initialization for travel order
  const {
    IsLoading,

    UpdateTravelOrder,
    UpdateTravelOrderSuccess,
    UpdateTravelOrderFail,
  } = useTravelOrderStore((state) => ({
    IsLoading: state.loading.loadingTravelOrder,
    UpdateTravelOrder: state.updateTravelOrder,
    UpdateTravelOrderSuccess: state.updateTravelOrderSuccess,
    UpdateTravelOrderFail: state.updateTravelOrderFail,
  }));

  // zustand initialization for employee
  const {
    EmployeeAsOptions,
    IsLoadingEAO,
    ErrorEAO,

    GetEmployeeAsOptions,
    GetEmployeeAsOptionsSuccess,
    GetEmployeeAsOptionsFail,
  } = useEmployeeStore((state) => ({
    EmployeeAsOptions: state.employeeAsOptions,
    IsLoadingEAO: state.loading.loadingEmployeeAsOptions,
    ErrorEAO: state.error.errorEmployeeAsOptions,

    GetEmployeeAsOptions: state.getEmployeeAsOptions,
    GetEmployeeAsOptionsSuccess: state.getEmployeeAsOptionsSuccess,
    GetEmployeeAsOptionsFail: state.getEmployeeAsOptionsFail,
  }));

  // filter employee list based on query value
  const filteredEmployee =
    employeeQuery === ''
      ? EmployeeAsOptions
      : EmployeeAsOptions.filter((employee) =>
          employee.fullName
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(employeeQuery.toLowerCase().replace(/\s+/g, ''))
        );

  // React hook form
  const {
    reset,
    register,
    control,
    setValue,
    handleSubmit,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<TravelOrder>({
    mode: 'onChange',
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
    UpdateTravelOrder();

    handlePatchResult(data);
  };

  const handlePatchResult = async (data: TravelOrder) => {
    const { error, result } = await putEmpMonitoring('/travel-order', data);

    if (error) {
      UpdateTravelOrderFail(result);
    } else {
      UpdateTravelOrderSuccess(result);

      reset();
      closeModalAction();
    }
  };

  // asynchronous request to fetch employee list
  const fetchEmployeeList = async () => {
    const { error, result } = await getHRIS('/employees');

    if (error) {
      GetEmployeeAsOptionsFail(result);
    } else {
      const employeesDetails: Array<EmployeeAsOption> = result.map(
        (employeeDetails: EmployeeProfile) => {
          const { employmentDetails, personalDetails } = employeeDetails;

          return {
            employeeId: employmentDetails.employeeId,
            fullName: personalDetails.fullName,
            assignment: employmentDetails.assignment,
            positionTitle: employmentDetails.positionTitle,
          };
        }
      );

      GetEmployeeAsOptionsSuccess(employeesDetails);
    }
  };

  // If modal is open, set action to fetch for employee list
  useEffect(() => {
    if (modalState) {
      fetchEmployeeList();
      GetEmployeeAsOptions();
    } else {
      reset();
      setSelectedEmployee({} as EmployeeAsOption);
    }
  }, [modalState]);

  // Set employeeId value upon change on selectedEmployee state
  useEffect(() => {
    if (!isEmpty(selectedEmployee)) {
      setValue('employee.employeeId', selectedEmployee.employeeId);
      setValue('employee.fullName', selectedEmployee.fullName);

      clearErrors('employee');
    }
  }, [selectedEmployee]);

  // Set value if ptr is required
  useEffect(() => {
    setValue('isPtrRequired', isPtrRequired);
  }, [isPtrRequired]);

  // Set default values in the form
  useEffect(() => {
    if (modalState === true && !isEmpty(rowData)) {
      const keys = Object.keys(rowData);

      // traverse to each object and setValue
      keys.forEach((key: TravelOrderKeys) => {
        if (key === 'employee') {
          setValue('employee.employeeId', rowData[key].employeeId, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue('employee.fullName', rowData[key].fullName, {
            shouldValidate: true,
            shouldDirty: true,
          });

          // set local state of select field
          setSelectedEmployee(rowData[key]);
        } else if (key === 'dateFrom') {
          setValue('dateFrom', ConvertFullMonthNameToDigit(rowData[key]));
        } else if (key === 'dateTo') {
          setValue('dateTo', ConvertFullMonthNameToDigit(rowData[key]));
        } else if (key === 'dateRequested') {
          setValue('dateRequested', ConvertFullMonthNameToDigit(rowData[key]));
        } else if (key === 'isPtrRequired') {
          setValue('isPtrRequired', Boolean(rowData[key]));
          setIsPtrRequired(Boolean(rowData[key]));
        } else {
          setValue(key, rowData[key], {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });
    }
  }, [rowData, modalState]);

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
            {IsLoading ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={true}
              />
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
                {/** Employee */}
                <div className="z-20 mb-6">
                  <label
                    htmlFor="countries"
                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-800"
                  >
                    Employee
                  </label>
                  <Combobox
                    value={selectedEmployee}
                    onChange={setSelectedEmployee}
                    disabled={IsLoadingEAO ? true : false}
                  >
                    <div className="relative mt-1">
                      <div className="relative w-full overflow-hidden text-left bg-white rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                          className={`rounded-lg disabled:hover:cursor-not-allowed w-full outline-none sm:text-xs text-sm text-gray-900 h-[2.5rem]
                        block p-2.5
                        bg-gray-50 border ${
                          errors.employee
                            ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                            : ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                          displayValue={(selectedEmployee: EmployeeAsOption) =>
                            selectedEmployee.fullName
                          }
                          onChange={(event) => {
                            setEmployeeQuery(event.target.value);
                          }}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          {IsLoadingEAO ? (
                            <LoadingSpinner size="xs" />
                          ) : (
                            <ChevronDownIcon
                              className="w-5 h-5 text-gray-400"
                              aria-hidden="true"
                            />
                          )}
                        </Combobox.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setEmployeeQuery('')}
                      >
                        <Combobox.Options
                          className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-30 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
                        max-h-[14rem]"
                        >
                          {filteredEmployee.length === 0 &&
                          employeeQuery !== '' ? (
                            <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                              Nothing found.
                            </div>
                          ) : (
                            filteredEmployee.map((employee) => (
                              <Combobox.Option
                                key={employee.employeeId}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? 'bg-gray-500 text-white'
                                      : 'text-gray-900'
                                  }`
                                }
                                value={employee}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'text-sm' : 'text-xs'
                                      }`}
                                    >
                                      {employee.fullName}
                                    </span>

                                    {selected ? (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active
                                            ? 'text-white'
                                            : 'text-blue-400'
                                        }`}
                                      >
                                        <CheckIcon
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>
                  {errors.employee ? (
                    <div className="mt-1 text-xs text-red-400">
                      {errors.employee?.message}
                    </div>
                  ) : null}
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
                <label className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-800">
                  Itinerary
                </label>
                {fields.map((item, index) => {
                  return (
                    <div
                      className="grid pb-1 md:grid-cols-11 md:gap-3"
                      key={item.id}
                    >
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
                        <Button
                          variant="danger"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <i className="bx bx-minus"></i>
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* IS PTR Required */}
              <div className="flex items-center gap-2 mb-6 text-start">
                <Toggle
                  labelPosition="right"
                  enabled={isPtrRequired}
                  setEnabled={setIsPtrRequired}
                  label={'Post-training report required: '}
                  disabled={IsLoading ? true : false}
                />
                <div
                  className={`text-xs items-center ${
                    isPtrRequired ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {isPtrRequired ? (
                    <button
                      onClick={() => setIsPtrRequired((prev) => !prev)}
                      className="underline "
                      type="button"
                      disabled={IsLoading ? true : false}
                    >
                      <span>Yes</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsPtrRequired((prev) => !prev)}
                      className="underline"
                      type="button"
                      disabled={IsLoading ? true : false}
                    >
                      <span>No</span>
                    </button>
                  )}
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
              form="editTravelOrderForm"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
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

export default EditTravelOrderModal;
