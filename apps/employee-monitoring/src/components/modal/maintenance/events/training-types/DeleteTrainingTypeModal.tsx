/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import { isEmpty } from 'lodash';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { TrainingType } from 'libs/utils/src/lib/types/training-type.type';
import { useTrainingTypesStore } from 'apps/employee-monitoring/src/store/training-type.store';

import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: TrainingType;
};

const DeleteTrainingTypeModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    IsLoading,

    DeleteTrainingType,
    DeleteTrainingTypeSuccess,
    DeleteTrainingTypeFail,
  } = useTrainingTypesStore((state) => ({
    IsLoading: state.loading.loadingTrainingType,

    DeleteTrainingType: state.deleteTrainingType,
    DeleteTrainingTypeSuccess: state.deleteTrainingTypeSuccess,
    DeleteTrainingTypeFail: state.deleteTrainingTypeFail,
  }));

  const { handleSubmit } = useForm<TrainingType>({
    mode: 'onChange',
  });

  // form submission
  const onSubmit: SubmitHandler<TrainingType> = () => {
    if (!isEmpty(rowData.id)) {
      DeleteTrainingType();

      handleDeleteResult(rowData.id);
    }
  };

  const handleDeleteResult = async (id: string) => {
    const { error, result } = await deleteEmpMonitoring(
      `/trainings-seminars-types/${id}`
    );

    if (error) {
      DeleteTrainingTypeFail(result);
    } else {
      DeleteTrainingTypeSuccess(result);

      closeModalAction();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Body>
          {/* Notifications */}
          {IsLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="deleteHolidayForm">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <p className="px-2 mt-5 font-medium text-center text-gray-600 text-md">
                  Are you sure you want to delete entry
                  <span className="px-2 font-bold text-center text-md">
                    {JSON.stringify(rowData.name)}
                  </span>
                  ?
                </p>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full gap-2">
            <button
              type="submit"
              form="deleteHolidayForm"
              className="w-full text-white h-[3rem] bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400 active:bg-red-300"
              disabled={IsLoading ? true : false}
            >
              <span className="text-sm font-normal">Confirm</span>
            </button>

            <button
              type="button"
              className="w-full text-black bg-white border border-gray-200 rounded disabled:cursor-not-allowed active:bg-gray-200 hover:bg-gray-100"
              onClick={closeModalAction}
            >
              <span className="text-sm font-normal">Cancel</span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteTrainingTypeModal;
