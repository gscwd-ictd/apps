/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { CustomGroup } from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import { Modal, AlertNotification, LoadingSpinner, Button } from '@gscwd-apps/oneui';
import { LabelInput } from '../../../inputs/LabelInput';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// yup error handling initialization
const yupSchema = yup
  .object({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
  })
  .required();

const AddCustomGroupModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction }) => {
  // zustand store initialization for travel order
  const {
    IsLoading,

    PostCustomGroup,
    PostCustomGroupSuccess,
    PostCustomGroupFail,
  } = useCustomGroupStore((state) => ({
    IsLoading: state.loading.loadingCustomGroup,

    PostCustomGroup: state.postCustomGroup,
    PostCustomGroupSuccess: state.postCustomGroupSuccess,
    PostCustomGroupFail: state.postCustomGroupFail,
  }));

  // React hook form
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomGroup>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<CustomGroup> = (data: CustomGroup) => {
    // set loading to true
    PostCustomGroup();

    handlePostResult(data);
  };

  const handlePostResult = async (data: CustomGroup) => {
    const { error, result } = await postEmpMonitoring('/custom-groups', data);

    if (error) {
      // request is done so set loading to false
      PostCustomGroupFail(result);
    } else {
      // request is done so set loading to false
      PostCustomGroupSuccess(result);

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
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">New Custom Group</span>
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

            <form onSubmit={handleSubmit(onSubmit)} id="addCustomGroupForm">
              {/* Name input */}
              <div className="mb-6">
                <LabelInput
                  id={'name'}
                  label={'Group Name'}
                  controller={{ ...register('name') }}
                  isError={errors.name ? true : false}
                  errorMessage={errors.name?.message}
                />
              </div>

              {/* Description input */}
              <div className="mb-6">
                <LabelInput
                  id={'description'}
                  label={'Group Function'}
                  type="textarea"
                  controller={{ ...register('description') }}
                  isError={errors.description ? true : false}
                  errorMessage={errors.description?.message}
                  rows={5}
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
              form="addCustomGroupForm"
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

export default AddCustomGroupModal;
