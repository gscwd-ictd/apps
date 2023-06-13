import { Alert, Button, Modal } from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { LabelValue } from 'apps/employee-monitoring/src/components/labels/LabelValue';
import { EmployeeAttendance } from 'apps/employee-monitoring/src/store/dtr.store';
import dayjs from 'dayjs';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';

type EditDailySchedModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: EmployeeAttendance; // TBD
};

const EditDailySchedModal: FunctionComponent<EditDailySchedModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const {
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeAttendance>();

  const [confirmAlertIsOpen, setConfirmAlertIsOpen] = useState<boolean>(false);

  const closeModal = () => {
    reset();
    closeModalAction();
  };

  const onSubmit = (data: Partial<EmployeeAttendance>) => {
    console.log(data);
    // setConfirmAlertIsOpen(false);
    // closeModal();
  };

  const setDefaultValues = (rowData: EmployeeAttendance) => {
    setValue('timeIn', rowData.timeIn);
    setValue('timeOut', rowData.timeOut);
    setValue('lunchIn', rowData.lunchIn);
    setValue('lunchOut', rowData.lunchOut);
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
                Cancel
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
                  value={dayjs(rowData.date).format('MMMM DD, YYYY')}
                  direction="top-to-bottom"
                  textSize="md"
                />
              </div>

              <hr />

              <div className="">
                <LabelInput
                  id="timeIn"
                  label="Time in"
                  type="time"
                  controller={{ ...register('timeIn') }}
                  isError={errors.timeIn ? true : false}
                  errorMessage={errors.timeIn?.message}
                />
              </div>
              <div className="">
                <LabelInput
                  id="timeOut"
                  label="Time out"
                  type="time"
                  controller={{ ...register('timeOut') }}
                  isError={errors.timeOut ? true : false}
                  errorMessage={errors.timeOut?.message}
                />
              </div>

              <div className="">
                <LabelInput
                  id={'scheduleLunchIn'}
                  type="time"
                  label={'Lunch In'}
                  controller={{ ...register('lunchIn') }}
                  isError={errors.lunchIn ? true : false}
                  errorMessage={errors.lunchIn?.message}
                  // disabled={IsLoading ? true : false}
                />
              </div>
              <div className="">
                <LabelInput
                  id={'scheduleLunchOut'}
                  type="time"
                  label={'Lunch Out'}
                  controller={{ ...register('lunchOut') }}
                  isError={errors.lunchOut ? true : false}
                  errorMessage={errors.lunchOut?.message}
                  // disabled={IsLoading ? true : false}
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
              // disabled={IsLoading ? true : false}
            >
              <span className="text-xs font-normal">Update</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditDailySchedModal;
