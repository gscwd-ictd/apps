/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
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
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { GetDateDifference } from 'libs/utils/src/lib/functions/GetDateDifference';
import { OvertimeAccomplishmentStatus, OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { useTimeLogStore } from 'apps/portal/src/store/timelogs.store';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { useDtrStore } from 'apps/portal/src/store/dtr.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

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
    completedOvertimeAccomplishmentModalIsOpen,
    setConfirmOvertimeAccomplishmentModalIsOpen,
    setOvertimeAccomplishmentPatchDetails,
  } = useOvertimeAccomplishmentStore((state) => ({
    overtimeAccomplishmentDetails: state.overtimeAccomplishmentDetails,
    confirmOvertimeAccomplishmentModalIsOpen: state.confirmOvertimeAccomplishmentModalIsOpen,
    pendingOvertimeAccomplishmentModalIsOpen: state.pendingOvertimeAccomplishmentModalIsOpen,
    completedOvertimeAccomplishmentModalIsOpen: state.completedOvertimeAccomplishmentModalIsOpen,
    setConfirmOvertimeAccomplishmentModalIsOpen: state.setConfirmOvertimeAccomplishmentModalIsOpen,
    setOvertimeAccomplishmentPatchDetails: state.setOvertimeAccomplishmentPatchDetails,
  }));

  const { schedule, isHoliday, isRestday, getTimeLogs, getTimeLogsSuccess, getTimeLogsFail } = useTimeLogStore(
    (state) => ({
      schedule: state.schedule,
      isHoliday: state.isHoliday,
      isRestday: state.isRestDay,
      getTimeLogs: state.getTimeLogs,
      getTimeLogsSuccess: state.getTimeLogsSuccess,
      getTimeLogsFail: state.getTimeLogsFail,
    })
  );

  const employeeDtr = useDtrStore((state) => state.employeeDtr);
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
      setValue(
        'encodedTimeIn',
        overtimeAccomplishmentDetails?.ivmsTimeIn
          ? dayjs(overtimeAccomplishmentDetails?.ivmsTimeOut).format('YYYY-MM-DDThh:mm')
          : null
      );
      setValue(
        'encodedTimeOut',
        overtimeAccomplishmentDetails?.ivmsTimeOut
          ? dayjs(overtimeAccomplishmentDetails?.ivmsTimeOut).format('YYYY-MM-DDThh:mm')
          : null
      );
      setValue('accomplishments', overtimeAccomplishmentDetails.accomplishments);
    }
  }, [pendingOvertimeAccomplishmentModalIsOpen]);

  useEffect(() => {
    setFinalEncodedHours(overtimeAccomplishmentDetails.computedEncodedHours);
  }, [employeeDetails, overtimeAccomplishmentDetails]);

  useEffect(() => {
    let encodeTimeIn = dayjs(`${watch('encodedTimeIn')}`).format('HH:mm');
    let encodeTimeOut = dayjs(`${watch('encodedTimeOut')}`).format('HH:mm');
    let totalSeconds;

    //get difference between 2 time
    if (encodeTimeOut > encodeTimeIn) {
      totalSeconds = dayjs(`${watch('encodedTimeIn')}`).diff(dayjs(`${watch('encodedTimeOut')}`), 'second');
    } else {
      totalSeconds = dayjs(`${watch('encodedTimeIn')}`).diff(dayjs(`${watch('encodedTimeOut')}`), 'second');
    }

    let totalHours = Math.floor(totalSeconds / (60 * 60)); // How many hours?
    totalSeconds = totalSeconds - totalHours * 60 * 60; // Pull those hours out of totalSeconds

    let totalMinutes = Math.floor(totalSeconds / 60); //With hours out this will retun minutes
    totalSeconds = totalSeconds - totalMinutes * 60; // Again pull out of totalSeconds
    let finalTime = totalHours + totalMinutes / 60;

    setEncodedHours(finalTime < 0 ? finalTime * -1 : finalTime);
  }, [watch('encodedTimeIn'), watch('encodedTimeOut')]);

  // compute encoded overtime duration based on encoded time IN and OUT
  //apply every 3hrs work & 1hr break rule
  useEffect(() => {
    let numberOfBreaks; // for 3-1 rule
    //if holiday or rest day
    if (isHoliday || isRestday) {
      //if scheduled OT
      // if (overtimeAccomplishmentDetails.plannedDate > overtimeAccomplishmentDetails.dateOfOTApproval)
      //   {
      //8-1 rule - is Holiday or Rest Day
      if (Number(encodedHours.toFixed(2)) > 4 && Number(encodedHours.toFixed(2)) < 10) {
        let temporaryHours = Number(encodedHours - 1);
        setFinalEncodedHours(Number(temporaryHours.toFixed(2)));
      }
      //3-1 rule beyond 9 hours
      else if (Number(encodedHours.toFixed(2)) >= 10) {
        numberOfBreaks = (Number(encodedHours - 9) / 4).toFixed(2); // for 3-1 rule

        let temporaryHours = Number(encodedHours - 1 - Math.floor(numberOfBreaks));
        setFinalEncodedHours(Number(temporaryHours.toFixed(2)));
      } else {
        setFinalEncodedHours(Number(encodedHours.toFixed(2)));
      }
      // }
      //if emergency OT
      // else {
      //   // apply 3-1 rule only
      //   if (Number(encodedHours.toFixed(2)) >= 4) {
      //     numberOfBreaks = (Number(encodedHours) / 4).toFixed(2); // for 3-1 rule
      //     let temporaryHours = Number(encodedHours - Math.floor(numberOfBreaks));
      //     setFinalEncodedHours(Number(temporaryHours.toFixed(2)));
      //   }
      //   //no break time (less than 4 hours)
      //   else {
      //     setFinalEncodedHours(Number(encodedHours.toFixed(2)));
      //   }
      // }
    }
    //if regular work day - 3-1 rule only
    else {
      //if scheduled OT
      // if (overtimeAccomplishmentDetails.plannedDate > overtimeAccomplishmentDetails.dateOfOTApproval) {
      if (Number(encodedHours.toFixed(2)) >= 4) {
        numberOfBreaks = (Number(encodedHours) / 4).toFixed(2); // for 3-1 rule
        let temporaryHours = Number(encodedHours - Math.floor(numberOfBreaks));
        setFinalEncodedHours(Number(temporaryHours.toFixed(2)));
      }
      //no break time (less than 4 hours)
      else {
        setFinalEncodedHours(Number(encodedHours.toFixed(2)));
      }
      // }
      //if emergency OT
      // else {
      //   // apply 3-1 rule only
      //   if (Number(encodedHours.toFixed(2)) >= 4) {
      //     numberOfBreaks = (Number(encodedHours) / 4).toFixed(2); // for 3-1 rule
      //     let temporaryHours = Number(encodedHours - Math.floor(numberOfBreaks));
      //     setFinalEncodedHours(Number(temporaryHours.toFixed(2)));
      //   }
      //   //no break time (less than 4 hours)
      //   else {
      //     setFinalEncodedHours(Number(encodedHours.toFixed(2)));
      //   }
      // }
    }
  }, [encodedHours]);

  const faceScanUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${
    employeeDetails.employmentDetails.companyId
  }/${dayjs(overtimeAccomplishmentDetails.plannedDate).format('YYYY-MM-DD')}`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrFaceScan,
    isLoading: swrFaceScanIsLoading,
    error: swrFaceScanError,
  } = useSWR(
    (pendingOvertimeAccomplishmentModalIsOpen || completedOvertimeAccomplishmentModalIsOpen) &&
      employeeDetails.employmentDetails.companyId &&
      overtimeAccomplishmentDetails.plannedDate
      ? faceScanUrl
      : null,
    fetchWithToken,
    {}
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrFaceScanIsLoading) {
      getTimeLogs(swrFaceScanIsLoading);
    }
  }, [swrFaceScanIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrFaceScan)) {
      getTimeLogsSuccess(swrFaceScanIsLoading, swrFaceScan);
    }

    if (!isEmpty(swrFaceScanError)) {
      getTimeLogsFail(swrFaceScanIsLoading, swrFaceScanError.message);
    }
  }, [swrFaceScan, swrFaceScanError]);

  return (
    <>
      {!isEmpty(swrFaceScanError) ? (
        <ToastNotification toastType="error" notifMessage={`Face Scans: ${swrFaceScanError.message}.`} />
      ) : null}

      <Modal size={`${windowWidth > 1024 ? 'md' : 'full'}`} open={modalState} setOpen={setModalState}>
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
                  <div className="w-full flex flex-col gap-2 px-4 rounded">
                    <div className="w-full flex flex-col gap-0">
                      {/* Emergency OT but IVMS is incomplete/empty and OT day is Restday or Holiday - for Office Only */}
                      {/* {overtimeAccomplishmentDetails.plannedDate <= overtimeAccomplishmentDetails.dateOfOTApproval &&
                      schedule.scheduleBase === ScheduleBases.OFFICE &&
                      (!overtimeAccomplishmentDetails.ivmsTimeIn || !overtimeAccomplishmentDetails.ivmsTimeOut) &&
                      (isHoliday || isRestday) ? (
                        <AlertNotification
                          alertType="error"
                          notifMessage={
                            'Empty or Incomplete Time Log detected. Please conduct a Time Log Correction in the DTR page for this date as this was an Emergency Overtime conducted during a holiday or rest day.'
                          }
                          dismissible={false}
                        />
                      ) : null} */}

                      {/* Emergency OT but IVMS is incomplete/empty and OT day is REGULAR SCHEDULED WORK DAY - for Office Only */}
                      {/* {overtimeAccomplishmentDetails.plannedDate <= overtimeAccomplishmentDetails.dateOfOTApproval &&
                      schedule.scheduleBase === ScheduleBases.OFFICE &&
                      (!overtimeAccomplishmentDetails.ivmsTimeIn || !overtimeAccomplishmentDetails.ivmsTimeOut) &&
                      !isHoliday &&
                      !isRestday ? (
                        <AlertNotification
                          alertType="error"
                          notifMessage={
                            'Empty or Incomplete Time Log detected. Submission is not possible as this was an Emergency Overtime conducted during a regular scheduled work day.'
                          }
                          dismissible={false}
                        />
                      ) : null} */}

                      {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
                        <AlertNotification
                          alertType="warning"
                          notifMessage={
                            overtimeAccomplishmentDetails.accomplishments
                              ? 'For Supervisor Review'
                              : 'Awaiting Submission'
                          }
                          dismissible={false}
                        />
                      ) : null}

                      {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED ? (
                        <AlertNotification alertType="success" notifMessage={'Approved'} dismissible={false} />
                      ) : null}
                      {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                        <AlertNotification alertType="error" notifMessage={'Disapproved'} dismissible={false} />
                      ) : null}

                      {isHoliday || isRestday ? (
                        <AlertNotification
                          alertType="info"
                          notifMessage={'This Overtime occured during a Holiday or Restday.'}
                          dismissible={false}
                        />
                      ) : null}

                      {/* Scheduled OT but IVMS is incomplete/empty - for Office, Field, Pumping*/}
                      {overtimeAccomplishmentDetails.plannedDate > overtimeAccomplishmentDetails.dateOfOTApproval &&
                      overtimeAccomplishmentDetails.entriesForTheDay.length <= 0 ? (
                        <AlertNotification
                          alertType="error"
                          notifMessage={
                            'Empty or Incomplete Time Log detected. Please conduct a Time Log Correction in the DTR page for this date as this was a scheduled Overtime.'
                          }
                          dismissible={false}
                        />
                      ) : null}

                      {/* not submitted, late OT filing/emergency OT, beyond 5 days allowance for submission from date of approval of OT */}
                      {!overtimeAccomplishmentDetails.accomplishments &&
                      overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                      overtimeAccomplishmentDetails.plannedDate <= overtimeAccomplishmentDetails.dateOfOTApproval &&
                      GetDateDifference(
                        `${overtimeAccomplishmentDetails.dateOfOTApproval} 00:00:00`,
                        `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
                      ).days > 5 ? (
                        <AlertNotification
                          alertType="error"
                          notifMessage={'Deadline for submission has been reached.'}
                          dismissible={false}
                        />
                      ) : !overtimeAccomplishmentDetails.accomplishments &&
                        overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                        overtimeAccomplishmentDetails.plannedDate <= overtimeAccomplishmentDetails.dateOfOTApproval &&
                        GetDateDifference(
                          `${overtimeAccomplishmentDetails.dateOfOTApproval} 00:00:00`,
                          `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
                        ).days <= 5 ? (
                        <AlertNotification
                          alertType="warning"
                          notifMessage={`${
                            Number(5) -
                            GetDateDifference(
                              `${overtimeAccomplishmentDetails.dateOfOTApproval} 00:00:00`,
                              `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
                            ).days
                          } day(s) left before deadline of submission.`}
                          dismissible={false}
                        />
                      ) : null}

                      {/* not submitted, future OT filing, beyond 5 days allowance for submission from planned date of OT */}
                      {!overtimeAccomplishmentDetails.accomplishments &&
                      overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                      overtimeAccomplishmentDetails.plannedDate > overtimeAccomplishmentDetails.dateOfOTApproval &&
                      GetDateDifference(
                        `${overtimeAccomplishmentDetails.plannedDate} 00:00:00`,
                        `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
                      ).days > 5 ? (
                        <AlertNotification
                          alertType="error"
                          notifMessage={'Deadline for submission has been reached.'}
                          dismissible={false}
                        />
                      ) : !overtimeAccomplishmentDetails.accomplishments &&
                        overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                        overtimeAccomplishmentDetails.plannedDate > overtimeAccomplishmentDetails.dateOfOTApproval &&
                        GetDateDifference(
                          `${overtimeAccomplishmentDetails.plannedDate} 00:00:00`,
                          `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
                        ).days <= 5 ? (
                        <AlertNotification
                          alertType="warning"
                          notifMessage={`${
                            Number(5) -
                            GetDateDifference(
                              `${overtimeAccomplishmentDetails.plannedDate} 00:00:00`,
                              `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
                            ).days
                          } day(s) left before deadline of submission.`}
                          dismissible={false}
                        />
                      ) : null}

                      {/* Emergency OT and Encoded TimeIn/Out is empty - for Field, Pumping Only */}
                      {(overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                        finalEncodedHours <= 0) ||
                      isNaN(finalEncodedHours) ? (
                        <AlertNotification
                          alertType="error"
                          notifMessage={'Encoded Time In and Time Out fields are empty.'}
                          dismissible={false}
                        />
                      ) : null}
                    </div>

                    <div className="flex flex-wrap justify-between">
                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Overtime Type:</label>

                        <div className="w-auto ml-5">
                          <label className="text-md font-medium">
                            {DateFormatter(overtimeAccomplishmentDetails.plannedDate, 'MM-DD-YYYY') <=
                            DateFormatter(overtimeAccomplishmentDetails.dateOfOTApproval, 'MM-DD-YYYY')
                              ? 'Emergency Overtime'
                              : 'Scheduled Overtime'}
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Overtime Date:</label>

                        <div className="w-auto ml-5">
                          <label className="text-md font-medium">
                            {DateFormatter(overtimeAccomplishmentDetails.plannedDate, 'MM-DD-YYYY')}
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Estimated Hours:</label>

                        <div className="w-auto ml-5">
                          <label className="text-md font-medium">{overtimeAccomplishmentDetails.estimatedHours}</label>
                        </div>
                      </div>

                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Date Approved:</label>

                        <div className="w-auto ml-5">
                          <label className="text-md font-medium">
                            {overtimeAccomplishmentDetails.dateOfOTApproval
                              ? DateTimeFormatter(overtimeAccomplishmentDetails.dateOfOTApproval)
                              : '-- -- ----'}
                          </label>
                        </div>
                      </div>

                      <hr className="bg-slate-50 h-0.5 w-full mt-1 mb-4"></hr>

                      {/* Day 1 IVMS Entries */}
                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">IVMS Entries:</label>
                        <div className="w-auto ml-5">
                          {overtimeAccomplishmentDetails.entriesForTheDay &&
                          overtimeAccomplishmentDetails.entriesForTheDay.length > 0 &&
                          overtimeAccomplishmentDetails.entriesForTheDay.filter(
                            (e) =>
                              DateFormatter(e, 'MM-DD-YYYY') ===
                              DateFormatter(overtimeAccomplishmentDetails.plannedDate, 'MM-DD-YYYY')
                          ).length > 0 ? (
                            overtimeAccomplishmentDetails.entriesForTheDay
                              .filter(
                                (e) =>
                                  DateFormatter(e, 'MM-DD-YYYY') ===
                                  DateFormatter(overtimeAccomplishmentDetails.plannedDate, 'MM-DD-YYYY')
                              )
                              .map((logs: string, idx: number) => {
                                return (
                                  <div key={idx}>
                                    <label className="text-md font-medium ">{DateTimeFormatter(logs)}</label>
                                  </div>
                                );
                              })
                          ) : (
                            <label className="text-md font-medium ">None Found</label>
                          )}
                        </div>
                      </div>

                      {/* Day 2 IVMS Entries */}
                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">
                          IVMS Entries Next Day:
                        </label>
                        <div className="w-auto ml-5">
                          {overtimeAccomplishmentDetails.entriesForTheDay &&
                          overtimeAccomplishmentDetails.entriesForTheDay.length > 0 &&
                          overtimeAccomplishmentDetails.entriesForTheDay.filter(
                            (e) =>
                              DateFormatter(e, 'MM-DD-YYYY') !==
                              DateFormatter(overtimeAccomplishmentDetails.plannedDate, 'MM-DD-YYYY')
                          ).length > 0 ? (
                            overtimeAccomplishmentDetails.entriesForTheDay
                              .filter(
                                (e) =>
                                  DateFormatter(e, 'MM-DD-YYYY') !==
                                  DateFormatter(overtimeAccomplishmentDetails.plannedDate, 'MM-DD-YYYY')
                              )
                              .map((logs: string, idx: number) => {
                                return (
                                  <div key={idx}>
                                    <label className="text-md font-medium ">{DateTimeFormatter(logs)}</label>
                                  </div>
                                );
                              })
                          ) : (
                            <label className="text-md font-medium ">None Found</label>
                          )}
                        </div>
                      </div>

                      {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                      !overtimeAccomplishmentDetails?.accomplishments ? (
                        <div className={`flex flex-col justify-start items-start w-full px-0.5 pb-3`}>
                          <div className="flex flex-col gap-1 w-full bg-slate-100 text-sm p-2 rounded-md">
                            <span className="font-bold">Notes:</span>
                            <span className="text-justify">
                              Please use your IVMS Entries as your reference when encoding your Overtime Start and End.
                              You may use your IVMS Entries from the second day for cases where you have ended your
                              Overtime on the next day. Your IVMS entries will be used by your manager as basis for
                              information accuracy.
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {
                        <div
                          className={`flex flex-col justify-start items-start ${
                            overtimeAccomplishmentDetails?.accomplishments ? 'w-full' : 'w-full'
                          } px-0.5 pb-3`}
                        >
                          <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">
                            Encoded Start and End Time:
                          </label>

                          {overtimeAccomplishmentDetails?.accomplishments ? (
                            <div className="w-auto ml-5 flex flex-col">
                              <label className="text-md font-medium">
                                Start: {DateTimeFormatter(overtimeAccomplishmentDetails?.encodedTimeIn)}
                              </label>
                              <label className="text-md font-medium">
                                End: {DateTimeFormatter(overtimeAccomplishmentDetails?.encodedTimeOut)}
                              </label>
                              <label className="text-md font-medium">
                                Total Hours:
                                {` ${
                                  overtimeAccomplishmentDetails?.computedEncodedHours
                                    ? overtimeAccomplishmentDetails?.computedEncodedHours
                                    : isNaN(finalEncodedHours)
                                    ? 0
                                    : finalEncodedHours ?? 0
                                } Hour(s)`}
                              </label>
                            </div>
                          ) : (
                            <div className="w-full">
                              <div className="w-full flex flex-col md:flex-row lg:flex-col xl:flex-row gap-2 items-center justify-between">
                                <div className="w-full">
                                  <LabelInput
                                    id={'encodedTimeIn'}
                                    type={'datetime-local'}
                                    label={'Overtime Start'}
                                    className="w-full font-medium"
                                    textSize="sm"
                                    disabled={overtimeAccomplishmentDetails?.accomplishments ? true : false}
                                    defaultValue={
                                      overtimeAccomplishmentDetails?.ivmsTimeIn
                                        ? dayjs(overtimeAccomplishmentDetails?.ivmsTimeIn).format('YYYY-MM-DDThh:mm')
                                        : null
                                    }
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
                                </div>
                                <div className="w-full">
                                  <LabelInput
                                    id={'encodedTimeOut'}
                                    type="datetime-local"
                                    label={'Overtime End'}
                                    className="w-full font-medium"
                                    textSize="sm"
                                    disabled={overtimeAccomplishmentDetails?.accomplishments ? true : false}
                                    defaultValue={
                                      overtimeAccomplishmentDetails?.ivmsTimeOut
                                        ? dayjs(overtimeAccomplishmentDetails?.ivmsTimeOut).format('YYYY-MM-DDThh:mm')
                                        : null
                                    }
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
                                </div>
                                <div className="w-full">
                                  <LabelInput
                                    id={'encodedHours'}
                                    type="text"
                                    label={'Hours'}
                                    className="w-full font-medium"
                                    textSize="sm"
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
                                    value={`${
                                      overtimeAccomplishmentDetails?.computedEncodedHours
                                        ? overtimeAccomplishmentDetails?.computedEncodedHours
                                        : isNaN(finalEncodedHours)
                                        ? 0
                                        : finalEncodedHours
                                    } Hour(s)`}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      }

                      <hr className="bg-slate-50 h-0.5 w-full mt-3 mb-4"></hr>

                      <div className={`flex flex-col justify-start items-start w-full px-0.5 pb-3`}>
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Purpose:</label>

                        <div className="w-auto ml-5 mr-5 break-words">
                          <label className="text-md font-medium ">{overtimeAccomplishmentDetails.purpose}</label>
                        </div>
                      </div>

                      {overtimeAccomplishmentDetails?.accomplishments ? (
                        <div className={`flex flex-col justify-start items-start w-full  px-0.5 pb-3`}>
                          <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Accomplishments:</label>

                          <div className="w-auto ml-5 mr-5">
                            <label className="text-md font-medium">
                              {overtimeAccomplishmentDetails.accomplishments}
                            </label>
                          </div>
                        </div>
                      ) : null}

                      {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                        <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                          <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Remarks:</label>

                          <div className="w-auto ml-5">
                            <label className="text-md font-medium">{overtimeAccomplishmentDetails.remarks}</label>
                          </div>
                        </div>
                      ) : null}

                      <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Supervisor:</label>

                        <div className="w-auto ml-5">
                          <label className=" text-md font-medium">{overtimeAccomplishmentDetails.supervisorName}</label>
                        </div>
                      </div>

                      {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED ? (
                        <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                          <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Approved Hours:</label>

                          <div className="w-auto ml-5">
                            <label className=" text-md font-medium">
                              {overtimeAccomplishmentDetails.actualHrs ?? '---'}
                            </label>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                    !overtimeAccomplishmentDetails?.accomplishments ? (
                      <div className="flex flex-col justify-between items-center w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                          <label className="text-slate-500 text-md whitespace-nowrap">Accomplishment:</label>
                        </div>

                        <textarea
                          required
                          rows={3}
                          className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                          placeholder="Please enter your accomplishments"
                          {...register('accomplishments')}
                          defaultValue={overtimeAccomplishmentDetails?.accomplishments ?? ''}
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
          <div className="flex justify-end gap-2 px-4">
            {
              //status is approved or disapproved
              overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED ||
              overtimeAccomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ||
              overtimeAccomplishmentDetails?.accomplishments ? (
                <Button variant={'default'} size={'md'} loading={false} type="submit" onClick={closeModalAction}>
                  Close
                </Button>
              ) : (
                <Button
                  disabled={
                    !watch('accomplishments') ||
                    finalEncodedHours <= 0 ||
                    isNaN(finalEncodedHours) ||
                    //if scheduled/future OT but no time logs in array
                    (overtimeAccomplishmentDetails.plannedDate > overtimeAccomplishmentDetails.dateOfOTApproval &&
                      overtimeAccomplishmentDetails.entriesForTheDay.length <= 0)
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
              )
            }
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeAccomplishmentModal;
