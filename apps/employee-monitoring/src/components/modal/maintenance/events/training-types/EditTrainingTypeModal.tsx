/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { useTrainingTypesStore } from 'apps/employee-monitoring/src/store/training-type.store';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TrainingType } from 'libs/utils/src/lib/types/training-type.type';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: TrainingType;
};

enum TrainingTypeKeys {
  ID = 'id',
  NAME = 'name',
}

const EditTrainingTypeModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    IsLoading,

    UpdateTrainingType,
    UpdateTrainingTypeSuccess,
    UpdateTrainingTypeFail,
  } = useTrainingTypesStore((state) => ({
    IsLoading: state.loading.loadingTrainingType,

    UpdateTrainingType: state.updateTrainingType,
    UpdateTrainingTypeSuccess: state.updateTrainingTypeSuccess,
    UpdateTrainingTypeFail: state.updateTrainingTypeFail,
  }));

  // React hook form
  const { reset, register, setValue, handleSubmit } = useForm<TrainingType>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<TrainingType> = (data: TrainingType) => {
    // set loading to true
    // UpdateTrainingType();

    // handlePostResult(data);
    console.log(data);
  };

  const handlePostResult = async (data: TrainingType) => {
    const { error, result } = await patchEmpMonitoring(
      '/trainings-and-seminars',
      data
    );

    if (error) {
      // request is done so set loading to false
      UpdateTrainingTypeFail(result);
    } else {
      // request is done so set loading to false
      UpdateTrainingTypeSuccess(result);

      reset();
      closeModalAction();
    }
  };

  // Set default values in the form
  useEffect(() => {
    if (!isEmpty(rowData)) {
      const keys = Object.keys(rowData);

      // traverse to each object and setValue
      keys.forEach((key: TrainingTypeKeys) => {
        setValue(key, rowData[key], {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    }
  }, [rowData]);

  return (
    <>
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

            <form onSubmit={handleSubmit(onSubmit)} id="editTrainingTypeForm">
              {/* Training Type name input */}
              <div className="mb-6">
                <label
                  htmlFor="training_type_name"
                  className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-800"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="training_type_name"
                  id="training_type_name"
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
              form="editTrainingTypeForm"
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

export default EditTrainingTypeModal;
