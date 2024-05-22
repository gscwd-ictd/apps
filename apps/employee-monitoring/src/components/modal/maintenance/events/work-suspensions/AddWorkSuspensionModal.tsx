/* eslint-disable react-hooks/exhaustive-deps */
import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';

import { useWorkSuspensionStore } from 'apps/employee-monitoring/src/store/work-suspension.store';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { FormPostWorkSuspension } from 'apps/employee-monitoring/src/utils/types/work-suspension.type';

import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { isEmpty } from 'lodash';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const yupSchema = yup.object().shape({
  name: yup.string().nullable(false).required().label('Name'),
  suspensionDate: yup.string().nullable(false).required().label('Suspension Date'),
  suspensionHours: yup
    .number()
    .nullable(false)
    .required()
    .label('Suspension Hours')
    .test('is-valid-hours', 'Suspension hours must be less than or equal to 9', (value) => {
      if (value) {
        const hours = value;
        return hours <= 9;
      }
      return true;
    }),
});

const AddWorkSuspensionModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction }) => {
  const {
    PostWorkSuspension,
    SetPostWorkSuspension,

    ErrorWorkSuspension,
    SetErrorWorkSuspension,

    EmptyResponse,
  } = useWorkSuspensionStore((state) => ({
    PostWorkSuspension: state.postWorkSuspension,
    SetPostWorkSuspension: state.setPostWorkSuspension,

    ErrorWorkSuspension: state.errorWorkSuspension,
    SetErrorWorkSuspension: state.setErrorWorkSuspension,

    EmptyResponse: state.emptyResponse,
  }));

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting: postFormLoading },
  } = useForm<FormPostWorkSuspension>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      suspensionDate: '',
      suspensionHours: 0,
      app: 'ems',
    },
    resolver: yupResolver(yupSchema),
  });

  const onSubmit: SubmitHandler<FormPostWorkSuspension> = (data: FormPostWorkSuspension) => {
    EmptyResponse();
    handlePostResult(data);
  };

  const handlePostResult = async (data: FormPostWorkSuspension) => {
    const { error, result } = await postEmpMonitoring('/work-suspension', data);

    if (error) {
      // set value for error message
      SetErrorWorkSuspension(result);
    } else {
      // set value from returned response
      SetPostWorkSuspension(result);
      reset();
      closeModalAction();
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
      {!isEmpty(PostWorkSuspension) ? (
        <ToastNotification toastType="success" notifMessage="Work suspension added successfully" />
      ) : null}

      {/* Errors */}
      {!isEmpty(ErrorWorkSuspension) ? (
        <ToastNotification toastType="error" notifMessage={ErrorWorkSuspension} />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">New Work Suspension</span>
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

          <form onSubmit={handleSubmit(onSubmit)} id="addWorkSuspension">
            <div className="flex flex-col w-full gap-5">
              {/* Name */}
              <LabelInput
                id={'name'}
                type="text"
                label={'Name'}
                controller={{ ...register('name') }}
                isError={errors.name ? true : false}
                errorMessage={errors.name?.message}
              />

              {/* Suspension Date */}
              <LabelInput
                id={'suspensionDate'}
                type="date"
                label={'Suspension Date'}
                controller={{ ...register('suspensionDate') }}
                isError={errors.suspensionDate ? true : false}
                errorMessage={errors.suspensionDate?.message}
              />

              {/* Suspension Hours */}
              <LabelInput
                id={'suspensionHours'}
                type={'number'}
                label={'Suspension Hours'}
                controller={{ ...register('suspensionHours') }}
                isError={errors.suspensionHours ? true : false}
                errorMessage={errors.suspensionHours?.message}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addWorkSuspension"
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

export default AddWorkSuspensionModal;
