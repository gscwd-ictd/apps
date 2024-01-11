/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiPlus, HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { ConfirmationOvertimeAccomplishmentModal } from './ConfirmationOvertimeAccomplishmentModal';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import { LabelInput } from 'libs/oneui/src/components/Inputs/LabelInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { OvertimeAccomplishmentPatch } from 'libs/utils/src/lib/types/overtime.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { GetDateDifference } from 'libs/utils/src/lib/functions/GetDateDifference';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { useTimeLogStore } from 'apps/portal/src/store/timelogs.store';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';

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

  const { dtr, schedule, loadingTimeLogs, errorTimeLogs, getTimeLogs, getTimeLogsSuccess, getTimeLogsFail } =
    useTimeLogStore((state) => ({
      dtr: state.dtr,
      schedule: state.schedule,
      loadingTimeLogs: state.loading.loadingTimeLogs,
      errorTimeLogs: state.error.errorTimeLogs,
      getTimeLogs: state.getTimeLogs,
      getTimeLogsSuccess: state.getTimeLogsSuccess,
      getTimeLogsFail: state.getTimeLogsFail,
    }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { windowWidth } = UseWindowDimensions();
  const [encodedHours, setEncodedHours] = useState<number>(0);
  const [finalEncodedHours, setFinalEncodedHours] = useState<number>(
    overtimeAccomplishmentDetails?.computedEncodedHours ?? 0
  );
  const closeConfirmOvertimeAccomplishmentModal = async () => {
    setConfirmOvertimeAccomplishmentModalIsOpen(false);
  };

  const { setValue, register, trigger, getValues, handleSubmit, reset, watch } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      employeeId: overtimeAccomplishmentDetails.employeeId,
      overtimeApplicationId: overtimeAccomplishmentDetails.overtimeApplicationId,
      encodedTimeIn: overtimeAccomplishmentDetails.encodedTimeIn,
      encodedTimeOut: overtimeAccomplishmentDetails.encodedTimeOut,
      accomplishments: overtimeAccomplishmentDetails.remarks,
    },
  });

  const onSubmit: SubmitHandler<OvertimeAccomplishmentPatch> = (data: OvertimeAccomplishmentPatch) => {
    setOvertimeAccomplishmentPatchDetails(data);
    setConfirmOvertimeAccomplishmentModalIsOpen(true);
  };

  useEffect(() => {
    if (!pendingOvertimeAccomplishmentModalIsOpen) {
      reset();
    } else {
      setValue('employeeId', overtimeAccomplishmentDetails.employeeId);
      setValue('overtimeApplicationId', overtimeAccomplishmentDetails.overtimeApplicationId);
      setValue('encodedTimeIn', overtimeAccomplishmentDetails.encodedTimeIn);
      setValue('encodedTimeOut', overtimeAccomplishmentDetails.encodedTimeOut);
      setValue('accomplishments', overtimeAccomplishmentDetails.accomplishments);
    }
  }, [pendingOvertimeAccomplishmentModalIsOpen]);

  useEffect(() => {}, [finalEncodedHours]);

  useEffect(() => {
    setFinalEncodedHours(overtimeAccomplishmentDetails.computedEncodedHours);
  }, []);

  useEffect(() => {
    setEncodedHours(
      GetDateDifference(`2023-01-01 ${watch('encodedTimeIn')}:00`, `2023-01-01 ${watch('encodedTimeOut')}:00`).hours
    );
  }, [watch('encodedTimeIn'), watch('encodedTimeOut')]);

  // compute encoded overtime duration based on encoded time IN and OUT
  useEffect(() => {
    if (encodedHours % 5 == 0 || encodedHours >= 5) {
      if (encodedHours % 5 == 0) {
        setFinalEncodedHours(encodedHours - Math.floor(encodedHours / 5));
      } else if (encodedHours / 5 > 0) {
        setFinalEncodedHours(encodedHours - Math.floor(encodedHours / 5));
      } else {
        setFinalEncodedHours(encodedHours);
      }
    } else {
      setFinalEncodedHours(encodedHours);
    }
  }, [encodedHours]);

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
                    {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
                      <AlertNotification
                        alertType="warning"
                        notifMessage={
                          overtimeAccomplishmentDetails.accomplishments
                            ? 'For Supervisor Approval'
                            : 'Awaiting Submission'
                        }
                        dismissible={false}
                      />
                    ) : null}

                    {/* not submitted, late OT filing, beyond 5 days allowance for submission from date of approval of OT */}
                    {!overtimeAccomplishmentDetails.accomplishments &&
                    overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                    overtimeAccomplishmentDetails.plannedDate < overtimeAccomplishmentDetails.dateOfOTApproval &&
                    GetDateDifference(
                      `${overtimeAccomplishmentDetails.dateOfOTApproval} 00:00:00`,
                      `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
                    ).days > 5 ? (
                      <AlertNotification
                        alertType="warning"
                        notifMessage={'Deadline for submission has been reached'}
                        dismissible={false}
                      />
                    ) : null}

                    {/* not submitted, future OT filing, beyond 30 days allowance for submission from planned date of OT */}
                    {!overtimeAccomplishmentDetails.accomplishments &&
                    overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                    overtimeAccomplishmentDetails.plannedDate >= overtimeAccomplishmentDetails.dateOfOTApproval &&
                    GetDateDifference(
                      `${overtimeAccomplishmentDetails.plannedDate} 00:00:00`,
                      `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
                    ).days > 30 ? (
                      <AlertNotification
                        alertType="warning"
                        notifMessage={'Deadline for submission has been reached'}
                        dismissible={false}
                      />
                    ) : null}

                    {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED ? (
                      <AlertNotification alertType="info" notifMessage={'Approved'} dismissible={false} />
                    ) : null}
                    {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                      <AlertNotification alertType="error" notifMessage={'Disapproved'} dismissible={false} />
                    ) : null}

                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">Overtime Date:</label>

                        <div className="md:w-1/2">
                          <label className="text-slate-500 w-full text-md ">
                            {DateFormatter(overtimeAccomplishmentDetails.plannedDate, 'MM-DD-YYYY')}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">Approval Date:</label>

                        <div className="md:w-1/2">
                          <label className="text-slate-500 w-full text-md ">
                            {DateFormatter(overtimeAccomplishmentDetails.dateOfOTApproval, 'MM-DD-YYYY')}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                          Overtime Estimated Hours:
                        </label>

                        <div className="md:w-1/2">
                          <label className="text-slate-500 w-full text-md ">
                            {overtimeAccomplishmentDetails?.estimatedHours}
                          </label>
                        </div>
                      </div>
                    </div>

                    {schedule.scheduleBase === ScheduleBases.OFFICE ? (
                      <>
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
                            <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                              IVMS In & Out:
                            </label>

                            <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                              <label className="text-slate-500 w-full text-md ">
                                <LabelInput
                                  id={'ivmsTimeIn'}
                                  type="text"
                                  label={''}
                                  className="w-full  text-slate-400 font-medium"
                                  textSize="md"
                                  disabled
                                  value={UseTwelveHourFormat(overtimeAccomplishmentDetails.ivmsTimeIn)}
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
                                  value={UseTwelveHourFormat(overtimeAccomplishmentDetails.ivmsTimeOut)}
                                />
                              </label>
                              <label className="text-slate-500 w-full text-md ">
                                <LabelInput
                                  id={'computedIvmsHours'}
                                  type="text"
                                  label={''}
                                  className="w-full text-slate-400 font-medium"
                                  textSize="md"
                                  disabled
                                  value={`${overtimeAccomplishmentDetails.computedIvmsHours ?? 0} Hour(s)`}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                          Encode Overtime Start and End Time:
                        </label>

                        <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                          <label className="text-slate-500 w-full text-md ">
                            <LabelInput
                              required={
                                overtimeAccomplishmentDetails.ivmsTimeIn && overtimeAccomplishmentDetails.ivmsTimeOut
                                  ? false
                                  : true
                              }
                              id={'encodedTimeIn'}
                              type={'time'}
                              label={''}
                              className="w-full text-slate-400 font-medium cursor-pointer"
                              textSize="md"
                              disabled={
                                overtimeAccomplishmentDetails?.accomplishments ||
                                (overtimeAccomplishmentDetails.ivmsTimeIn && overtimeAccomplishmentDetails.ivmsTimeOut)
                                  ? true
                                  : false
                              }
                              defaultValue={overtimeAccomplishmentDetails?.encodedTimeIn ?? null}
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
                              disabled={
                                overtimeAccomplishmentDetails?.accomplishments ||
                                (overtimeAccomplishmentDetails.ivmsTimeIn && overtimeAccomplishmentDetails.ivmsTimeOut)
                                  ? true
                                  : false
                              }
                              defaultValue={overtimeAccomplishmentDetails?.encodedTimeOut ?? null}
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
                          <label className="text-slate-500 w-full text-md ">
                            <LabelInput
                              id={'encodedHours'}
                              type="text"
                              label={''}
                              className="w-full text-slate-400 font-medium"
                              textSize="md"
                              isError={
                                overtimeAccomplishmentDetails?.accomplishments
                                  ? false
                                  : overtimeAccomplishmentDetails?.computedEncodedHours
                                  ? false
                                  : finalEncodedHours <= 0 ||
                                    (isNaN(finalEncodedHours) && overtimeAccomplishmentDetails.accomplishments)
                                  ? true
                                  : false
                              }
                              disabled
                              // value={overtimeAccomplishmentDetails?.computedEncodedHours ?? finalEncodedHours}
                              value={`${
                                overtimeAccomplishmentDetails?.computedEncodedHours
                                  ? overtimeAccomplishmentDetails?.computedEncodedHours
                                  : isNaN(finalEncodedHours)
                                  ? 0
                                  : finalEncodedHours
                              } Hour(s)`}
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
                        disabled={
                          overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED ||
                          overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ||
                          overtimeAccomplishmentDetails?.accomplishments
                            ? true
                            : false
                        }
                        rows={3}
                        className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                        placeholder="Please enter your accomplishments"
                        {...register('accomplishments')}
                        defaultValue={overtimeAccomplishmentDetails?.accomplishments ?? ''}
                      ></textarea>
                    </div>
                    {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                      <div className="flex flex-col justify-between items-center w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                          <label className="text-slate-500 text-md font-medium whitespace-nowrap">Remarks:</label>
                        </div>
                        <textarea
                          required
                          rows={3}
                          className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                          placeholder="Please enter your accomplishments"
                          {...register('accomplishments')}
                          defaultValue={overtimeAccomplishmentDetails?.remarks ?? ''}
                        ></textarea>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED ||
            overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ||
            overtimeAccomplishmentDetails?.accomplishments ? (
              <Button variant={'primary'} size={'md'} loading={false} type="submit" onClick={closeModalAction}>
                Close
              </Button>
            ) : (
              <Button
                disabled={
                  ((!overtimeAccomplishmentDetails.ivmsTimeIn || !overtimeAccomplishmentDetails.ivmsTimeOut) &&
                    (finalEncodedHours <= 0 || isNaN(finalEncodedHours))) ||
                  overtimeAccomplishmentDetails.plannedDate > dayjs().format('YYYY-MM-DD') ||
                  !watch('accomplishments')
                    ? true
                    : false
                }
                variant={'primary'}
                size={'md'}
                loading={false}
                form="SubmitAccomplishmentForm"
                type="submit"
              >
                {'Submit Accomplishment'}
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeAccomplishmentModal;
