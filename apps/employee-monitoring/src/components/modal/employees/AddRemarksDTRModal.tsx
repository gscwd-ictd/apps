import { Modal, Button, AlertNotification, LoadingSpinner } from '@gscwd-apps/oneui';
import { FunctionComponent, useEffect, useState } from 'react';
import DailyTimeRecordCalendar from './DailyTimeRecordCalendar';

import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { DtrRemarksToSelectedDates } from 'libs/utils/src/lib/types/dtr.type';

import { SubmitHandler, useForm } from 'react-hook-form';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { LabelInput } from '../../inputs/LabelInput';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  companyId: string;
};

const AddRemarksDTRModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  companyId,
}) => {
  const {
    addDtrRemarksToSelectedDates,
    addDtrRemarksToSelectedDatesSuccess,
    addDtrRemarksToSelectedDatesFail,
    loadingAddDtrRemarksToSelectedDates,
  } = useDtrStore((state) => ({
    addDtrRemarksToSelectedDates: state.addDtrRemarksToSelectedDates,
    addDtrRemarksToSelectedDatesSuccess: state.addDtrRemarksToSelectedDatesSuccess,
    addDtrRemarksToSelectedDatesFail: state.addDtrRemarksToSelectedDatesFail,
    loadingAddDtrRemarksToSelectedDates: state.loading.loadingAddDtrRemarksToSelectedDates,
  }));

  const {
    watch,
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting: postFormLoading },
  } = useForm<DtrRemarksToSelectedDates>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { dtrDates: [], remarks: '', companyId: '' },
  });

  const onSubmit: SubmitHandler<DtrRemarksToSelectedDates> = (data: DtrRemarksToSelectedDates) => {
    handlePostResult(data);
    addDtrRemarksToSelectedDates();
  };

  const handlePostResult = async (data: DtrRemarksToSelectedDates) => {
    data.companyId = companyId;
    const { error, result } = await postEmpMonitoring('/daily-time-record/remarks', data);

    if (error) {
      addDtrRemarksToSelectedDatesFail(result);
    } else {
      addDtrRemarksToSelectedDatesSuccess(result);
      reset();
      closeModalAction();
    }
  };

  // handle selection of dates

  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleDateSelect = (dates: string[]) => {
    setSelectedDates(dates);
    setValue('dtrDates', dates);
  };

  useEffect(() => {
    setValue('dtrDates', selectedDates);
  }, [selectedDates, setValue]);

  // If modal is closed, reset input values
  useEffect(() => {
    if (!modalState) {
      reset({
        dtrDates: [],
        remarks: '',
        companyId: '',
      });
    }
  }, [modalState, reset]);

  // Watch for changes in the form
  const watchAllFields = watch();

  return (
    <Modal open={modalState} setOpen={setModalState} steady size="sm">
      <Modal.Header withCloseBtn>
        <div className="flex justify-between w-full">
          <span className="text-xl font-medium">Add Remarks To DTR</span>
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
        {loadingAddDtrRemarksToSelectedDates ? (
          <AlertNotification
            logo={<LoadingSpinner size="xs" />}
            alertType="info"
            notifMessage="Submitting Request"
            dismissible={true}
          />
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-3" id="SelectDatesForRemarkForm">
          <label className="text-md font-medium text-gray-900">Select Dates</label>
          <DailyTimeRecordCalendar id="dtr-calendar" onDateSelect={handleDateSelect} />
          <div className="flex flex-col gap-4 w-full">
            {/* Remarks */}
            <LabelInput
              type="textarea"
              id={'remarks'}
              label={'Remarks'}
              placeholder="Add Remarks"
              rows={5}
              textSize="md"
              controller={{ ...register('remarks', { required: true }) }}
              isError={errors.remarks ? true : false}
              errorMessage={errors.remarks ? 'This field is required' : ''}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2">
          <div className="max-w-auto">
            <Button
              variant="primary"
              size={'md'}
              form="SelectDatesForRemarkForm"
              type="submit"
              className="disabled:cursor-not-allowed"
              loading={loadingAddDtrRemarksToSelectedDates || postFormLoading}
              disabled={
                postFormLoading || !watchAllFields.remarks || watchAllFields.dtrDates.length === 0 ? true : false
              }
            >
              Add Remarks
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRemarksDTRModal;
