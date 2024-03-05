import { Alert, AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { LabelValue } from 'apps/employee-monitoring/src/components/labels/LabelValue';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import dayjs from 'dayjs';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { isEmpty, isError } from 'lodash';
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OfficeSchema } from './OfficeSchema';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { HiX } from 'react-icons/hi';
import { EmployeeDtr, useDtrStore } from 'apps/portal/src/store/dtr.store';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { ConfirmationUpdateTimeLogModal } from './ConfirmationModal';

type EditDailySchedModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: EmployeeDtrWithSchedule; // TBD
};

type TimeLogRemarks = {
  remarks: string;
};
// enum KEYS {
//   COMPANYID = 'companyId',
//   DTRDATE = 'dtrDate',
//   TIMEIN = 'timeIn',
//   TIMEOUT = 'timeOut',
//   LUNCHIN = 'lunchIn',
//   LUNCHOUT = 'lunchOut',
// }

const UpdateTimeLogModal: FunctionComponent<EditDailySchedModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const {
    watch,
    setValue,
    register,
    trigger,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isValid },
  } = useForm<EmployeeDtr & TimeLogRemarks>({
    resolver: yupResolver(OfficeSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  // default values
  const [defaultDtrValues, setDefaultDtrValues] = useState<EmployeeDtr & TimeLogRemarks>(
    {} as EmployeeDtr & TimeLogRemarks
  );

  const closeModal = () => {
    reset();
    closeModalAction();
  };

  // removes the seconds and returns 24H format
  const removeSeconds = (value: string | null) => {
    if (isEmpty(value)) return null;
    else return dayjs(rowData.dtr.dtrDate + ' ' + value).format('HH:mm');
  };

  const {
    employeeDailyRecord,
    errorUpdateEmployeeDtr,
    loadingUpdateEmployeeDtr,
    confirmUpdateModalIsOpen,
    setConfirmUpdateModalIsOpen,
  } = useDtrStore((state) => ({
    employeeDailyRecord: state.response.employeeDailyRecord,
    errorUpdateEmployeeDtr: state.error.errorUpdateEmployeeDtr,
    loadingUpdateEmployeeDtr: state.loading.loadingUpdateEmployeeDtr,
    confirmUpdateModalIsOpen: state.confirmUpdateModalIsOpen,
    setConfirmUpdateModalIsOpen: state.setConfirmUpdateModalIsOpen,
  }));

  const onSubmit = async (data: Partial<EmployeeDtr>) => {
    setConfirmUpdateModalIsOpen(true);
  };

  const setDefaultValues = (rowData: EmployeeDtrWithSchedule, remarks: string) => {
    reset({
      dtrId: rowData.dtr.id,
      companyId: rowData.companyId,
      dtrDate: rowData.day,
      timeIn: removeSeconds(rowData.dtr.timeIn),
      lunchIn: removeSeconds(rowData.dtr.lunchIn),
      lunchOut: removeSeconds(rowData.dtr.lunchOut),
      timeOut: removeSeconds(rowData.dtr.timeOut),
      withLunch: true,
      shift: rowData.schedule.shift,
      remarks: remarks,
    });

    setDefaultDtrValues({
      dtrId: rowData.dtr.id,
      companyId: rowData.companyId,
      dtrDate: rowData.day,
      timeIn: removeSeconds(rowData.dtr.timeIn),
      lunchIn: removeSeconds(rowData.dtr.lunchIn),
      lunchOut: removeSeconds(rowData.dtr.lunchOut),
      timeOut: removeSeconds(rowData.dtr.timeOut),
      withLunch: true,
      shift: rowData.schedule.shift,
      remarks: remarks,
    });

    setValue('dtrId', rowData.dtr.id);
    setValue('companyId', rowData.companyId);
    setValue('dtrDate', rowData.day);
    setValue('timeIn', removeSeconds(rowData.dtr.timeIn));
    setValue('timeOut', removeSeconds(rowData.dtr.timeOut));
    setValue('lunchIn', removeSeconds(rowData.dtr.lunchIn));
    setValue('lunchOut', removeSeconds(rowData.dtr.lunchOut));
    setValue('withLunch', true);
    setValue('shift', rowData.schedule.shift);
    setValue('remarks', remarks);
  };

  useEffect(() => {
    if (modalState) setDefaultValues(rowData, '');
  }, [modalState]);

  // cancel action for Confirmation Application Modal
  const closeConfirmationModal = async () => {
    setConfirmUpdateModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <ConfirmationUpdateTimeLogModal
        modalState={confirmUpdateModalIsOpen}
        setModalState={setConfirmUpdateModalIsOpen}
        closeModalAction={closeConfirmationModal}
        dataToSubmit={{
          dtrId: watch('dtrId'),
          timeIn: watch('timeIn'),
          timeOut: watch('timeOut'),
          lunchIn: watch('lunchIn'),
          lunchOut: watch('lunchOut'),
          remarks: watch('remarks'),
        }}
        title={'Time Log Correction'}
      />

      <Modal open={modalState} setOpen={setModalState} size={windowWidth > 1024 ? 'sm' : 'full'}>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full pl-5">
            <span className="text-xl md:text-2xl">Time Log Correction</span>
            <button className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full" onClick={closeModal}>
              <HiX />
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {rowData?.hasPendingDtrCorrection ? (
            <AlertNotification
              alertType={'warning'}
              notifMessage={'You currently have a pending Time Log Correction application for this date.'}
              dismissible={false}
            />
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="editEmployeeDtrModal">
            <div className="flex flex-col w-full gap-5 px-5 mt-5">
              <div className="">
                <LabelValue
                  label="Date"
                  value={DateFormatter(rowData.day, 'MMMM DD, YYYY')}
                  direction="top-to-bottom"
                  textSize="md"
                />
              </div>

              <hr />

              <div className="">
                <LabelInput
                  required
                  id="timeIn"
                  label="Time in"
                  step="any"
                  isDirty={dirtyFields.timeIn}
                  type="time"
                  controller={{
                    ...register('timeIn', {
                      onChange: (e) => {
                        setValue('timeIn', e.target.value, {
                          shouldValidate: true,
                        });
                        trigger(); // triggers all validations for inputs
                      },
                    }),
                  }}
                  isError={errors.timeIn ? true : false}
                  errorMessage={errors.timeIn?.message}
                  className={
                    dirtyFields.timeIn && !errors.timeIn ? 'bg-green-300' : errors.timeIn ? 'bg-red-200' : 'bg-inherit'
                  }
                  disabled={rowData.dtr?.timeIn ? true : false}
                />
              </div>
              <div className="">
                <LabelInput
                  required={false}
                  id={'scheduleLunchOut'}
                  type="time"
                  label={'Lunch Out'}
                  isDirty={dirtyFields.lunchOut}
                  controller={{
                    ...register('lunchOut', {
                      onChange: (e) => {
                        setValue('lunchOut', e.target.value, {
                          shouldValidate: true,
                        });
                        trigger(); // trigger all validations for inputs
                      },
                    }),
                  }}
                  isError={errors.lunchOut ? true : false}
                  errorMessage={errors.lunchOut?.message}
                  className={
                    dirtyFields.lunchOut && !errors.lunchOut
                      ? 'bg-green-300'
                      : errors.lunchOut
                      ? 'bg-red-200'
                      : 'bg-inherit'
                  }
                  disabled={getValues('withLunch') === true ? (rowData.dtr?.lunchOut ? true : false) : true}
                />
              </div>
              <div className="">
                <LabelInput
                  required={false}
                  id={'scheduleLunchIn'}
                  type="time"
                  label={'Lunch In'}
                  step="any"
                  isDirty={dirtyFields.lunchIn}
                  controller={{
                    ...register('lunchIn', {
                      onChange: (e) => {
                        setValue('lunchIn', e.target.value, {
                          shouldValidate: true,
                        });
                        trigger(); // trigger all validations for inputs
                      },
                    }),
                  }}
                  isError={errors.lunchIn ? true : false}
                  errorMessage={errors.lunchIn?.message}
                  className={
                    dirtyFields.lunchIn && !errors.lunchIn
                      ? 'bg-green-300'
                      : errors.lunchIn
                      ? 'bg-red-200'
                      : 'bg-inherit'
                  }
                  disabled={getValues('withLunch') === true ? (rowData.dtr?.lunchIn ? true : false) : true}
                />
              </div>
              <div className="">
                <LabelInput
                  required
                  id="timeOut"
                  label="Time out"
                  type="time"
                  isDirty={dirtyFields.timeOut}
                  step="any"
                  controller={{
                    ...register('timeOut', {
                      onChange: (e) => {
                        setValue('timeOut', e.target.value, {
                          shouldValidate: true,
                        });
                        trigger(); // trigger all validations for all inputs
                      },
                    }),
                  }}
                  isError={errors.timeOut ? true : false}
                  errorMessage={errors.timeOut?.message}
                  className={
                    dirtyFields.timeOut && !errors.timeOut
                      ? 'bg-green-300'
                      : errors.timeOut
                      ? 'bg-red-200'
                      : 'bg-inherit'
                  }
                  disabled={rowData.dtr?.timeOut ? true : false}
                />
              </div>
              <div className="">
                <LabelInput
                  required
                  id="remarks"
                  label="Remarks"
                  type="textarea"
                  rows={3}
                  isDirty={dirtyFields.remarks}
                  step="any"
                  placeholder="Enter remarks"
                  controller={{
                    ...register('remarks', {
                      onChange: (e) => {
                        setValue('remarks', e.target.value, {
                          shouldValidate: true,
                        });
                        trigger(); // trigger all validations for all inputs
                      },
                    }),
                  }}
                  isError={errors.remarks ? true : false}
                  errorMessage={errors.remarks?.message}
                  className={
                    dirtyFields.remarks && !errors.remarks
                      ? 'bg-green-300'
                      : errors.remarks
                      ? 'bg-red-200'
                      : 'bg-inherit'
                  }
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              {rowData?.hasPendingDtrCorrection ? (
                <Button
                  variant={'default'}
                  size={'md'}
                  loading={false}
                  onClick={(e) => closeModalAction()}
                  type="submit"
                >
                  Close
                </Button>
              ) : (
                <Button
                  form="editEmployeeDtrModal"
                  variant={'primary'}
                  size={'md'}
                  loading={false}
                  type="submit"
                  disabled={
                    !watch('remarks') ||
                    !watch('timeIn') ||
                    !watch('timeOut') ||
                    (!rowData?.dtr?.timeIn && !rowData?.dtr?.timeOut)
                      ? true
                      : false
                  }
                >
                  Request Update
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateTimeLogModal;
