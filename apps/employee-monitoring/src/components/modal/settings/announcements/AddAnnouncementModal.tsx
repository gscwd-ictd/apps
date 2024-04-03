/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect } from 'react';
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

import { SelectListRF } from '../../../inputs/SelectListRF';

const announcementStatus = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// URL validation
const isValidHttpUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  // Check protocol
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return false;
  }

  // Check if URL contains a proper top-level domain
  const domainParts = url.hostname.split('.');
  if (domainParts.length < 2 || domainParts[domainParts.length - 1] === '') {
    return false;
  }

  return true;
};

// yup error handling initialization
const yupSchema = yup
  .object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    url: yup
      .string()
      .required('URL is required')
      .test('valid-url', 'Must be a valid URL', (value) => {
        if (!value) {
          return true;
        }
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return isValidHttpUrl('http://' + value);
        }
        return isValidHttpUrl(value);
      }),
    eventAnnouncementDate: yup.string().required('Date is required'),
    status: yup.string().required('Status is required'),

    // file state is temporary since file is only used for file upload
    file: yup
      .mixed()
      .test('fileExists', 'No file uploaded', async (value) => {
        return value instanceof FileList && value.length > 0;
      })
      .test('type', 'Only .jpeg, .jpg, or .png file is supported', (value) => {
        if (value instanceof FileList && value.length > 0) {
          const isCorrectType = Array.from(value).every((file) => {
            return ['image/jpeg', 'image/png'].includes(file.type);
          });
          if (!isCorrectType) {
            return false;
          }
        }
        return true;
      })
      .test('fileSizeAndDimensions', 'Image must be less than or equal to 5MB and 843x843 pixels', async (value) => {
        if (value instanceof FileList && value.length > 0) {
          const file = value[0];
          const fileSizeInMB = file.size / (1024 * 1024);
          if (fileSizeInMB > 5) {
            return false;
          }
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const { width, height } = img;
              resolve(width <= 843 && height <= 843);
            };
            img.onerror = () => resolve(false);
            const reader = new FileReader();
            reader.onload = (e) => {
              img.src = e.target.result as string;
            };
            reader.onerror = () => resolve(false);
            reader.readAsDataURL(file);
          });
        }
        return false;
      }),
  })
  .required();

const AddAnnouncementModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction }) => {
  // Zustand initialization
  const {
    PostAnnouncement,
    SetPostAnnouncement,

    ErrorAnnouncement,
    SetErrorAnnouncement,

    EmptyResponse,
  } = useAnnouncementsStore((state) => ({
    PostAnnouncement: state.postAnnouncement,
    SetPostAnnouncement: state.setPostAnnouncement,

    ErrorAnnouncement: state.errorAnnouncement,
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
      eventAnnouncementDate: '',
      description: '',
      url: '',
      app: 'ems',
      photoUrl: '',
      file: null,
    },
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<FormPostAnnouncement> = (data: FormPostAnnouncement) => {
    EmptyResponse();
    handlePostResult(data);
  };

  const handlePostResult = async (data: FormPostAnnouncement) => {
    const formData = new FormData();

    // adding protocol to url if it does not start with the protocol
    let { url } = data;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    formData.append('url', url);

    formData.append('file', data.file[0]);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('status', data.status);
    formData.append('eventAnnouncementDate', data.eventAnnouncementDate);

    const { error, result } = await postEmpMonitoring('/events-announcements', formData);

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
      {!isEmpty(PostAnnouncement) ? (
        <ToastNotification toastType="success" notifMessage="Announcement added successfully" />
      ) : null}
      {!isEmpty(ErrorAnnouncement) ? <ToastNotification toastType="error" notifMessage={ErrorAnnouncement} /> : null}

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
                  controller={{ ...register('eventAnnouncementDate') }}
                  isError={errors.eventAnnouncementDate ? true : false}
                  errorMessage={errors.eventAnnouncementDate?.message}
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
              <LabelInput
                id={'file'}
                label={'Image'}
                type={'file'}
                controller={{ ...register('file') }}
                isError={errors.file ? true : false}
                errorMessage={errors.file?.message}
                accept={'.jpg,.png'}
              />

              {/* Active / inactive announcement select*/}
              <SelectListRF
                id={'status'}
                selectList={announcementStatus}
                controller={{ ...register('status') }}
                label={'Status'}
              />
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
