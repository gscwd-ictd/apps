/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { ConfirmationOvertimeAccomplishmentModal } from './ConfirmationOvertimeAccomplishmentModal';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import { LabelInput } from 'libs/oneui/src/components/Inputs/LabelInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { OvertimeAccomplishmentPatch } from 'libs/utils/src/lib/types/overtime.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeAccomplishmentModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeAccomplishmentDetails,
    confirmOvertimeAccomplishmentModalIsOpen,
    pendingOvertimeAccomplishmentModalIsOpen,
    setConfirmOvertimeAccomplishmentModalIsOpen,
    setOvertimeAccomplishmentPatchDetails,
  } = useOvertimeAccomplishmentStore((state) => ({
    overtimeAccomplishmentDetails: state.overtimeAccomplishmentDetails,
    confirmOvertimeAccomplishmentModalIsOpen: state.confirmOvertimeAccomplishmentModalIsOpen,
    pendingOvertimeAccomplishmentModalIsOpen: state.pendingOvertimeAccomplishmentModalIsOpen,
    setConfirmOvertimeAccomplishmentModalIsOpen: state.setConfirmOvertimeAccomplishmentModalIsOpen,
    setOvertimeAccomplishmentPatchDetails: state.setOvertimeAccomplishmentPatchDetails,
  }));

  // const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { windowWidth } = UseWindowDimensions();

  const closeConfirmOvertimeAccomplishmentModal = async () => {
    setConfirmOvertimeAccomplishmentModalIsOpen(false);
  };

  const {
    setValue,
    register,
    trigger,
    getValues,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields, isValid },
  } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      employeeId: overtimeAccomplishmentDetails.employeeId,
      overtimeApplicationId: overtimeAccomplishmentDetails.overtimeApplicationId,
      encodedTimeIn: null,
      encodedTimeOut: null,
      accomplishments: overtimeAccomplishmentDetails.remarks,
    },
  });

  const onSubmit: SubmitHandler<OvertimeAccomplishmentPatch> = (data: OvertimeAccomplishmentPatch) => {
    setOvertimeAccomplishmentPatchDetails(data);
    setConfirmOvertimeAccomplishmentModalIsOpen(true);
  };

  useEffect(() => {
    setValue('employeeId', overtimeAccomplishmentDetails.employeeId);
    setValue('overtimeApplicationId', overtimeAccomplishmentDetails.overtimeApplicationId);
  }, [watch('accomplishments')]);

  useEffect(() => {
    reset();
  }, [pendingOvertimeAccomplishmentModalIsOpen]);

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Accomplishment Report</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {/* Confirm Overtime Accomplishment Modal */}
          <ConfirmationOvertimeAccomplishmentModal
            modalState={confirmOvertimeAccomplishmentModalIsOpen}
            setModalState={setConfirmOvertimeAccomplishmentModalIsOpen}
            closeModalAction={closeConfirmOvertimeAccomplishmentModal}
          />
          {!overtimeAccomplishmentDetails ? (
            <>
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
          ) : (
            <form id="SubmitAccomplishmentForm" onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full h-full flex flex-col  ">
                <div className="w-full h-full flex flex-col gap-2 ">
                  <div className="w-full flex flex-col gap-2 p-4 rounded">
                    <AlertNotification alertType="info" notifMessage="Awaiting submission" dismissible={false} />

                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">Overtime Date:</label>

                        <div className="md:w-1/2">
                          <label className="text-slate-500 w-full text-md ">
                            {DateFormatter(overtimeAccomplishmentDetails.plannedDate)}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                          Computed IVMS Hours:
                        </label>

                        <div className="md:w-1/2">
                          <label className="text-slate-500 w-full text-md ">
                            {overtimeAccomplishmentDetails?.computedIvmsHours}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">IVMS In & Out:</label>

                        <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                          <label className="text-slate-500 w-full text-md ">
                            <LabelInput
                              id={'ivmsTimeIn'}
                              type="text"
                              label={''}
                              className="w-full  text-slate-400 font-medium"
                              textSize="md"
                              disabled
                              value={
                                overtimeAccomplishmentDetails.ivmsTimeIn
                                  ? overtimeAccomplishmentDetails.ivmsTimeIn
                                  : '--:--:--'
                              }
                            />
                          </label>
                          <label className="text-slate-500 w-auto text-lg">-</label>
                          <label className="text-slate-500 w-full text-md ">
                            <LabelInput
                              id={'ivmsTimeOut'}
                              type="text"
                              label={''}
                              className="w-full text-slate-400 font-medium"
                              textSize="md"
                              disabled
                              value={
                                overtimeAccomplishmentDetails.ivmsTimeOut
                                  ? overtimeAccomplishmentDetails.ivmsTimeOut
                                  : '--:--:--'
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                          Encode Time In & Out:
                        </label>

                        <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                          <label className="text-slate-500 w-full text-md ">
                            <LabelInput
                              required={
                                overtimeAccomplishmentDetails.ivmsTimeIn || overtimeAccomplishmentDetails.ivmsTimeOut
                                  ? false
                                  : true
                              }
                              id={'encodedTimeIn'}
                              type="time"
                              label={''}
                              className="w-full text-slate-400 font-medium cursor-pointer"
                              textSize="md"
                              controller={{
                                ...register('encodedTimeIn', {
                                  onChange: (e) => {
                                    setValue('encodedTimeIn', e.target.value, {
                                      shouldValidate: true,
                                    });
                                    trigger(); // triggers all validations for inputs
                                  },
                                }),
                              }}
                            />
                          </label>
                          <label className="text-slate-500 w-auto text-lg">-</label>
                          <label className="text-slate-500 w-full text-md ">
                            <LabelInput
                              required={
                                overtimeAccomplishmentDetails.ivmsTimeIn || overtimeAccomplishmentDetails.ivmsTimeOut
                                  ? false
                                  : true
                              }
                              id={'encodedTimeOut'}
                              type="time"
                              label={''}
                              className="w-full text-slate-400 font-medium cursor-pointer"
                              textSize="md"
                              controller={{
                                ...register('encodedTimeOut', {
                                  onChange: (e) => {
                                    setValue('encodedTimeOut', e.target.value, {
                                      shouldValidate: true,
                                    });
                                    trigger(); // triggers all validations for inputs
                                  },
                                }),
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-center w-full">
                      <div className="flex flex-row justify-between items-center w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">Purpose:</label>
                      </div>
                      <textarea
                        disabled
                        rows={2}
                        className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                        value={overtimeAccomplishmentDetails.purpose}
                      ></textarea>
                    </div>
                    <div className="flex flex-col justify-between items-center w-full">
                      <div className="flex flex-row justify-between items-center w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">Accomplishment:</label>
                      </div>
                      <textarea
                        required
                        rows={3}
                        className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                        placeholder="Please enter your accomplishments"
                        {...register('accomplishments')}
                        value={overtimeAccomplishmentDetails?.remarks ?? ''}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button
              variant={'primary'}
              size={'md'}
              loading={false}
              form="SubmitAccomplishmentForm"
              // onClick={(e) => setConfirmOvertimeAccomplishmentModalIsOpen(true)}
              type="submit"
            >
              Submit Accomplishment
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeAccomplishmentModal;
