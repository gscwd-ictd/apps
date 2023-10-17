/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState, Fragment } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { getHRMS } from 'apps/employee-monitoring/src/utils/helper/hrms-axios-helper';

import { useEmployeeStore } from 'apps/employee-monitoring/src/store/employee.store';
import { useOrganizationStructureStore } from 'apps/employee-monitoring/src/store/organization-structure.store';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime.store';

import { Modal, AlertNotification, LoadingSpinner, Button, ToastNotification } from '@gscwd-apps/oneui';
import { PostImmediateSupervisor } from 'libs/utils/src/lib/types/overtime.type';
import { SelectListRF } from '../../../inputs/SelectListRF';
import fetcherHRMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherHRMS';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// yup error handling initialization
const yupSchema = yup
  .object({
    orgId: yup.string().required('Select an Office/Department/Division'),
    employeeId: yup.string().required('Select an Employee'),
  })
  .required();

const AddImmediateSupervisorModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  const [isLoadingEmployeeOptions, setIsLoadingEmployeeOptions] = useState<boolean>(false);

  // fetch data for list
  const {
    data: organizations,
    error: organizationsError,
    isLoading: organizationsLoading,
  } = useSWR('/organization/dropdown', fetcherHRMS, {
    shouldRetryOnError: true,
    revalidateOnFocus: false,
  });

  // zustand store initialization for organizations
  const {
    OrganizationOptions,
    SetOrganizationOptions,

    ErrorOrganizationOptions,
    SetErrorOrganizationOptions,
  } = useOrganizationStructureStore((state) => ({
    OrganizationOptions: state.organizationOptions,
    SetOrganizationOptions: state.setOrganizationOptions,

    ErrorOrganizationOptions: state.errorOrganizationOptions,
    SetErrorOrganizationOptions: state.setErrorOrganizationOptions,
  }));

  // zustand initialization for employees
  const {
    EmployeeOptions,
    SetEmployeeOptions,

    SetErrorEmployeeOptions,
  } = useEmployeeStore((state) => ({
    EmployeeOptions: state.employeeOptions,
    SetEmployeeOptions: state.setEmployeeOptions,

    SetErrorEmployeeOptions: state.setErrorEmployeeOptions,
  }));

  // zustand initialization for assigning of immediate supervisor for overtime application
  const {
    SetAssignImmediateSupervisor,

    SetErrorAssignImmediateSupervisor,

    EmptyResponse,
  } = useOvertimeStore((state) => ({
    SetAssignImmediateSupervisor: state.setAssignImmediateSupervisor,

    SetErrorAssignImmediateSupervisor: state.setErrorAssignImmediateSupervisor,

    EmptyResponse: state.emptyResponse,
  }));

  // React hook form
  const {
    reset,
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting: postFormLoading },
  } = useForm<PostImmediateSupervisor>({
    mode: 'onChange',
    defaultValues: {
      orgId: '',
      employeeId: '',
    },
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<PostImmediateSupervisor> = (data: PostImmediateSupervisor) => {
    EmptyResponse();

    handlePostResult(data);
  };

  const handlePostResult = async (data: PostImmediateSupervisor) => {
    const { error, result } = await postEmpMonitoring('/overtime-immediate-supervisor', data);

    if (error) {
      SetErrorAssignImmediateSupervisor(result);
    } else {
      SetAssignImmediateSupervisor(result);

      reset();
      closeModalAction();
    }
  };

  // asynchronous request to fetch employee list
  const fetchEmployeeList = async (orgId: string) => {
    const { error, result } = await getHRMS(`/employees/${orgId}/list`);
    setIsLoadingEmployeeOptions(true);

    if (error) {
      SetErrorEmployeeOptions(result);
      setIsLoadingEmployeeOptions(false);
    } else {
      SetEmployeeOptions(result);
      setIsLoadingEmployeeOptions(false);
    }
  };

  // set to zustand the state of options for organization
  useEffect(() => {
    if (!isEmpty(organizations)) {
      SetOrganizationOptions(organizations.data);
    }

    if (!isEmpty(organizationsError)) {
      SetErrorOrganizationOptions(organizationsError.message);
    }
  }, [organizations, organizationsError]);

  // If modal is closed, set action to clear responses and error
  useEffect(() => {
    if (!modalState) {
      reset();
    }
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">Assign Immediate Supervisor</span>
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

            {ErrorOrganizationOptions ? (
              <AlertNotification alertType="info" notifMessage={ErrorOrganizationOptions} dismissible={true} />
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} id="addImmediateSupervisorForm">
              <div className="grid">
                {/* Organization Assignment */}
                <div className="mb-6">
                  <SelectListRF
                    id="orgId"
                    selectList={OrganizationOptions}
                    controller={{
                      ...register('orgId', { onChange: (e) => fetchEmployeeList(e.target.value) }),
                    }}
                    label="Organization Assignment"
                    isError={errors.orgId ? true : false}
                    errorMessage={errors.orgId?.message}
                    disabled={organizationsLoading}
                    isLoading={organizationsLoading}
                  />
                </div>

                <div className="mb-6">
                  <SelectListRF
                    id="employeeId"
                    selectList={EmployeeOptions}
                    controller={{
                      ...register('employeeId'),
                    }}
                    label="Employees"
                    isError={errors.employeeId ? true : false}
                    errorMessage={errors.employeeId?.message}
                    disabled={isLoadingEmployeeOptions && isEmpty(getValues('orgId'))}
                    isLoading={isLoadingEmployeeOptions}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                {/* Travel order no input */}
                {/* <div className="mb-6">
                  <LabelInput
                    id={'travelOrderNo'}
                    label={'Travel Order No.'}
                    controller={{ ...register('travelOrderNo') }}
                    isError={errors.travelOrderNo ? true : false}
                    errorMessage={errors.travelOrderNo?.message}
                  />
                </div> */}

                {/* Date requested input */}
                {/* <div className="mb-6">
                  <LabelInput
                    id={'dateRequested'}
                    label={'Date Requested'}
                    type="date"
                    controller={{ ...register('dateRequested') }}
                    isError={errors.dateRequested ? true : false}
                    errorMessage={errors.dateRequested?.message}
                  />
                </div> */}
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
              form="addImmediateSupervisorForm"
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

export default AddImmediateSupervisorModal;
