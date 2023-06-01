/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState, Fragment } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import {
  getEmpMonitoring,
  postEmpMonitoring,
} from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { TravelOrder } from 'libs/utils/src/lib/types/travel-order.type';
import {
  EmployeeAsOption,
  EmployeeProfile,
} from 'libs/utils/src/lib/types/employee.type';
import { useTravelOrderStore } from 'apps/employee-monitoring/src/store/travel-order.store';
import { useEmployeeStore } from 'apps/employee-monitoring/src/store/employee.store';

import {
  Modal,
  AlertNotification,
  LoadingSpinner,
  Button,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { LabelInput } from '../../../inputs/LabelInput';
import {
  getHRIS,
  postHRIS,
} from 'apps/employee-monitoring/src/utils/helper/hris-axios-helper';
import Toggle from '../../../switch/Toggle';

// Mock data REMOVE later
const TypesMockData: Array<EmployeeAsOption> = [
  { employeeId: '001', fullName: 'Allyn Cubero' },
  { employeeId: '002', fullName: 'Alexis Aponesto' },
  { employeeId: '003', fullName: 'Ricardo Vicente Supremo' },
  { employeeId: '004', fullName: 'Mikhail Sebua' },
  { employeeId: '005', fullName: 'Eric Sison' },
];

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

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

const AddTravelOrderModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
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

    PostTravelOrder,
    PostTravelOrderSuccess,
    PostTravelOrderFail,
  } = useTravelOrderStore((state) => ({
    IsLoading: state.loading.loadingTravelOrder,

    PostTravelOrder: state.postTravelOrder,
    PostTravelOrderSuccess: state.postTravelOrderSuccess,
    PostTravelOrderFail: state.postTravelOrderFail,
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

  // React hook form
  const {
    reset,
    register,
    control,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<TravelOrder>({
    mode: 'onChange',
    defaultValues: {
      travelOrderNo: '',
      isPtrRequired: false,
      dateRequested: '',
      itinerary: [{ scheduleDate: '', schedulePlace: '' }],
    },
    resolver: yupResolver(yupSchema),
  });

  // filter employee list based on query value
  const filteredEmployee =
    employeeQuery === ''
      ? EmployeeAsOptions
      : // ? EmployeeAsOptions
        EmployeeAsOptions.filter((employee) =>
          // : EmployeeAsOptions.filter((employee) =>
          employee.fullName
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(employeeQuery.toLowerCase().replace(/\s+/g, ''))
        );

  // dynamic fields in the itinerary
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itinerary',
  });

  // form submission
  const onSubmit: SubmitHandler<TravelOrder> = (data: TravelOrder) => {
    // set loading to true
    PostTravelOrder();

    handlePostResult(data);
  };

  const handlePostResult = async (data: TravelOrder) => {
    const { error, result } = await postEmpMonitoring('/travel-order', data);

    if (error) {
      // request is done so set loading to false
      PostTravelOrderFail(result);
    } else {
      // request is done so set loading to false
      PostTravelOrderSuccess(result);

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

  useEffect(() => {
    setValue('isPtrRequired', isPtrRequired);
  }, [isPtrRequired]);

  return (
    <>
      {/* Error Notifications */}
      {!isEmpty(ErrorEAO) ? (
        <ToastNotification toastType="error" notifMessage={ErrorEAO} />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">Add Travel Order</span>
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

              {/* Employee select input */}
              {/* <div className="mb-6">
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
                          errors.employeeId
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
                      <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-30 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                                        active ? 'text-white' : 'text-blue-400'
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
                {errors.employeeId ? (
                  <div className="mt-1 text-xs text-red-400">
                    {errors.employeeId?.message}
                  </div>
                ) : null}
              </div> */}

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
              <div className="flex gap-2 text-start">
                <Toggle
                  labelPosition="top"
                  enabled={isPtrRequired}
                  setEnabled={setIsPtrRequired}
                  label={'Post-training report required: '}
                  disabled={IsLoading ? true : false}
                />
                <div
                  className={`text-xs ${
                    isPtrRequired ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {isPtrRequired ? (
                    <button
                      onClick={() => setIsPtrRequired((prev) => !prev)}
                      className="underline"
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
              form="addTravelForm"
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

export default AddTravelOrderModal;
