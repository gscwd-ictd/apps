/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { CustomGroup } from 'apps/employee-monitoring/src/utils/types/custom-group.type';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: CustomGroup;
};

enum CustomGroupKeys {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
}

const EditCustomGroupModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    IsLoading,

    UpdateCustomGroup,
    UpdateCustomGroupSuccess,
    UpdateCustomGroupFail,
  } = useCustomGroupStore((state) => ({
    IsLoading: state.loading.loadingCustomGroup,

    UpdateCustomGroup: state.updateCustomGroup,
    UpdateCustomGroupSuccess: state.updateCustomGroupSuccess,
    UpdateCustomGroupFail: state.updateCustomGroupFail,
  }));

  // yup error handling initialization
  const yupSchema = yup
    .object({
      name: yup.string().required('Name is required'),
      description: yup.string().required('Description is required'),
    })
    .required();

  // React hook form
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomGroup>({
    mode: 'onChange',
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<CustomGroup> = (data: CustomGroup) => {
    UpdateCustomGroup();

    handlePatchResult(data);
  };

  const handlePatchResult = async (data: CustomGroup) => {
    const { error, result } = await patchEmpMonitoring(`/custom-groups/`, data);

    if (error) {
      UpdateCustomGroupFail(result);
    } else {
      UpdateCustomGroupSuccess(result);

      reset();
      closeModalAction();
    }
  };

  // Set default values in the form
  useEffect(() => {
    if (!isEmpty(rowData)) {
      const keys = Object.keys(rowData);

      // traverse to each object and setValue
      keys.forEach((key: CustomGroupKeys) => {
        return setValue(key, rowData[key], {
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

            <form onSubmit={handleSubmit(onSubmit)} id="editCustomGroupForm">
              {/* Name input */}
              <div className="mb-6">
                <LabelInput
                  id={'name'}
                  label={'Group Name'}
                  controller={{ ...register('name') }}
                  isError={errors.name ? true : false}
                  errorMessage={errors.name?.message}
                />
              </div>

              {/* Description input */}
              <div className="mb-6">
                <LabelInput
                  id={'description'}
                  label={'Group Function'}
                  type="textarea"
                  controller={{ ...register('description') }}
                  isError={errors.description ? true : false}
                  errorMessage={errors.description?.message}
                  rows={5}
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
              form="editCustomGroupForm"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
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

export default EditCustomGroupModal;
