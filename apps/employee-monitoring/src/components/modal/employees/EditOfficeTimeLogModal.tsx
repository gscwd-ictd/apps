import { Alert, Button, Modal } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { LabelValue } from 'apps/employee-monitoring/src/components/labels/LabelValue';
import {
  EmployeeDtr,
  useDtrStore,
} from 'apps/employee-monitoring/src/store/dtr.store';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import dayjs from 'dayjs';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { Schedule } from 'libs/utils/src/lib/types/schedule.type';
import { isEmpty, isError } from 'lodash';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
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
  TIMEOUT = 'timeOut',
  LUNCHIN = 'lunchIn',
  LUNCHOUT = 'lunchOut',
}
const EditOfficeTimeLogModal: FunctionComponent<EditDailySchedModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const {
    setValue,
    register,
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
  const [defaultDtrValues, setDefaultDtrValues] = useState<EmployeeDtr>(
    {} as EmployeeDtr
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
    updateEmployeeDtr,
    updateEmployeeDtrFail,
    updateEmployeeDtrSuccess,
  } = useDtrStore((state) => ({
    employeeDailyRecord: state.employeeDailyRecord,
    updateEmployeeDtr: state.updateEmployeeDtr,
    updateEmployeeDtrSuccess: state.updateEmployeeDtrSuccess,
    updateEmployeeDtrFail: state.updateEmployeeDtrFail,
  }));

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
    await handlePatchTimeLogs(dtr);
  };

  // patch
  const handlePatchTimeLogs = async (dtr: Partial<EmployeeDtr>) => {
    const { error, result } = await patchEmpMonitoring('/daily-time-record/', {
      data: dtr,
    });
    console.log(dtr);
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
      withLunch: true,
      shift: rowData.schedule.shift,
    });
    console.log(removeSeconds(rowData.dtr.timeIn));
    setValue('companyId', rowData.companyId);
    setValue('dtrDate', rowData.day);
    setValue('timeIn', removeSeconds(rowData.dtr.timeIn));
    setValue('timeOut', removeSeconds(rowData.dtr.timeOut));
    setValue('lunchIn', removeSeconds(rowData.dtr.lunchIn));
    setValue('lunchOut', removeSeconds(rowData.dtr.lunchOut));
    setValue('withLunch', true);
    setValue('shift', rowData.schedule.shift);
  };

  useEffect(() => {
    if (modalState) setDefaultValues(rowData);
  }, [modalState]);

  return (
    <>
      <Alert open={confirmAlertIsOpen} setOpen={setConfirmAlertIsOpen}>
        <Alert.Description>Are you sure you want to proceed?</Alert.Description>
        <Alert.Footer>
          <div className="flex justify-end w-full gap-2">
            <div className="w-[6rem]">
              <Button
                variant="info"
                onClick={() => setConfirmAlertIsOpen(false)}
                className="w-full"
              >
                <span className="text-xs">Cancel</span>
              </Button>
            </div>
            <div className="w-[6rem]">
              <Button
                className="w-full"
                type="submit"
                form="editOfficeDtrModal"
              >
                <span className="text-xs">Confirm</span>
              </Button>
            </div>
          </div>
        </Alert.Footer>
      </Alert>

      <Modal open={modalState} setOpen={setModalState} steady>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full pl-5">
            <span className="text-2xl font-medium text-gray-900">
              Time Log Correction
            </span>
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
                      onChange: (e) =>
                        setValue('timeIn', e.target.value, {
                          shouldValidate: true,
                        }),
                    }),
                  }}
                  isError={errors.timeIn ? true : false}
                  errorMessage={errors.timeIn?.message}
                  className={
                    dirtyFields.timeIn && !errors.timeIn
                      ? 'bg-green-300'
                      : dirtyFields.timeIn && errors.timeIn
                      ? 'bg-red-200'
                      : 'bg-inherit'
                  }
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
                      onChange: (e) =>
                        setValue('lunchOut', e.target.value, {
                          shouldValidate: true,
                        }),
                    }),
                  }}
                  isError={errors.lunchOut ? true : false}
                  errorMessage={errors.lunchOut?.message}
                  className={
                    dirtyFields.lunchOut && !errors.lunchOut
                      ? 'bg-green-300'
                      : dirtyFields.lunchOut && errors.lunchOut
                      ? 'bg-red-200'
                      : 'bg-inherit'
                  }

                  // disabled={IsLoading ? true : false}
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
                  controller={{ ...register('lunchIn') }}
                  isError={errors.lunchIn ? true : false}
                  errorMessage={errors.lunchIn?.message}
                  className={
                    dirtyFields.lunchIn ? 'bg-green-300' : 'bg-inherit'
                  }
                />
              </div>
              <div className="">
                <LabelInput
                  id="timeOut"
                  label="Time out"
                  type="time"
                  step="any"
                  controller={{ ...register('timeOut') }}
                  isError={errors.timeOut ? true : false}
                  errorMessage={errors.timeOut?.message}
                  className={
                    dirtyFields.timeOut ? 'bg-green-300' : 'bg-inherit'
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
              {JSON.stringify(isValid)}
              <span className="text-xs font-normal">Update</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditOfficeTimeLogModal;
