/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { FormPostModule } from 'apps/employee-monitoring/src/utils/types/module.type';
import { useCustomGroupStore } from 'apps/employee-monitoring/src/store/custom-group.store';

import {
  Modal,
  AlertNotification,
  LoadingSpinner,
  Button,
} from '@gscwd-apps/oneui';
import { LabelInput } from '../../../inputs/LabelInput';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// yup error handling initialization
const yupSchema = yup
  .object({
    module: yup.string().required('Module name is required'),
    slug: yup.string().required('Slug is required'),
    url: yup.string().required('URL is required'),
  })
  .required();

const AddModulesModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  // zustand store initialization for travel order
  // const {
  //   IsLoading,

  //   PostCustomGroup,
  //   PostCustomGroupSuccess,
  //   PostCustomGroupFail,
  // } = useModuleStore((state) => ({
  //   IsLoading: state.loading.loadingCustomGroup,

  //   PostCustomGroup: state.postCustomGroup,
  //   PostCustomGroupSuccess: state.postCustomGroupSuccess,
  //   PostCustomGroupFail: state.postCustomGroupFail,
  // }));

  // React hook form
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormPostModule>({
    mode: 'onChange',
    defaultValues: {
      module: '',
      slug: '',
      url: '',
    },
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<FormPostModule> = (data: FormPostModule) => {
    // set loading to true
    // PostModule();

    // handlePostResult(data);

    console.log(data);
  };

  // const handlePostResult = async (data: FormPostModule) => {
  //   const { error, result } = await postEmpMonitoring('/modules', data);

  //   if (error) {
  //     // request is done so set loading to false
  //     PostCustomGroupFail(result);
  //   } else {
  //     // request is done so set loading to false
  //     PostCustomGroupSuccess(result);

  //     reset();
  //     closeModalAction();
  //   }
  // };

  // If modal is open, reset input values
  // useEffect(() => {
  //   if (!modalState) {
  //     reset();
  //   }
  // }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">New Module</span>
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
            {/* {IsLoading ? (
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={true}
              />
            ) : null} */}

            <form onSubmit={handleSubmit(onSubmit)} id="addModuleForm">
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
              form="addModuleForm"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
              // disabled={IsLoading ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddModulesModal;
