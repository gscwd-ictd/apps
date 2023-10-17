/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import {
  getEmpMonitoring,
  patchEmpMonitoring,
} from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { isEmpty } from 'lodash';

import {
  PostRequestUserRoles,
  User,
  PatchRequestUserRoles,
  PatchUserRole,
} from 'apps/employee-monitoring/src/utils/types/user.type';
import { useUsersStore } from 'apps/employee-monitoring/src/store/user.store';

import { Modal, AlertNotification, LoadingSpinner, Button, ToastNotification } from '@gscwd-apps/oneui';
import { Module } from 'apps/employee-monitoring/src/utils/types/module.type';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: User;
};

const EditUserModal: FunctionComponent<EditModalProps> = ({ modalState, setModalState, closeModalAction, rowData }) => {
  const [userRoles, setUserRoles] = useState<Array<PatchUserRole>>([]);
  const [isDoneModuleToUserRole, setIsDoneModuleToUserRole] = useState<boolean>(false);

  // Zustand store initialization
  const {
    GetUserRolesForPatch,
    SetGetUserRolesForPatch,
    SetErrorGetUserRoles,

    UpdateUser,
    SetUpdateUser,
    SetErrorUser,

    EmptyResponse,
  } = useUsersStore((state) => ({
    GetUserRolesForPatch: state.getUserRolesForPatch,
    SetGetUserRolesForPatch: state.setGetUserRolesForPatch,
    SetErrorGetUserRoles: state.setErrorGetUserRoles,

    UpdateUser: state.updateUser,
    SetUpdateUser: state.setUpdateUser,
    SetErrorUser: state.setErrorUser,

    EmptyResponse: state.emptyResponse,
  }));

  // React hook form
  const {
    reset,
    register,
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting: postFormLoading },
  } = useForm<PatchRequestUserRoles>({
    mode: 'onChange',
    defaultValues: {
      employeeId: '',
      userRoles: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'userRoles',
  });

  // form submission
  const onSubmit: SubmitHandler<PatchRequestUserRoles> = (data: PatchRequestUserRoles) => {
    EmptyResponse();

    handlePatchResult(data);
  };

  // asynchronous request to post user and roles
  const handlePatchResult = async (data: PatchRequestUserRoles) => {
    const { error, result } = await patchEmpMonitoring('/user-roles', data); // change patchHRIS to patchEmpMonitoring

    if (error) {
      SetErrorUser(result);
    } else {
      SetUpdateUser(result);

      reset();
      closeModalAction();
    }
  };

  // asynchronous request to fetch current user roles
  const fetchUserRoles = async (employeeId: string) => {
    const { error, result } = await getEmpMonitoring(`/user-roles/${employeeId}`);

    if (error) {
      SetErrorGetUserRoles(result);
    } else {
      SetGetUserRolesForPatch(result);

      // Mutate the result. Added each module object with hasAccess
      result.map((module: Module) => {
        const newUserRole = {
          _id: module._id,
          hasAccess: false,
          module: module.module,
          slug: module.slug,
        };
        setUserRoles((userRole) => [...userRole, newUserRole]);
      });

      setIsDoneModuleToUserRole(true);
    }
  };

  // If modal is open, set action to fetch for employee list
  useEffect(() => {
    if (modalState) {
      if (!isEmpty(rowData.employeeId)) {
        // pass props of employee id
        fetchUserRoles(rowData.employeeId);
      }
    } else {
      setIsDoneModuleToUserRole(false);
      reset();
    }
  }, [modalState]);

  // set value in react hook form for userRoles
  useEffect(() => {
    if (!isEmpty(GetUserRolesForPatch)) {
      setValue('userRoles', GetUserRolesForPatch);
    }
  }, [GetUserRolesForPatch]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(UpdateUser) ? (
        <ToastNotification toastType="success" notifMessage="User roles updated successfully" />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">Edit User Roles</span>
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
            {postFormLoading ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={false}
              />
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} id="editUserForm">
              {/* Employee select input */}

              <div className="mb-6">
                <label className="flex justify-between gap-2 mb-1 text-xs font-medium text-gray-900 dark:text-gray-800">
                  <div className="flex gap-2">Modules</div>
                </label>

                <div className="grid grid-cols-2 gap-1 pl-6">
                  {fields.map((item, index) => {
                    return (
                      <div className="flex" key={item.id}>
                        <input
                          id={item.slug}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          {...register(`userRoles.${index}.hasAccess`)}
                        />
                        <label
                          htmlFor={item.slug}
                          className="ml-2 flex justify-between gap-2 mb-1 text-xs font-medium text-gray-900"
                        >
                          {item.module}
                        </label>
                      </div>
                    );
                  })}
                </div>
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
              form="editUserForm"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
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

export default EditUserModal;
function putEMS(
  arg0: string,
  data: PostRequestUserRoles
): { error: any; result: any } | PromiseLike<{ error: any; result: any }> {
  throw new Error('Function not implemented.');
}
