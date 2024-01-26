/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  getEmpMonitoring,
  postEmpMonitoring,
} from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { isEmpty } from 'lodash';

import { useModulesStore } from 'apps/employee-monitoring/src/store/module.store';
import { PostRequestUserRoles, PostUserRole, UserRole } from 'apps/employee-monitoring/src/utils/types/user.type';
import { useUsersStore } from 'apps/employee-monitoring/src/store/user.store';

import { Modal, AlertNotification, LoadingSpinner, Button, ToastNotification } from '@gscwd-apps/oneui';
import { SelectListRF } from '../../../inputs/SelectListRF';
import { Module } from 'apps/employee-monitoring/src/utils/types/module.type';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// yup error handling initialization
const yupSchema = yup
  .object({
    employeeId: yup.string().required('Select an employee'),
  })
  .required();

const AddUserModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction }) => {
  const [userRoles, setUserRoles] = useState<Array<PostUserRole>>([]);
  const [isDoneModuleToUserRole, setIsDoneModuleToUserRole] = useState<boolean>(false);

  // Zustand initialization
  const { Modules, SetGetModules, SetErrorModules } = useModulesStore((state) => ({
    Modules: state.getModules,
    SetGetModules: state.setGetModules,

    SetErrorModules: state.setErrorModules,
  }));

  const {
    NonEmsUsers,
    SetGetNonEmsUsers,
    SetErrorNonEmsUsers,

    PostUser,
    SetPostUser,
    SetErrorUser,

    EmptyResponse,
  } = useUsersStore((state) => ({
    NonEmsUsers: state.getNonEmsUsers,
    SetGetNonEmsUsers: state.setGetNonEmsUsers,
    SetErrorNonEmsUsers: state.setErrorNonEmsUsers,

    PostUser: state.postUser,
    SetPostUser: state.setPostUser,
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
    formState: { errors, isSubmitting: postFormLoading },
  } = useForm<PostRequestUserRoles>({
    mode: 'onChange',
    defaultValues: {
      employeeId: '',
      userRoles: [],
    },
    resolver: yupResolver(yupSchema),
  });

  const { fields } = useFieldArray({
    control,
    name: 'userRoles',
  });

  // form submission
  const onSubmit: SubmitHandler<PostRequestUserRoles> = (data: PostRequestUserRoles) => {
    EmptyResponse();

    handlePostResult(data);
  };

  // asynchronous request to post user and roles
  const handlePostResult = async (data: PostRequestUserRoles) => {
    const { error, result } = await postEmpMonitoring('/user-roles', data); // REPLACE postHRIS to postEmpMonitoring

    if (error) {
      SetErrorUser(result);
    } else {
      SetPostUser(result);

      reset();
      closeModalAction();
    }
  };

  // asynchronous request to fetch employee that is not assigned user of EMS module
  const fetchNonEmsUsers = async () => {
    const { error, result } = await getEmpMonitoring('/user-roles/users/ems/assignable');

    if (error) {
      SetErrorNonEmsUsers(result);
    } else {
      SetGetNonEmsUsers(result);
    }
  };

  // asynchronous request to fetch EMS modules
  const fetchModules = async () => {
    const { error, result } = await getEmpMonitoring('/modules');

    if (error) {
      SetErrorModules(result);
    } else {
      SetGetModules(result);

      // Mutate the result. Added each module object with hasAccess
      result.map((module: Module) => {
        const newUserRole = {
          moduleId: module._id,
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
      fetchNonEmsUsers();
      fetchModules();
    } else {
      // Upon closing, reset the ff: states
      setUserRoles([]);
      setIsDoneModuleToUserRole(false);
      reset();
    }
  }, [modalState]);

  // set value in react hook form for userRoles
  useEffect(() => {
    if (isDoneModuleToUserRole) {
      setValue('userRoles', userRoles);
    }
  }, [isDoneModuleToUserRole]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(PostUser) ? <ToastNotification toastType="success" notifMessage="User added successfully" /> : null}

      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">Assign EMS User</span>
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

            <form onSubmit={handleSubmit(onSubmit)} id="addUserForm">
              {/* Employee select input */}
              <div className="mb-6">
                <SelectListRF
                  id="employeeId"
                  selectList={NonEmsUsers}
                  controller={{
                    ...register('employeeId'),
                  }}
                  label="Employee"
                  isError={errors.employeeId ? true : false}
                  errorMessage={errors.employeeId?.message}
                />
              </div>

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
              form="addUserForm"
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

export default AddUserModal;
