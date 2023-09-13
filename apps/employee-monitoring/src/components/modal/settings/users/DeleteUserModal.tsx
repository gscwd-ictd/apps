/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import { isEmpty } from 'lodash';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { User } from 'apps/employee-monitoring/src/utils/types/user.type';
import { useUsersStore } from 'apps/employee-monitoring/src/store/user.store';

import {
  AlertNotification,
  LoadingSpinner,
  Modal,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { deleteHRIS } from 'apps/employee-monitoring/src/utils/helper/hris-axios-helper';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: User;
};

const DeleteUserModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    DeleteUser,
    SetDeleteUser,
    SetErrorUser,

    EmptyResponse,
  } = useUsersStore((state) => ({
    DeleteUser: state.deleteUser,
    SetDeleteUser: state.setDeleteUser,
    SetErrorUser: state.setErrorUser,

    EmptyResponse: state.emptyResponse,
  }));

  const {
    handleSubmit,
    formState: { isSubmitting: deleteFormLoading },
  } = useForm();

  const onSubmit = () => {
    if (!isEmpty(rowData.employeeId)) {
      EmptyResponse();

      handleDeleteResult(rowData.employeeId);
    }
  };

  const handleDeleteResult = async (employeeId: string) => {
    const { error, result } = await deleteHRIS(`/user-roles/${employeeId}`); // change deleteHRIS to deleteEmpMonitoring

    if (error) {
      SetErrorUser(result);
    } else {
      SetDeleteUser(result);

      closeModalAction();
    }
  };

  return (
    <>
      {/* Notification */}
      {!isEmpty(DeleteUser) ? (
        <ToastNotification
          toastType="success"
          notifMessage="User removed successfully"
        />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Body>
          {/* Notifications */}
          {deleteFormLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="deleteTravelOrderForm">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <p className="px-2 mt-5 font-medium text-center text-gray-600 text-md">
                  Are you sure you want remove{' '}
                  <span className="px-2 font-bold text-center text-md">
                    {JSON.stringify(rowData.fullName)}
                  </span>
                  as EMS user?
                </p>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full gap-2">
            <button
              type="submit"
              form="deleteTravelOrderForm"
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

export default DeleteUserModal;
