/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import { putEmpMonitoringWithFile } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

// store and type
import { useAnnouncementsStore } from 'apps/employee-monitoring/src/store/announcement.store';
import { Announcement, AnnouncementTableColumns } from 'apps/employee-monitoring/src/utils/types/announcement.type';

import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';

import { SelectListRF } from '../../../inputs/SelectListRF';
import { PhotoIcon } from '@heroicons/react/20/solid';

const announcementStatus = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: AnnouncementTableColumns;
};

enum AnnouncementKeys {
  ID = 'id',
  TITLE = 'title',
  DESCRIPTION = 'description',
  EVENTANNOUNCEMENTDATE = 'eventAnnouncementDate',
  URL = 'url',
  STATUS = 'status',
  PHOTOURL = 'photoUrl',
  FILE = 'file',
}

// URL validation
const isValidHttpUrl = (string: string | URL) => {
  let url: URL;

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

const EditAnnouncementModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    UpdateAnnouncement,
    SetUpdateAnnouncement,

    ErrorAnnouncement,
    SetErrorAnnouncement,

    EmptyResponse,
  } = useAnnouncementsStore((state) => ({
    UpdateAnnouncement: state.updateAnnouncement,
    SetUpdateAnnouncement: state.setUpdateAnnouncement,

    ErrorAnnouncement: state.errorAnnouncement,
    SetErrorAnnouncement: state.setErrorAnnouncement,

    EmptyResponse: state.emptyResponse,
  }));

  // image preview
  const [hasExistingPhotoUrl, setHasExistingPhotoUrl] = useState(rowData.photoUrl);
  const [previewUrl, setPreviewUrl] = useState(hasExistingPhotoUrl ? hasExistingPhotoUrl : '');

  useEffect(() => {
    setHasExistingPhotoUrl(rowData.photoUrl);
  }, [rowData.photoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        .test('fileExists', 'No file uploaded', (value) => {
          // If there's an existing photoUrl, it's valid regardless of whether a new file is being uploaded
          if (hasExistingPhotoUrl) {
            return true;
          }
          // If there's existing photoUrl and new file is uploaded
          else if (hasExistingPhotoUrl && value instanceof FileList && value.length > 0) {
            return true;
          }
          // If there's no existing photoUrl and new file is uploaded
          else if (!hasExistingPhotoUrl && value instanceof FileList && value.length > 0) {
            return true;
          }
          // In all other cases, the test fails
          return false;
        })
        .test('fileSizeAndDimensions', 'Image must be less than or equal to 5MB and 843x843 pixels', async (value) => {
          if (!(value instanceof FileList) || value.length === 0) {
            return true;
          }

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
        }),
    })
    .required();

  // React hook form
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting: updateFormLoading },
    trigger,
  } = useForm<Announcement>({
    mode: 'onSubmit',
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<Announcement> = async (data: Announcement) => {
    EmptyResponse();
    handlePatchResult(data);
  };

  const handlePatchResult = async (data: Announcement) => {
    const formData = new FormData();

    let { url } = data;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    formData.append('id', data.id);
    formData.append('url', url);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('status', data.status);
    formData.append('eventAnnouncementDate', data.eventAnnouncementDate);

    if (data.file instanceof FileList && data.file.length > 0) {
      formData.append('file', data.file[0]);
    }

    const { error, result } = await putEmpMonitoringWithFile('/events-announcements', formData);

    if (error) {
      SetErrorAnnouncement(result);
    } else {
      SetUpdateAnnouncement(result);
      reset();
      closeModalAction();
    }
  };

  useEffect(() => {
    if (!isEmpty(rowData)) {
      const keys = Object.values(AnnouncementKeys);

      // traverse to each object and setValue
      // set eventAnnouncementDate key to local date string
      keys.forEach((key) => {
        let value = rowData[key as AnnouncementKeys];
        if (key === AnnouncementKeys.EVENTANNOUNCEMENTDATE && value) {
          const date = new Date(String(value));
          value = date.toLocaleDateString('en-CA', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        }
        return setValue(key, value, {
          shouldValidate: false,
          shouldDirty: true,
        });
      });
    }
  }, [rowData]);

  // If modal is open, reset input values
  useEffect(() => {
    if (!modalState) {
      reset({
        title: rowData.title,
        description: rowData.description,
        eventAnnouncementDate: rowData.eventAnnouncementDate,
        url: rowData.url,
        status: rowData.status,
      });
      setPreviewUrl(hasExistingPhotoUrl ? hasExistingPhotoUrl : '');
    }
  }, [modalState]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(UpdateAnnouncement) ? (
        <ToastNotification toastType="success" notifMessage="Announcement details updated successfully" />
      ) : null}
      {!isEmpty(ErrorAnnouncement) ? <ToastNotification toastType="error" notifMessage={ErrorAnnouncement} /> : null}
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">Edit Announcement</span>
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

            <form onSubmit={handleSubmit(onSubmit)} id="editAnnouncementForm">
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
                  id={'eventAnnouncementDate'}
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
              <div className="flex flex-row gap-4">
                <div className="mb-6 flex-shrink-0 flex-grow">
                  <LabelInput
                    id={'file'}
                    label={'Image'}
                    type={'file'}
                    controller={{ ...register('file'), onChange: handleFileChange }}
                    isError={errors.file ? true : false}
                    errorMessage={errors.file?.message}
                    accept={'.jpg,.png'}
                  />
                </div>
                {/* Image preview */}
                {previewUrl || hasExistingPhotoUrl ? (
                  <img
                    src={!previewUrl ? hasExistingPhotoUrl : previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0 flex-grow-0"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-24 h-24 object-cover rounded-lg flex-shrink-0 flex-grow-0 bg-gray-200">
                    <PhotoIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Active / inactive announcement select */}
              <SelectListRF
                id={'status'}
                selectList={announcementStatus}
                defaultOption={announcementStatus.find((status) => status.value === rowData.status)?.label}
                controller={{ ...register('status') }}
                label={'Status'}
                isError={errors.status ? true : false}
                errorMessage={errors.status?.message}
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
              form="editAnnouncementForm"
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

export default EditAnnouncementModal;
