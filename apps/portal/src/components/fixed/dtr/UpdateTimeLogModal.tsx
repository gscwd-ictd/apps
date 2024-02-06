import { Alert, Button, Modal } from '@gscwd-apps/oneui';
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

type EditDailySchedModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: EmployeeDtrWithSchedule; // TBD
};

type TimeLogRemarks = {
  remarks: string;
};
enum KEYS {
  COMPANYID = 'companyId',
  DTRDATE = 'dtrDate',
  TIMEIN = 'timeIn',
  TIMEOUT = 'timeOut',
  LUNCHIN = 'lunchIn',
  LUNCHOUT = 'lunchOut',
}
const UpdateTimeLogModal: FunctionComponent<EditDailySchedModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const {
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

  const [confirmAlertIsOpen, setConfirmAlertIsOpen] = useState<boolean>(false);

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

  const { employeeDailyRecord, updateEmployeeDtr, updateEmployeeDtrFail, updateEmployeeDtrSuccess } = useDtrStore(
    (state) => ({
      employeeDailyRecord: state.employeeDailyRecord,
      updateEmployeeDtr: state.updateEmployeeDtr,
      updateEmployeeDtrSuccess: state.updateEmployeeDtrSuccess,
      updateEmployeeDtrFail: state.updateEmployeeDtrFail,
    })
  );

  const onSubmit = async (data: Partial<EmployeeDtr>) => {
    // initialize an empty array
    let parentArray = [];

    // map each keys and push them to the initialized array
    Object.keys(dirtyFields).map((field: KEYS, index) => {
      parentArray.push([field, getValues(field) ? '' : null]);
    });

    // create the new object
    const dtr = {
      companyId: data.companyId,
      dtrDate: data.dtrDate,
      ...Object.fromEntries(parentArray),
    };

    // initialize loading
    updateEmployeeDtr();

    // patch
    // await handlePatchTimeLogs(dtr);
  };

  // patch
  const handlePatchTimeLogs = async (dtr: Partial<EmployeeDtr>) => {
    // const { error, result } = await patchEmpMonitoring('/daily-time-record/', {
    //   data: dtr,
    // });
    // console.log(dtr);
    // if (error) {
    //   // request is done set loading to false and set the error message
    //   updateEmployeeDtrFail(result);
    // } else if (!error) {
    //   // request is done set loading to false and set the update response
    //   updateEmployeeDtrSuccess(result);
    //   setConfirmAlertIsOpen(false);
    //   closeModal();
    // }
  };

  const setDefaultValues = (rowData: EmployeeDtrWithSchedule, remarks: string) => {
    reset({
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

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
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
              form="editEmployeeDtrModal"
            >
              <span className="text-xs text-white">Confirm</span>
            </button>
          </div>
        </Alert.Footer>
      </Alert>

      <Modal open={modalState} setOpen={setModalState} steady size={windowWidth > 1024 ? 'sm' : 'full'}>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full pl-5">
            <span className="text-xl md:text-2xl">Time Log Correction</span>
            <button className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full" onClick={closeModal}>
              <HiX />
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
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
                  disabled={rowData.dtr?.timeIn || rowData.dtr?.remarks === 'Rest Day' ? true : false}
                />
              </div>
              <div className="">
                <LabelInput
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
                  disabled={
                    getValues('withLunch') === true
                      ? rowData.dtr?.lunchOut || rowData.dtr?.remarks === 'Rest Day'
                        ? true
                        : false
                      : true
                  }
                />
              </div>
              <div className="">
                <LabelInput
                  id={'scheduleLunchIn'}
                  type="time"
                  label={'Lunch In'}
                  step="any"
                  isDirty={dirtyFields.lunchIn}
                  required={false}
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
                  disabled={
                    getValues('withLunch') === true
                      ? rowData.dtr?.lunchIn || rowData.dtr?.remarks === 'Rest Day'
                        ? true
                        : false
                      : true
                  }
                />
              </div>
              <div className="">
                <LabelInput
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
                  disabled={rowData.dtr?.timeOut || rowData.dtr?.remarks === 'Rest Day' ? true : false}
                />
              </div>
              <div className="">
                <LabelInput
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
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={() => setConfirmAlertIsOpen(true)}
                // disabled={isDirty && isValid ? false : true}
                disabled
                type="button"
                className="disabled:cursor-not-allowed"
              >
                Request Update Disabled
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateTimeLogModal;
