/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';
import { putEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

// store and type
import { useAnnouncementsStore } from 'apps/employee-monitoring/src/store/announcement.store';
import { Announcement } from 'apps/employee-monitoring/src/utils/types/announcement.type';

import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';

import { SelectListRF } from '../../../inputs/SelectListRF';

const announcementStatus = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Announcement;
};

enum AnnouncementKeys {
  ID = '_id',
  TITLE = 'title',
  DESCRIPTION = 'description',
  DATE = 'date',
  URL = 'url',
  IMAGE = 'image',
  STATUS = 'status',
}

const EditAnnouncementModal: FunctionComponent<EditModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    UpdateAnnouncementResponse,
    SetUpdateAnnouncement,

    SetErrorAnnouncement,
    EmptyResponse,
  } = useAnnouncementsStore((state) => ({
    UpdateAnnouncementResponse: state.updateAnnouncement,
    SetUpdateAnnouncement: state.setUpdateAnnouncement,

    SetErrorAnnouncement: state.setErrorAnnouncement,
    EmptyResponse: state.emptyResponse,
  }));

  // yup error handling initialization
  const yupSchema = yup
    .object({
      title: yup.string().required('Title is required'),
      date: yup.string().required('Date is required'),
      description: yup.string().required('Description is required'),
      url: yup.string().required('URL is required'),
      status: yup.string().required('Status is required'),
      image: yup
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
    const isValid = await trigger(); // manually trigger validation
    if (!isValid) return; // if form is not valid, stop here

    EmptyResponse();
    handlePatchResult(data);
  };

  const handlePatchResult = async (data: Announcement) => {
    const { error, result } = await putEmpMonitoring(`/announcements`, data);

    if (error) {
      SetErrorAnnouncement(result);
    } else {
      SetUpdateAnnouncement(result);

      reset();
      closeModalAction();
    }
  };

  // Set default values in the form
  useEffect(() => {
    if (!isEmpty(rowData)) {
      const keys = Object.keys(rowData);

      // traverse to each object and setValue
      keys.forEach((key: AnnouncementKeys) => {
        return setValue(key, rowData[key], {
          shouldValidate: false,
          shouldDirty: true,
        });
      });
    }
  }, [rowData]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(UpdateAnnouncementResponse) ? (
        <ToastNotification toastType="success" notifMessage="Announcement details updated successfully" />
      ) : null}
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
                  accept={'.jpg,.png'}
                />
              </div>

              {/* Active / inactive announcement select*/}
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
