/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import { isEmpty } from 'lodash';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { OfficerOfTheDay } from 'apps/employee-monitoring/src/utils/types/officer-of-the-day.type';
import { useOfficerOfTheDayStore } from 'apps/employee-monitoring/src/store/officer-of-the-day.store';

import { AlertNotification, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: OfficerOfTheDay;
};

const DeleteOfficerOfTheDayModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    DeleteOfficerOfTheDay,
    SetDeleteOfficerOfTheDay,
    SetErrorOfficerOfTheDay,

    EmptyResponse,
  } = useOfficerOfTheDayStore((state) => ({
    DeleteOfficerOfTheDay: state.deleteOfficerOfTheDay,
    SetDeleteOfficerOfTheDay: state.setDeleteOfficerOfTheDay,
    SetErrorOfficerOfTheDay: state.setErrorOfficerOfTheDay,

    EmptyResponse: state.emptyResponse,
  }));

  // React hook form
  const {
    handleSubmit,
    formState: { isSubmitting: deleteFormLoading },
  } = useForm();

  // form submission
  const onSubmit = () => {
    if (!isEmpty(rowData.id)) {
      EmptyResponse();

      handleDeleteResult(rowData.id);
    }
  };

  const handleDeleteResult = async (id: string) => {
    const { error, result } = await deleteEmpMonitoring(`/officer-of-the-day/${id}`);

    if (error) {
      SetErrorOfficerOfTheDay(result);
    } else {
      SetDeleteOfficerOfTheDay(result);

      closeModalAction();
    }
  };

  return (
    <>
      {/* Notification */}
      {!isEmpty(DeleteOfficerOfTheDay) ? (
        <ToastNotification toastType="success" notifMessage="Officer of the day removed successfully" />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Body>
          {/* Notifications */}
          {deleteFormLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={false}
            />
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="deleteOfficerOfTheDayForm">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <p className="px-2 mt-5 font-medium text-center text-gray-600 text-md">
                  Are you sure you want remove{' '}
                  <span className="px-2 font-bold text-center text-md">{rowData.employeeName}</span>
                  as Officer of the Day?
                </p>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full gap-2">
            <button
              type="submit"
              form="deleteOfficerOfTheDayForm"
              className="w-full text-white h-[3rem] bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400 active:bg-red-300"
              disabled={deleteFormLoading ? true : false}
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

export default DeleteOfficerOfTheDayModal;
