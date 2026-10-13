/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import {
  getEmpMonitoring,
  patchEmpMonitoring,
  postEmpMonitoring,
} from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import {
  FormWorkSuspension,
  WorkSuspension,
  WorkSuspensionPreviewRow,
  WorkSuspensionType,
} from 'apps/employee-monitoring/src/utils/types/work-suspension.type';

type FormModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  /** when set the modal edits this row, otherwise it creates a new suspension */
  rowData?: WorkSuspension | null;
  onSuccess: (message: string) => void;
};

const yupSchema = yup.object().shape({
  name: yup.string().trim().required().label('Name'),
  suspensionDate: yup.string().required().label('Suspension Date'),
  suspensionType: yup.string().oneOf([WorkSuspensionType.WHOLE_DAY, WorkSuspensionType.TIME_OF_DAY]).required(),
  suspensionStartTime: yup.string().when('suspensionType', {
    is: WorkSuspensionType.TIME_OF_DAY,
    then: (schema) => schema.required('Start time is required for a time of day suspension'),
    otherwise: (schema) => schema.notRequired(),
  }),
  memoNo: yup.string().max(100).notRequired(),
  remarks: yup.string().notRequired(),
});

const emptyForm: FormWorkSuspension = {
  name: '',
  suspensionDate: '',
  suspensionType: WorkSuspensionType.TIME_OF_DAY,
  suspensionStartTime: '',
  memoNo: '',
  remarks: '',
};

const formatMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} m`;
};

const formatTime = (time: string) => time?.slice(0, 5);

const WorkSuspensionFormModal: FunctionComponent<FormModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
  onSuccess,
}) => {
  const isEdit = !!rowData?.id;
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [preview, setPreview] = useState<Array<WorkSuspensionPreviewRow>>([]);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormWorkSuspension>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: emptyForm,
    resolver: yupResolver(yupSchema) as never,
  });

  const suspensionType = watch('suspensionType');
  const suspensionStartTime = watch('suspensionStartTime');

  // load row values / reset when opening
  useEffect(() => {
    if (!modalState) return;
    setErrorMessage('');
    if (isEdit && rowData) {
      reset({
        name: rowData.name,
        suspensionDate: rowData.suspensionDate,
        suspensionType: rowData.suspensionType as FormWorkSuspension['suspensionType'],
        suspensionStartTime: rowData.suspensionStartTime ? formatTime(rowData.suspensionStartTime) : '',
        memoNo: rowData.memoNo ?? '',
        remarks: rowData.remarks ?? '',
      });
    } else reset(emptyForm);
  }, [modalState, rowData]);

  // live preview of suspended hours per schedule
  useEffect(() => {
    if (!modalState) return;
    if (suspensionType === WorkSuspensionType.TIME_OF_DAY && !suspensionStartTime) {
      setPreview([]);
      return;
    }
    const timer = setTimeout(async () => {
      setPreviewLoading(true);
      const params = new URLSearchParams({ suspensionType });
      if (suspensionType === WorkSuspensionType.TIME_OF_DAY) params.append('suspensionStartTime', suspensionStartTime);
      const { error, result } = await getEmpMonitoring(`/work-suspension/preview?${params.toString()}`);
      setPreview(error ? [] : result);
      setPreviewLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [modalState, suspensionType, suspensionStartTime]);

  const onSubmit: SubmitHandler<FormWorkSuspension> = async (data) => {
    setErrorMessage('');
    const body = {
      name: data.name.trim(),
      suspensionDate: data.suspensionDate,
      suspensionType: data.suspensionType,
      suspensionStartTime: data.suspensionType === WorkSuspensionType.TIME_OF_DAY ? data.suspensionStartTime : null,
      memoNo: data.memoNo || undefined,
      remarks: data.remarks || undefined,
    };

    const { error, result } = isEdit
      ? await patchEmpMonitoring(`/work-suspension/${rowData?.id}`, body)
      : await postEmpMonitoring('/work-suspension', body);

    if (error) {
      setErrorMessage(Array.isArray(result) ? result.join(', ') : String(result));
    } else {
      onSuccess(isEdit ? 'Work suspension updated successfully' : 'Work suspension added successfully');
      reset(emptyForm);
      closeModalAction();
    }
  };

  return (
    <Modal open={modalState} setOpen={setModalState} steady size="md">
      <Modal.Header>
        <div className="flex justify-between w-full">
          <span className="text-xl font-medium">{isEdit ? 'Edit Work Suspension' : 'New Work Suspension'}</span>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center"
            onClick={closeModalAction}
          >
            <i className="bx bx-x"></i>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
      </Modal.Header>

      <Modal.Body>
        {isSubmitting ? (
          <AlertNotification logo={<LoadingSpinner size="xs" />} alertType="info" notifMessage="Submitting request" dismissible={true} />
        ) : null}
        {errorMessage ? <AlertNotification alertType="error" notifMessage={errorMessage} dismissible={true} /> : null}

        <form onSubmit={handleSubmit(onSubmit)} id="workSuspensionForm">
          <div className="flex flex-col w-full gap-5">
            <LabelInput
              id="name"
              type="text"
              label="Name"
              controller={{ ...register('name') }}
              isError={!!errors.name}
              errorMessage={errors.name?.message}
            />

            <LabelInput
              id="suspensionDate"
              type="date"
              label="Suspension Date"
              controller={{ ...register('suspensionDate') }}
              isError={!!errors.suspensionDate}
              errorMessage={errors.suspensionDate?.message}
            />

            {/* Type */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-900">Suspension</span>
              <div className="flex gap-6">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="radio" value={WorkSuspensionType.WHOLE_DAY} {...register('suspensionType')} />
                  Whole day
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="radio" value={WorkSuspensionType.TIME_OF_DAY} {...register('suspensionType')} />
                  Time of day
                </label>
              </div>
            </div>

            {suspensionType === WorkSuspensionType.TIME_OF_DAY ? (
              <LabelInput
                id="suspensionStartTime"
                type="time"
                label="Suspension starts at"
                controller={{ ...register('suspensionStartTime') }}
                isError={!!errors.suspensionStartTime}
                errorMessage={errors.suspensionStartTime?.message}
              />
            ) : null}

            <p className="text-xs text-gray-500">
              The suspension ends at 12:00 midnight. For night shifts only the part before midnight is suspended.
            </p>

            <LabelInput id="memoNo" type="text" label="Memo No. (optional)" controller={{ ...register('memoNo') }} />
            <LabelInput id="remarks" type="text" label="Remarks (optional)" controller={{ ...register('remarks') }} />

            {/* Preview */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-900">Preview — suspended time per schedule</span>
              {previewLoading ? (
                <LoadingSpinner size="xs" />
              ) : preview.length === 0 ? (
                <span className="text-xs text-gray-500">Choose a type{suspensionType === WorkSuspensionType.TIME_OF_DAY ? ' and start time' : ''} to see the preview.</span>
              ) : (
                <div className="overflow-y-auto border rounded max-h-48">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 text-left">Schedule</th>
                        <th className="px-2 py-1 text-left">Time</th>
                        <th className="px-2 py-1 text-right">Suspended</th>
                        <th className="px-2 py-1 text-right">Day fraction</th>
                        <th className="px-2 py-1 text-right">ND</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row) => (
                        <tr key={row.scheduleId} className="border-t">
                          <td className="px-2 py-1">{row.scheduleName}</td>
                          <td className="px-2 py-1">
                            {formatTime(row.timeIn)}–{formatTime(row.timeOut)}
                          </td>
                          <td className="px-2 py-1 text-right">{formatMinutes(row.suspendedMinutes)}</td>
                          <td className="px-2 py-1 text-right">{row.fraction.toFixed(3)}</td>
                          <td className="px-2 py-1 text-right">{row.ndSuspendedMinutes > 0 ? formatMinutes(row.ndSuspendedMinutes) : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-end w-full">
          <Button variant="info" type="submit" form="workSuspensionForm" className="disabled:cursor-not-allowed" disabled={isSubmitting}>
            <span className="text-xs font-normal">Submit</span>
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkSuspensionFormModal;
