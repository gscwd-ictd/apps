/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import { isEmpty } from 'lodash';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

// store and type
import { useAnnouncementsStore } from 'apps/employee-monitoring/src/store/announcement.store';
import { Announcement, FormDeleteAnnouncement } from 'apps/employee-monitoring/src/utils/types/announcement.type';

import { AlertNotification, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Announcement;
};

const DeleteCustomGroupModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    DeleteAnnouncement,
    SetDeleteAnnouncement,
    SetErrorAnnouncement,

    EmptyResponse,
  } = useAnnouncementsStore((state) => ({
    DeleteAnnouncement: state.deleteAnnouncement,
    SetDeleteAnnouncement: state.setDeleteAnnouncement,
    SetErrorAnnouncement: state.setErrorAnnouncement,

    EmptyResponse: state.emptyResponse,
  }));

  const {
    handleSubmit,
    reset,
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
    const { error, result } = await deleteEmpMonitoring(`/events-announcements/${id}`);

    console.log('deleteEmpMonitoring error:', error);
    console.log('deleteEmpMonitoring result:', result);

    if (error) {
      SetErrorAnnouncement('An error occurred. Please try again later.');
    } else {
      SetDeleteAnnouncement(result);
      closeModalAction();
      reset();
    }
  };

  return (
    <>
      {/* Notification */}
      {!isEmpty(DeleteAnnouncement) ? (
        <ToastNotification toastType="success" notifMessage="Announcement removed successfully" />
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

          <form onSubmit={handleSubmit(onSubmit)} id="deleteAnnouncementForm">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <p className="px-2 mt-5 text-md font-medium text-center text-gray-600">
                  Are you sure you want to delete entry
                  <span className="px-2 text-md text-center font-bold">{rowData.title}</span>?
                </p>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full gap-2">
            <button
              type="submit"
              form="deleteAnnouncementForm"
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

export default DeleteCustomGroupModal;
