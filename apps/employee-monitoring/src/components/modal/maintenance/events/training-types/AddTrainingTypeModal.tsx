import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { TrainingType } from 'libs/utils/src/lib/types/training-type.type';
import { useTrainingTypesStore } from 'apps/employee-monitoring/src/store/training-type.store';

import {
  Modal,
  AlertNotification,
  LoadingSpinner,
  Button,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const AddTrainingTypeModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  // zustand store initialization
  const {
    IsLoading,

    PostTrainingType,
    PostTrainingTypeSuccess,
    PostTrainingTypeFail,
  } = useTrainingTypesStore((state) => ({
    IsLoading: state.loading.loadingTrainingType,

    PostTrainingType: state.postTrainingType,
    PostTrainingTypeSuccess: state.postTrainingTypeSuccess,
    PostTrainingTypeFail: state.postTrainingTypeFail,
  }));

  // yup error handling initialization
  const yupSchema = yup
    .object({
      name: yup.string().required('Training type name is required'),
    })
    .required();

  // React hook form
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrainingType>({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<TrainingType> = (data: TrainingType) => {
    // set loading to true
    PostTrainingType();

    handlePostResult(data);
  };

  const handlePostResult = async (data: TrainingType) => {
    const { error, result } = await postEmpMonitoring(
      '/trainings-seminars-types',
      data
    );

    if (error) {
      PostTrainingTypeFail(result);
    } else {
      PostTrainingTypeSuccess(result);

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
            <span className="text-xl text-gray-600"></span>
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

            <form onSubmit={handleSubmit(onSubmit)} id="addTrainingTypeForm">
              {/* Training Type name input */}
              <div className="mb-6">
                <LabelInput
                  id={'trainingTypeName'}
                  label={'Training Type Name'}
                  controller={{ ...register('name') }}
                  isError={errors.name ? true : false}
                  errorMessage={errors.name?.message}
                />
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
              form="addTrainingTypeForm"
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

export default AddTrainingTypeModal;
