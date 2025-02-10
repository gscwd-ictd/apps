import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import dayjs from 'dayjs';
import { EmployeeDtrWithSchedule, DtrRemarks } from 'libs/utils/src/lib/types/dtr.type';
import { isEmpty } from 'lodash';
import { Dispatch, FunctionComponent, SetStateAction, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import * as yup from 'yup';

import { LabelValue } from '../../labels/LabelValue';

type EditRemarksModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: Partial<EmployeeDtrWithSchedule>;
};

const EditRemarksModal: FunctionComponent<EditRemarksModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const { updateDtrRemarks, updateDtrRemarksSuccess, updateDtrRemarksFail, loadingUpdateDtrRemarks } = useDtrStore(
    (state) => ({
      updateDtrRemarks: state.updateDtrRemarks,
      updateDtrRemarksSuccess: state.updateDtrRemarksSuccess,
      updateDtrRemarksFail: state.updateDtrRemarksFail,
      loadingUpdateDtrRemarks: state.loading.loadingUpdateDtrRemarks,
    })
  );

  // Set the remarks field to required
  // const yupSchema = yup
  //   .object()
  //   .shape({
  //     remarks: yup.string().required('Remarks is required'),
  //   })
  //   .required();

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting: patchFormLoading },
  } = useForm<DtrRemarks>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // resolver: yupResolver(yupSchema),
    defaultValues: { remarks: '' },
  });

  const onSubmit: SubmitHandler<DtrRemarks> = async (data: DtrRemarks) => {
    updateDtrRemarks();
    handlePatchResult(data);
  };

  const handlePatchResult = async (data: DtrRemarks) => {
    data.dtrId = rowData.dtr.id;
    const { error, result } = await patchEmpMonitoring('/daily-time-record/remarks', data);

    if (error) {
      updateDtrRemarksFail(result);
    } else {
      updateDtrRemarksSuccess(result);
      reset();
      closeModalAction();
    }
  };

  // set default values in the form
  useEffect(() => {
    if (!isEmpty(rowData) && rowData.dtr) {
      setValue('remarks', rowData.dtr.baseRemarks || '');
    }
  }, [rowData, setValue]);

  // reset to empty if modal is closed
  useEffect(() => {
    if (!modalState) {
      reset({ remarks: rowData.dtr?.baseRemarks });
    }
  }, [modalState, reset]);

  return (
    <Modal open={modalState} setOpen={setModalState} steady size="sm">
      <Modal.Header withCloseBtn>
        <div className="flex justify-between w-full">
          <span className="text-xl font-medium">Edit Remarks To DTR</span>
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
        {loadingUpdateDtrRemarks ? (
          <AlertNotification
            logo={<LoadingSpinner size="xs" />}
            alertType="info"
            notifMessage="Submitting Request"
            dismissible={false}
          />
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-3" id="UpdateRemarkForm">
          <div className="flex flex-col gap-4 w-full">
            {/* Dtr date */}
            <LabelValue
              label="Date"
              value={dayjs(rowData.day).format('MMMM DD, YYYY')}
              direction="top-to-bottom"
              textSize="md"
            />

            {/* Remarks */}
            <LabelInput
              type="textarea"
              id={'remarks'}
              label={'Remarks'}
              placeholder="Add Remarks"
              rows={5}
              textSize="md"
              controller={{ ...register('remarks') }}
              isError={errors.remarks ? true : false}
              errorMessage={errors.remarks?.message}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2">
          <div className="max-w-auto">
            <Button
              variant={'primary'}
              size={'md'}
              form="UpdateRemarkForm"
              type="submit"
              className="disabled:cursor-not-allowed"
              disabled={patchFormLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditRemarksModal;
