import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEmpty } from 'lodash';

import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

// store and type
import { usePassSlipStore } from 'apps/employee-monitoring/src/store/pass-slip.store';
import { PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';

import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import dayjs from 'dayjs';
import Image from 'next/image';
import UseConvertDayToTime from 'apps/employee-monitoring/src/utils/functions/ConvertDateToTime';

import { NatureOfBusiness } from 'libs/utils/src/lib/enums/pass-slip.enum';
import UseRenderNatureOfBusiness from 'apps/employee-monitoring/src/utils/functions/RenderNatureOfBusiness';

// regex for time
const timeRegex = new RegExp('^([0-1][0-9]|2[0-3]):[0-5][0-9]$');

type UpdatePassSlipModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  formData: Partial<PassSlip>;
};

enum PassSlipKeys {
  ID = 'id',
  TIMEOUT = 'timeOut',
  TIMEIN = 'timeIn',
}

const UpdatePassSlipModal: FunctionComponent<UpdatePassSlipModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  formData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // zustand store initialization
  const { UpdatePassSlipTimeLogs, UpdatePassSlipTimeLogsSuccess, UpdatePassSlipTimeLogsFail } = usePassSlipStore(
    (state) => ({
      UpdatePassSlipTimeLogs: state.updatePassSlip,
      UpdatePassSlipTimeLogsSuccess: state.updatePassSlipSuccess,
      UpdatePassSlipTimeLogsFail: state.updatePassSlipFail,
    })
  );

  const PassSlipTimeLogsSchema = yup
    .object()
    .shape({
      timeOut: yup
        .string()
        .nullable()
        .when('$natureOfBusiness', {
          is: (natureOfBusiness: NatureOfBusiness) =>
            natureOfBusiness !== NatureOfBusiness.HALF_DAY && natureOfBusiness !== NatureOfBusiness.UNDERTIME,
          then: yup
            .string()
            .nullable()
            .required('Time out is required')
            .matches(timeRegex, 'Time out must be a valid time')
            .test('time-out-test', 'Time out must be before time in', function (value) {
              const timeIn = this.parent.timeIn;
              if (!timeIn) {
                return true;
              }
              return value < timeIn;
            }),
        }),
      timeIn: yup
        .string()
        .nullable()
        .when('$natureOfBusiness', {
          is: (natureOfBusiness: NatureOfBusiness) =>
            natureOfBusiness !== NatureOfBusiness.HALF_DAY && natureOfBusiness !== NatureOfBusiness.UNDERTIME,
          then: yup
            .string()
            .nullable()
            .required('Time in is required')
            .matches(timeRegex, 'Time in must be a valid time')
            .test('time-in-test', 'Time in must be after time out', function (value) {
              const timeOut = this.parent.timeOut;
              if (!timeOut) {
                return true;
              }
              return value > timeOut;
            }),
        }),
    })
    .required();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: patchFormLoading },
    setValue,
    reset,
    trigger,
  } = useForm<Partial<PassSlip>>({
    mode: 'onChange',
    resolver: yupResolver(PassSlipTimeLogsSchema),
    context: { natureOfBusiness: formData.natureOfBusiness },
  });

  // form submission
  const onSubmit: SubmitHandler<Partial<PassSlip>> = async (data) => {
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    const payload: Partial<PassSlip> = {
      id: formData.id,
      timeOut: data.timeOut,
      timeIn: data.timeIn,
    };

    UpdatePassSlipTimeLogs();
    handleUpdatePassSlipTimeLogs(payload);
  };

  // function for updating pass slip time logs
  const handleUpdatePassSlipTimeLogs = async (data: Partial<PassSlip>) => {
    const { error, result } = await patchEmpMonitoring(`/pass-slip/hr/time-record/`, data);
    setIsLoading(true);

    if (!error) {
      UpdatePassSlipTimeLogsSuccess(result);
      setIsLoading(false);
      reset();
      closeModalAction();
    } else if (error) {
      UpdatePassSlipTimeLogsFail(result);
      setIsLoading(false);
    }
  };

  // Set default values in the form
  useEffect(() => {
    if (!isEmpty(formData)) {
      const keys = Object.keys(formData) as (keyof Partial<PassSlip>)[];

      // traverse to each object and setValue
      keys.forEach((key: keyof Partial<PassSlip>) => {
        let value = formData[key];
        if (typeof value === 'string' && (key === PassSlipKeys.TIMEIN || key === PassSlipKeys.TIMEOUT)) {
          value = value.slice(0, 5);
        }
        return setValue(key, value, {
          shouldValidate: false,
          shouldDirty: true,
        });
      });
    }
  }, [formData]);

  // If modal is closed, reset input values
  useEffect(() => {
    if (!modalState) {
      reset({
        id: formData.id,
        timeOut: formData.timeOut ? formData.timeOut.slice(0, 5) : '',
        timeIn: formData.timeIn ? formData.timeIn.slice(0, 5) : '',
      });
    }
  }, [modalState, reset]);

  return (
    <>
      {!isEmpty(UpdatePassSlipTimeLogs) ? (
        <ToastNotification toastType="success" notifMessage="Time logs updated successfully" />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">Update Pass Slip Time Log</span>
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
          {formData ? (
            <div className="flex flex-col gap-3">
              {/* Notifications */}
              {isLoading || patchFormLoading ? (
                <AlertNotification
                  logo={<LoadingSpinner size="xs" />}
                  alertType="info"
                  notifMessage="Submitting request"
                  dismissible={true}
                />
              ) : null}
              <div className="flex flex-row gap-5 items-center p-3">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}${formData.avatarUrl}`}
                  className="rounded-full"
                  width={80}
                  height={80}
                  alt={'Employee Icon'}
                />
                <div>
                  <p className="text-xl font-medium">{formData.employeeName}</p>
                  <div>{UseRenderNatureOfBusiness(formData.natureOfBusiness)}</div>
                </div>
              </div>
              <div className="flex flex-row gap-4 p-3">
                <div className="flex flex-col w-2/5 gap-4">
                  <div>
                    <p className="text-sm font-semibold">Date of Application</p>
                    <p className="text-sm">{dayjs(formData.dateOfApplication).format('MMMM DD, YYYY')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Time Out</p>
                    <p className="text-sm">{formData.timeOut ? UseConvertDayToTime(formData.timeOut) : '--:-- --'}</p>
                  </div>
                  {formData.natureOfBusiness !== NatureOfBusiness.HALF_DAY &&
                  formData.natureOfBusiness !== NatureOfBusiness.UNDERTIME ? (
                    <div>
                      <p className="text-sm font-semibold">Time In</p>
                      <p className="text-sm">{formData.timeIn ? UseConvertDayToTime(formData.timeIn) : '--:-- --'}</p>
                    </div>
                  ) : null}
                </div>
                <form onSubmit={handleSubmit(onSubmit)} id="updatePassSlipTimeLogs" className="flex flex-col w-3/5">
                  {/* Time out input */}
                  <div className="mb-6">
                    <LabelInput
                      type="time"
                      id={'timeOut'}
                      label={'Time Out'}
                      controller={{ ...register('timeOut') }}
                      isError={errors.timeOut ? true : false}
                      errorMessage={errors.timeOut?.message}
                    />
                  </div>

                  {/* Time in input */}
                  {formData.natureOfBusiness !== NatureOfBusiness.HALF_DAY &&
                  formData.natureOfBusiness !== NatureOfBusiness.UNDERTIME ? (
                    <div className="mb-6">
                      <LabelInput
                        type="time"
                        id={'timeIn'}
                        label={'Time In'}
                        controller={{ ...register('timeIn') }}
                        isError={errors.timeIn ? true : false}
                        errorMessage={errors.timeIn?.message}
                      />
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          ) : (
            <LoadingSpinner size={'sm'} />
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* Submit button */}
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="updatePassSlipTimeLogs"
              className="ml-1 text-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading || patchFormLoading}
              loading={isLoading || patchFormLoading}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdatePassSlipModal;
