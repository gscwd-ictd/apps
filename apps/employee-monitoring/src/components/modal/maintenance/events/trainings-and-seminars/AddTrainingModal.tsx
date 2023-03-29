import {
  Modal,
  ToastNotification,
  AlertNotification,
  LoadingSpinner,
  Button,
} from '@gscwd-apps/oneui';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { isEmpty } from 'lodash';
import { useTrainingTypesStore } from 'apps/employee-monitoring/src/store/training-type.store';
import { Holiday } from 'apps/employee-monitoring/src/utils/types/holiday.type';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const AddTrainingModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  // zustand store initialization
  const {
    TrainingTypePostResponse,
    IsLoading,
    Error,

    postTrainingType,
    postTrainingTypeSuccess,
    postTrainingTypeFail,
  } = useTrainingTypesStore((state) => ({
    TrainingTypePostResponse: state.trainingType.postResponse,
    IsLoading: state.loading.loadingTrainingType,
    Error: state.error.errorTrainingType,

    postTrainingType: state.postTrainingType,
    postTrainingTypeSuccess: state.postTrainingTypeSuccess,
    postTrainingTypeFail: state.postTrainingTypeFail,
  }));

  // React hook form
  const { reset, register, handleSubmit } = useForm<Holiday>({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const onSubmit: SubmitHandler<Holiday> = (data: Holiday) => {
    // set loading to true
    postTrainingType(true);

    handlePostResult(data);
  };

  const handlePostResult = async (data: Holiday) => {
    const { error, result } = await postEmpMonitoring(
      '/trainings-and-seminars',
      data
    );

    if (error) {
      // request is done so set loading to false
      postTrainingType(false);

      // set value for error message
      postTrainingTypeFail(false, result);
    } else {
      // request is done so set loading to false
      postTrainingType(false);

      // set value from returned response
      postTrainingTypeSuccess(false, result);

      reset();
      closeModalAction();
      // EmptyResponse();
    }
  };

  return (
    <>
      {/* Notifications */}
      {!isEmpty(Error) ? (
        <ToastNotification toastType="error" notifMessage={Error} />
      ) : null}

      {!isEmpty(TrainingTypePostResponse) ? (
        <ToastNotification toastType="success" notifMessage="Sending Request" />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600"></span>
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
                <label
                  htmlFor="holiday_name"
                  className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-800"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="holiday_name"
                  id="holiday_name"
                  className="bg-gray-50 border border-gray-300 sm:text-xs text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-400 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=" "
                  required
                  {...register('name')}
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

export default AddTrainingModal;
