import { Alert, Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { LabelValue } from 'apps/employee-monitoring/src/components/labels/LabelValue';
import { EmployeeDtr, useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import dayjs from 'dayjs';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { isEmpty } from 'lodash';
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OfficeSchema } from './OfficeSchema';

type EditDailySchedModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: EmployeeDtrWithSchedule; // TBD
};

enum KEYS {
  COMPANYID = 'companyId',
  DTRDATE = 'dtrDate',
  TIMEIN = 'timeIn',
  LUNCHIN = 'lunchIn',
  LUNCHOUT = 'lunchOut',
  TIMEOUT = 'timeOut',
}

const EditRemarksModal: FunctionComponent<EditDailySchedModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const {
    setValue,
    register,
    trigger,
    watch,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isValid },
  } = useForm<EmployeeDtr>({
    resolver: yupResolver(OfficeSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const [confirmAlertIsOpen, setConfirmAlertIsOpen] = useState<boolean>(false);

  // default values
  // const [defaultDtrValues, setDefaultDtrValues] = useState<EmployeeDtr>({} as EmployeeDtr);

  const closeModal = () => {
    reset();
    closeModalAction();
  };

  // removes the seconds and returns 24H format
  // const removeSeconds = (value: string | null) => {
  //   if (isEmpty(value)) return null;
  //   else return dayjs(rowData.dtr.dtrDate + ' ' + value).format('HH:mm');
  // };

  const { updateEmployeeDtr, updateEmployeeDtrFail, updateEmployeeDtrSuccess, errorUpdateEmployeeDtr } = useDtrStore(
    (state) => ({
      updateEmployeeDtr: state.updateEmployeeDtr,
      updateEmployeeDtrSuccess: state.updateEmployeeDtrSuccess,
      updateEmployeeDtrFail: state.updateEmployeeDtrFail,
      errorUpdateEmployeeDtr: state.error.errorUpdateEmployeeDtr,
    })
  );

  const onSubmit = async (data: Partial<EmployeeDtr>) => {
    //   // initialize an empty array
    //   let parentArray = [];
    //   // map each keys and push them to the initialized array
    //   Object.keys(dirtyFields).map((field: KEYS, index) => {
    //     parentArray.push([field, getValues(field) ? getValues(field) : '']);
    //   });
    //   // create the new object
    //   const dtr = {
    //     companyId: data.companyId,
    //     dtrDate: data.dtrDate,
    //     ...Object.fromEntries(parentArray),
    //   };
    //   // initialize loading
    //   updateEmployeeDtr();
    //   // patch
    //   await handlePatchTimeLogs(dtr);
  };

  // patch
  // const handlePatchTimeLogs = async (dtr: Partial<EmployeeDtr>) => {
  //   const { error, result } = await patchEmpMonitoring('/daily-time-record/', dtr);

  //   if (error) {
  //     // request is done set loading to false and set the error message
  //     updateEmployeeDtrFail(result);
  //   } else if (!error) {
  //     // request is done set loading to false and set the update response
  //     updateEmployeeDtrSuccess(result);
  //     setConfirmAlertIsOpen(false);
  //     closeModal();
  //   }
  // };

  // const setDefaultValues = (rowData: EmployeeDtrWithSchedule) => {
  //   reset({
  //     remarks: rowData.remarks,
  //   });

  //   setValue('remarks', rowData.remarks);

  // };

  // useEffect(() => {
  //   if (modalState) setDefaultValues(rowData);
  // }, [modalState]);

  return (
    <>
      {/* Error notification */}
      {!isEmpty(errorUpdateEmployeeDtr) ? (
        <ToastNotification
          notifMessage="Something went wrong in updating Employee DTR. Try again later."
          toastType="error"
        />
      ) : null}

      <Alert open={confirmAlertIsOpen} setOpen={setConfirmAlertIsOpen}>
        <Alert.Description>Are you sure with these changes?</Alert.Description>
        <Alert.Footer>
          <div className="flex justify-end w-full gap-1">
            <button
              onClick={() => setConfirmAlertIsOpen(false)}
              className="w-[5rem] rounded bg-gray-200 py-1 px-0 hover:bg-gray-300 active:bg-gray-400"
            >
              <span className="text-xs">Cancel</span>
            </button>

            <button
              className="w-[5rem] rounded bg-blue-400 py-1 px-0 hover:bg-blue-500 active:bg-blue-600"
              type="submit"
              form="editOfficeDtrModal"
            >
              <span className="text-xs text-white">Confirm</span>
            </button>
          </div>
        </Alert.Footer>
      </Alert>

      <Modal open={modalState} setOpen={setModalState} steady>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full pl-5">
            <span className="text-2xl font-medium text-gray-900">Update Remarks</span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModal}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="editOfficeDtrModal">
            <div className="flex flex-col w-full gap-5 px-5 mt-5">
              <div className="">
                <LabelValue
                  label="Date"
                  value={dayjs(rowData.day).format('MMMM DD, YYYY')}
                  direction="top-to-bottom"
                  textSize="md"
                />
              </div>

              <div className="">
                {/* <LabelInput
                  id="remarks"
                  type="textarea"
                  label="Remarks"
                  step="any"
                  // isDirty={dirtyFields.remarks}
                  controller={{
                    ...register('remarks', {
                      onChange: (e) => {
                        setValue('timeIn', e.target.value, {
                          shouldValidate: true,
                        });
                        trigger(); // triggers all validations for inputs
                      },
                    }),
                  }}
                  isError={errors.remarks ? true : false}
                  errorMessage={errors.remarks?.message}
                  className={
                    dirtyFields.remarks && !errors.remarks ? 'bg-green-300' : errors.remarks ? 'bg-red-200' : 'bg-inherit'
                  }
                /> */}
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="button"
              className="disabled:cursor-not-allowed"
              onClick={() => setConfirmAlertIsOpen(true)}
              disabled={isDirty && isValid ? false : true}
            >
              <span className="text-xs font-normal">Update</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditRemarksModal;