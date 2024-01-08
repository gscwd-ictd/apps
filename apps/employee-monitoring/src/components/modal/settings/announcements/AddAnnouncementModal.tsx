/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

// store and type
import { useAnnouncementsStore } from 'apps/employee-monitoring/src/store/announcement.store';
import { Announcement, FormPostAnnouncement } from 'apps/employee-monitoring/src/utils/types/announcement.type';

import { Modal, AlertNotification, LoadingSpinner, Button, ToastNotification } from '@gscwd-apps/oneui';
import { LabelInput } from '../../../inputs/LabelInput';
import { isEmpty } from 'lodash';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// yup error handling initialization
const yupSchema = yup
  .object({
    title: yup.string().required('Title is required'),
    date: yup.string().required('Date is required'),
    description: yup.string().required('Description is required'),
    url: yup.string().required('URL is required'),
    image: yup.string().required('Image is required'),
  })
  .required();

const AddAnnouncementModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction }) => {
  // Zustand initialization
  const {
    PostAnnouncementResponse,
    SetPostAnnouncement,

    SetErrorAnnouncement,
    EmptyResponse,
  } = useAnnouncementsStore((state) => ({
    PostAnnouncementResponse: state.postAnnouncement,
    SetPostAnnouncement: state.setPostAnnouncement,

    SetErrorAnnouncement: state.setErrorAnnouncement,
    EmptyResponse: state.emptyResponse,
  }));

  // React hook form
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting: postFormLoading },
  } = useForm<FormPostAnnouncement>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      date: '',
      description: '',
      url: '',
      image: '',
      app: 'ems',
    },
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<FormPostAnnouncement> = (data: FormPostAnnouncement) => {
    EmptyResponse();

    handlePostResult(data);
  };

  const handlePostResult = async (data: FormPostAnnouncement) => {
    const { error, result } = await postEmpMonitoring('/announcements', data);

    if (error) {
      SetErrorAnnouncement(result);
    } else {
      SetPostAnnouncement(result);

      reset();
      closeModalAction();
    }
  };

  // If modal is open, reset input values
  useEffect(() => {
    if (!modalState) {
      reset();
    }
  }, [modalState]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(PostAnnouncementResponse) ? (
        <ToastNotification toastType="success" notifMessage="Module added successfully" />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">New Announcement</span>
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
                dismissible={true}
              />
            ) : null}

            {/* {!isEmpty(postFormError) ? (
              <ToastNotification
                toastType="error"
                notifMessage={postFormError}
              />
            ) : null} */}

            <form onSubmit={handleSubmit(onSubmit)} id="addAnnouncementForm">
              {/* Title input */}
              <div className="mb-6">
                <LabelInput
                  id={'title'}
                  label={'Title'}
                  controller={{ ...register('title') }}
                  isError={errors.title ? true : false}
                  errorMessage={errors.title?.message}
                />
              </div>

              {/* Description input */}
              <div className="mb-6">
                <LabelInput
                  id={'description'}
                  label={'Description'}
                  controller={{ ...register('description') }}
                  type={'textarea'}
                  rows={3}
                  isError={errors.description ? true : false}
                  errorMessage={errors.description?.message}
                />
              </div>

              {/* Date input */}
              <div className="mb-6">
                <LabelInput
                  id={'date'}
                  label={'Date'}
                  type={'date'}
                  controller={{ ...register('date') }}
                  isError={errors.date ? true : false}
                  errorMessage={errors.date?.message}
                />
              </div>

              {/* URL input */}
              <div className="mb-6">
                <LabelInput
                  id={'url'}
                  label={'URL'}
                  controller={{ ...register('url') }}
                  isError={errors.url ? true : false}
                  errorMessage={errors.url?.message}
                  prefix="/"
                />
              </div>

              {/* Image input */}
              <div className="mb-6">
                <LabelInput
                  id={'image'}
                  label={'Image'}
                  type={'file'}
                  controller={{ ...register('image') }}
                  isError={errors.image ? true : false}
                  errorMessage={errors.image?.message}
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
              form="addAnnouncementForm"
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

export default AddAnnouncementModal;
