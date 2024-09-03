import { Alert, Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { LabelValue } from 'apps/employee-monitoring/src/components/labels/LabelValue';
import { EmployeeDtr, useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

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
  rowData: EmployeeDtrWithSchedule;
  companyId: string;
};

enum KEYS {
  COMPANYID = 'companyId',
  DTRDATE = 'dtrDate',
  TIMEIN = 'timeIn',
  LUNCHIN = 'lunchIn',
  LUNCHOUT = 'lunchOut',
  TIMEOUT = 'timeOut',
}

const EditOfficeTimeLogModal: FunctionComponent<EditDailySchedModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
  companyId,
}) => {
  // fetch time logs for the day
  const { data: swrTimeLogs, error: swrTimeLogsError } = useSWR(
    modalState ? `/daily-time-record/employees/entries/logs/${rowData.companyId}/${rowData.day}` : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

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

  const closeModal = () => {
    reset();
    closeModalAction();
  };

  // removes the seconds and returns 24H format
  const removeSeconds = (value: string | null) => {
    if (isEmpty(value)) return null;
    else return dayjs(rowData.dtr.dtrDate + ' ' + value).format('HH:mm');
  };

  const { updateEmployeeDtr, updateEmployeeDtrFail, updateEmployeeDtrSuccess, errorUpdateEmployeeDtr } = useDtrStore(
    (state) => ({
      updateEmployeeDtr: state.updateEmployeeDtr,
      updateEmployeeDtrSuccess: state.updateEmployeeDtrSuccess,
      updateEmployeeDtrFail: state.updateEmployeeDtrFail,
      errorUpdateEmployeeDtr: state.error.errorUpdateEmployeeDtr,
    })
  );

  const onSubmit = async (data: Partial<EmployeeDtr>) => {
    // initialize an empty array
    let parentArray = [];

    // map each keys and push them to the initialized array
    Object.keys(dirtyFields).map((field: KEYS, index) => {
      parentArray.push([field, getValues(field) ? getValues(field) : '']);
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
    await handlePatchTimeLogs(dtr);
  };

  // patch
  const handlePatchTimeLogs = async (dtr: Partial<EmployeeDtr>) => {
    const { error, result } = await patchEmpMonitoring('/daily-time-record/', dtr);

    if (error) {
      // request is done set loading to false and set the error message
      updateEmployeeDtrFail(result);
    } else if (!error) {
      // request is done set loading to false and set the update response
      updateEmployeeDtrSuccess(result);
      setConfirmAlertIsOpen(false);
      closeModal();
    }
  };

  const setDefaultValues = (rowData: EmployeeDtrWithSchedule) => {
    reset({
      companyId: rowData.companyId,
      dtrDate: rowData.day,
      timeIn: removeSeconds(rowData.dtr.timeIn),
      lunchIn: removeSeconds(rowData.dtr.lunchIn),
      lunchOut: removeSeconds(rowData.dtr.lunchOut),
      timeOut: removeSeconds(rowData.dtr.timeOut),
      withLunch: rowData.schedule.withLunch,
      shift: rowData.schedule.shift,
    });

    setValue('companyId', companyId);
    setValue('dtrDate', rowData.day);
    setValue('timeIn', removeSeconds(rowData.dtr.timeIn));
    setValue('timeOut', removeSeconds(rowData.dtr.timeOut));
    setValue('lunchIn', removeSeconds(rowData.dtr.lunchIn));
    setValue('lunchOut', removeSeconds(rowData.dtr.lunchOut));
    setValue('withLunch', rowData.schedule.withLunch);
    setValue('shift', rowData.schedule.shift);
  };

  const format12Hour = (time: string) => {
    if (!isEmpty(time)) {
      return dayjs(time, 'hh:mm:ss').format('h:mm A');
    }
    return '--';
  };

  useEffect(() => {
    if (modalState) setDefaultValues(rowData);
  }, [modalState]);

  return (
    <>
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
            <span className="text-2xl font-medium text-gray-900">Time Log Correction</span>
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
              <div className="grid sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                <LabelValue
                  label="Date"
                  value={dayjs(rowData.day).format('MMMM DD, YYYY')}
                  direction="top-to-bottom"
                  textSize="md"
                />

                <LabelValue
                  label="Shift"
                  value={rowData.schedule?.shift.charAt(0).toUpperCase() + rowData.schedule?.shift.slice(1)}
                  direction="top-to-bottom"
                  textSize="md"
                />
              </div>

              <hr />

              <div className="grid sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                <LabelValue
                  label="Time In"
                  value={format12Hour(rowData.schedule?.timeIn)}
                  direction="top-to-bottom"
                  textSize="md"
                />

                <LabelValue
                  label="Lunch Out"
                  value={format12Hour(rowData.schedule?.lunchOut)}
                  direction="top-to-bottom"
                  textSize="md"
                />

                <LabelValue
                  label="Lunch In"
                  value={format12Hour(rowData.schedule?.lunchIn)}
                  direction="top-to-bottom"
                  textSize="md"
                />

                <LabelValue
                  label="Time Out"
                  value={format12Hour(rowData.schedule?.timeOut)}
                  direction="top-to-bottom"
                  textSize="md"
                />
              </div>

              <hr />

              <div className="grid  grid-cols-1 gap-0">
                <label className="font-normal text-gray-500">IVMS Entries (Current and Next Day): </label>

                {swrTimeLogs?.data && swrTimeLogs?.data?.length > 0 ? (
                  swrTimeLogs?.data?.map((logs: string, idx: number) => {
                    return (
                      <div key={idx} className="pl-3">
                        <label className="text-sm font-medium">{logs}</label>
                      </div>
                    );
                  })
                ) : (
                  <label className="text-md font-medium pl-3">None</label>
                )}
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
                />
              </div>

              <div className="">
                <LabelInput
                  id="lunchOut"
                  label="Lunch Out"
                  step="any"
                  isDirty={dirtyFields.lunchOut}
                  type="time"
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
                  // disabled={getValues('withLunch') === true ? false : true}
                />
              </div>

              <div className="">
                <LabelInput
                  id="lunchIn"
                  label="Lunch In"
                  step="any"
                  isDirty={dirtyFields.lunchIn}
                  type="time"
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
                  // disabled={getValues('withLunch') === true ? false : true}
                />
              </div>

              <div className="">
                <LabelInput
                  id="timeOut"
                  label="Time out"
                  step="any"
                  isDirty={dirtyFields.timeOut}
                  type="time"
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
                />
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

export default EditOfficeTimeLogModal;
