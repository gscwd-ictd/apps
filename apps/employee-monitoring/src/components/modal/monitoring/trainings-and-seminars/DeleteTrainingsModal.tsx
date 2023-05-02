/* eslint-disable react/no-unescaped-entities */
import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { useTrainingsStore } from 'apps/employee-monitoring/src/store/training.store';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { Training } from 'libs/utils/src/lib/types/training.type';
import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Training;
};

const DeleteTrainingsModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const { handleSubmit } = useForm<Training>();

  const {
    IsLoading,
    DeleteTraining,
    DeleteTrainingFail,
    DeleteTrainingSuccess,
  } = useTrainingsStore((state) => ({
    TrainingPostResponse: state.training.deleteResponse,
    IsLoading: state.loading.loadingTraining,
    Error: state.error.errorTraining,

    DeleteTraining: state.deleteTraining,
    DeleteTrainingSuccess: state.deleteTrainingSuccess,
    DeleteTrainingFail: state.deleteTrainingFail,
  }));

  const onSubmit: SubmitHandler<Training> = () => {
    if (!isEmpty(rowData.id)) {
      // set to true
      DeleteTraining();

      handleDeleteResult(rowData.id);
    }
  };

  const handleDeleteResult = async (id: string) => {
    const { error, result } = await deleteEmpMonitoring(`/training/${id}`);

    if (error) {
      // request is done so set loading to false
      DeleteTrainingFail(result);
    } else {
      // request is done so set loading to false
      DeleteTrainingSuccess(result);

      // close modal
      closeModalAction();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="deletetrainingsmodal">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <span className="px-2 mt-5 text-xl font-medium text-center text-gray-600">
                  Delete Training
                </span>
                <span className="px-2 text-lg text-center text-gray-400">
                  "{rowData.name}"
                </span>
              </div>
            </div>
          </form>
          {IsLoading ? (
            <div className="flex justify-center w-full">
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={false}
              />
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-row-reverse justify-between w-full gap-2">
            <button
              type="button"
              onClick={closeModalAction}
              className="w-full text-black bg-white border border-gray-200 rounded disabled:cursor-not-allowed active:bg-gray-200 hover:bg-gray-100"
              disabled={IsLoading ? true : false}
            >
              <span className="font-normal text-md">No</span>
            </button>
            <button
              type="submit"
              form="deletetrainingsmodal"
              className="w-full text-white h-[3rem] bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400 active:bg-red-300"
              disabled={IsLoading ? true : false}
            >
              <span className="font-normal text-md">Yes</span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteTrainingsModal;
