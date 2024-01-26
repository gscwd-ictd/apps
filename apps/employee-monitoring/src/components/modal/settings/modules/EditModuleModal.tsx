/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import {
  patchEmpMonitoring,
  putEmpMonitoring,
} from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { useModulesStore } from 'apps/employee-monitoring/src/store/module.store';
import { Module } from 'apps/employee-monitoring/src/utils/types/module.type';

import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Module;
};

enum ModuleKeys {
  ID = '_id',
  MODULE = 'module',
  SLUG = 'slug',
  URL = 'url',
}

// yup error handling initialization
const yupSchema = yup
  .object({
    module: yup.string().required('Module name is required'),
    slug: yup.string().required('Slug is required'),
    url: yup.string().required('URL is required'),
  })
  .required();

const EditModuleModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // Zustand initialization
  const {
    UpdateModuleResponse,
    SetUpdateModule,

    SetErrorModule,
    EmptyResponse,
  } = useModulesStore((state) => ({
    UpdateModuleResponse: state.updateModule,
    SetUpdateModule: state.setUpdateModule,

    SetErrorModule: state.setErrorModule,
    EmptyResponse: state.emptyResponse,
  }));

  // React hook form
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting: updateFormLoading },
  } = useForm<Module>({
    mode: 'onChange',
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<Module> = (data: Module) => {
    EmptyResponse();

    handlePatchResult(data);
  };

  const handlePatchResult = async (data: Module) => {
    const { error, result } = await putEmpMonitoring(`/modules`, data);

    if (error) {
      SetErrorModule(result);
    } else {
      SetUpdateModule(result);

      reset();
      closeModalAction();
    }
  };

  // Remove the initial front slash
  function FormatUrl(url: string | null) {
    if (url !== null) return url.substring(1);
    else return 'error';
  }

  // Set default values in the form
  useEffect(() => {
    if (!isEmpty(rowData)) {
      const keys = Object.keys(rowData);

      // traverse to each object and setValue0
      keys.forEach((key: ModuleKeys) => {
        if (key === 'url') {
          setValue('url', FormatUrl(rowData[key]), {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else {
          setValue(key, rowData[key], {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });
    }
  }, [rowData]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(UpdateModuleResponse) ? (
        <ToastNotification toastType="success" notifMessage="Module details updated successfully" />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">Edit Module</span>
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
            {updateFormLoading ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={true}
              />
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} id="editModuleForm">
              {/* Module input */}
              <div className="mb-6">
                <LabelInput
                  id={'module'}
                  label={'Module'}
                  controller={{ ...register('module') }}
                  isError={errors.module ? true : false}
                  errorMessage={errors.module?.message}
                />
              </div>

              {/* Slug input */}
              <div className="mb-6">
                <LabelInput
                  id={'slug'}
                  label={'Slug'}
                  controller={{ ...register('slug') }}
                  isError={errors.slug ? true : false}
                  errorMessage={errors.slug?.message}
                />
              </div>

              {/* URL input */}
              <div className="mb-6">
                <LabelInput
                  id={'url'}
                  label={'URL'}
                  controller={{
                    ...register('url', {
                      setValueAs: (value) => '/' + value,
                    }),
                  }}
                  isError={errors.url ? true : false}
                  errorMessage={errors.url?.message}
                  prefix="/"
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
              form="editModuleForm"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
              disabled={updateFormLoading ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditModuleModal;
