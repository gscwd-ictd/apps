/* eslint-disable react-hooks/exhaustive-deps */
import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useOfficerOfTheDayStore } from 'apps/employee-monitoring/src/store/officer-of-the-day.store';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { FormPostOfficerOfTheDay } from 'apps/employee-monitoring/src/utils/types/officer-of-the-day.type';
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { SelectListRF } from '../../../inputs/SelectListRF';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const yupSchema = yup.object().shape({
  employeeId: yup.string().nullable(false).required().label('Employee Name'),
  orgId: yup.string().nullable(false).required().label('Assignment Name'),
  dateFrom: yup.string().nullable(false).required().label('Date From'),
  dateTo: yup.string().nullable(false).required().label('Date To'),
});

const AddOfficerOfTheDayModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction }) => {
  const {
    GetEmployees,
    SetGetEmployees,

    GetAssignments,
    SetGetAssignments,

    PostOfficerOfTheDay,
    SetPostOfficerOfTheDay,

    ErrorOfficerOfTheDay,
    SetErrorOfficerOfTheDay,

    ErrorEmployees,
    SetErrorEmployees,

    ErrorAssignments,
    SetErrorAssignments,

    EmptyResponse,
  } = useOfficerOfTheDayStore((state) => ({
    GetEmployees: state.getEmployees,
    SetGetEmployees: state.setGetEmployees,

    GetAssignments: state.getAssignments,
    SetGetAssignments: state.setGetAssignments,

    PostOfficerOfTheDay: state.postOfficerOfTheDay,
    SetPostOfficerOfTheDay: state.setPostOfficerOfTheDay,

    ErrorOfficerOfTheDay: state.errorOfficerOfTheDay,
    SetErrorOfficerOfTheDay: state.setErrorOfficerOfTheDay,

    ErrorEmployees: state.errorEmployees,
    SetErrorEmployees: state.setErrorEmployees,

    ErrorAssignments: state.errorAssignments,
    SetErrorAssignments: state.setErrorAssignments,

    EmptyResponse: state.emptyResponse,
  }));

  // useSWR for employees
  const {
    data: swrEmployees,
    isLoading: swrEmployeesLoading,
    error: swrEmployeesError,
  } = useSWR(modalState ? `/officer-of-the-day/assignable/employee` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // useSWR for assignments
  const {
    data: swrAssignments,
    isLoading: swrAssignmentsLoading,
    error: swrAssignmentsError,
  } = useSWR(modalState ? `/officer-of-the-day/assignable/org` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!isEmpty(swrEmployees)) {
      SetGetEmployees(swrEmployees.data);
    }

    if (!isEmpty(swrEmployeesError)) {
      switch (swrEmployeesError?.response?.status) {
        case 400:
          SetErrorEmployees('Bad Request');
          break;
        case 401:
          SetErrorEmployees('Unauthorized');
          break;
        case 403:
          SetErrorEmployees('Forbidden');
          break;
        case 404:
          SetErrorEmployees('Employees Not Found');
          break;
        case 500:
          SetErrorEmployees('Internal Server Error');
          break;
        default:
          SetErrorEmployees('An error occurred. Please try again later.');
          break;
      }
    }
  }, [swrEmployees, swrEmployeesError]);

  useEffect(() => {
    if (!isEmpty(swrAssignments)) {
      SetGetAssignments(swrAssignments.data);
    }

    if (!isEmpty(swrAssignmentsError)) {
      switch (swrAssignmentsError?.response?.status) {
        case 400:
          SetErrorAssignments('Bad Request');
          break;
        case 401:
          SetErrorAssignments('Unauthorized');
          break;
        case 403:
          SetErrorAssignments('Forbidden');
          break;
        case 404:
          SetErrorAssignments('Assignments Not Found');
          break;
        case 500:
          SetErrorAssignments('Internal Server Error');
          break;
        default:
          SetErrorAssignments('An error occurred. Please try again later.');
          break;
      }
    }
  }, [swrAssignments, swrAssignmentsError]);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting: postFormLoading },
  } = useForm<FormPostOfficerOfTheDay>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      employeeId: '',
      orgId: '',
      dateFrom: '',
      dateTo: '',
      app: 'ems',
    },
    resolver: yupResolver(yupSchema),
  });

  const onSubmit: SubmitHandler<FormPostOfficerOfTheDay> = (data: FormPostOfficerOfTheDay) => {
    EmptyResponse();
    handlePostResult(data);
  };

  const handlePostResult = async (data: FormPostOfficerOfTheDay) => {
    const { error, result } = await postEmpMonitoring('/officer-of-the-day', data);

    if (error) {
      // set value for error message
      SetErrorOfficerOfTheDay('An error occurred. Please try again later.');
    } else {
      // set value from returned response
      SetPostOfficerOfTheDay(result);
      closeModalAction();
      reset();
    }
  };

  // If modal is open, reset input values
  useEffect(() => {
    if (!modalState) {
      reset();
    }
  }, [modalState]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(PostOfficerOfTheDay) ? (
        <ToastNotification toastType="success" notifMessage="Officer of the day added successfully" />
      ) : null}

      {/* Errors */}
      {!isEmpty(ErrorOfficerOfTheDay) ? (
        <ToastNotification toastType="error" notifMessage={ErrorOfficerOfTheDay} />
      ) : null}
      {!isEmpty(ErrorEmployees) ? <ToastNotification toastType="error" notifMessage={ErrorEmployees} /> : null}
      {!isEmpty(ErrorAssignments) ? <ToastNotification toastType="error" notifMessage={ErrorAssignments} /> : null}

      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">New Officer Of The Day</span>
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
          {/* Notifications */}
          {postFormLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="addOfficerOfTheDay">
            <div className="flex flex-col w-full gap-5">
              {/** Employee Select*/}
              {swrEmployeesLoading ? (
                <LoadingSpinner size="xs" />
              ) : (
                <SelectListRF
                  id={'employeeId'}
                  selectList={GetEmployees}
                  controller={{ ...register('employeeId') }}
                  label={'Employee Name'}
                  isError={errors.employeeId ? true : false}
                  errorMessage={errors.employeeId?.message}
                ></SelectListRF>
              )}

              {/** Assignment Select*/}
              {swrAssignmentsLoading ? (
                <LoadingSpinner size="xs" />
              ) : (
                <SelectListRF
                  id={'orgId'}
                  selectList={GetAssignments}
                  controller={{ ...register('orgId') }}
                  label={'Assignment Name'}
                  isError={errors.orgId ? true : false}
                  errorMessage={errors.orgId?.message}
                ></SelectListRF>
              )}

              {/** Date From */}
              <LabelInput
                id={'dateFrom'}
                type="date"
                label={'Date From'}
                controller={{ ...register('dateFrom') }}
                isError={errors.dateFrom ? true : false}
                errorMessage={errors.dateFrom?.message}
              />

              {/** Date To */}
              <LabelInput
                id={'dateTo'}
                type="date"
                label={'Date To'}
                controller={{ ...register('dateTo') }}
                isError={errors.dateTo ? true : false}
                errorMessage={errors.dateTo?.message}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addOfficerOfTheDay"
              className="disabled:cursor-not-allowed"
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

export default AddOfficerOfTheDayModal;
