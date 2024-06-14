/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../store/leave.store';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useEmployeeStore } from '../../../store/employee.store';
import axios from 'axios';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { MySelectList } from '../../modular/inputs/SelectList';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { HolidayTypes } from 'libs/utils/src/lib/enums/holiday-types.enum';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import dayjs from 'dayjs';
import { LeaveCancellationStatus, LeaveDateStatus, LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { ConfirmationLeaveCancellationModal } from './ConfirmationModal';
import { LeaveCancellationSubmission } from 'libs/utils/src/lib/types/leave-application.type';

type CancelLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const CancelLeaveModal = ({ modalState, setModalState, closeModalAction }: CancelLeaveModalProps) => {
  const {
    leaveIndividualDetail,
    confirmCancelLeaveModalIsOpen,
    setConfirmCancelLeaveModalIsOpen,
    setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen,
    patchLeave,
    patchLeaveSuccess,
    patchLeaveFail,
    emptyResponseAndError,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    confirmCancelLeaveModalIsOpen: state.confirmCancelLeaveModalIsOpen,
    setConfirmCancelLeaveModalIsOpen: state.setConfirmCancelLeaveModalIsOpen,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen: state.setCompletedLeaveModalIsOpen,
    patchLeave: state.patchLeave,
    patchLeaveSuccess: state.patchLeaveSuccess,
    patchLeaveFail: state.patchLeaveFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [remarks, setRemarks] = useState<string>('');
  const [selectedDatesToCancel, setSelectedDatesToCancel] = useState<Array<SelectOption>>([]);
  const [startDateToCancel, setStartDateToCancel] = useState<string>(); //for SBL
  const [leaveDates, setLeaveDates] = useState<Array<SelectOption>>([]);
  const [leaveCancellationData, setLeaveCancellationData] = useState<LeaveCancellationSubmission>();
  const [leaveCancellationUrl, setLeaveCancellationUrl] = useState<string>();

  //get dtr for the day
  const getDailyDtr = async (date: string) => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${employeeDetails.employmentDetails.companyId}/${date}`
    );
    return data;
  };

  //add cancellable leave dates to new array for selection
  useEffect(() => {
    let leaveDates = [];
    if (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates.length >= 1) {
      //loop through each leave date
      for (let i = 0; i < leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates.length; i++) {
        //add leave date without any checker if there's a time log or not
        leaveDates.push({
          label: leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i],
          value: leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i],
        });

        // const dtrTrest = async () => {
        //   const timeLogs: EmployeeDtrWithSchedule = await getDailyDtr(
        //     leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i]
        //   );

        //   //check if there's a time in or time out
        //   if ((timeLogs.dtr.timeIn || timeLogs.dtr.timeOut) && timeLogs.leaveDateStatus === LeaveDateStatus.APPROVED) {
        //     //add leave date to selection array
        //     leaveDates.push({
        //       label: leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i],
        //       value: leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i],
        //     });
        //   } else if (timeLogs.holidayType === HolidayTypes.REGULAR) {
        //     //do not add leave date to selectable dates for cancellation
        //   }
        //   //check if date is future
        //   else if (
        //     DateFormatter(leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i], 'MM-DD-YYYY') >=
        //     dayjs(dayjs().toDate().toDateString()).format('MM-DD-YYYY')
        //   ) {
        //     //add leave date to selection array
        //     leaveDates.push({
        //       label: leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i],
        //       value: leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i],
        //     });
        //   }
        // };
        // dtrTrest();
      }
    }
    setLeaveDates(leaveDates);
  }, [leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates]);

  const handleCancel = async () => {
    let finalDatesToCancel = [];
    if (
      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.REHABILITATION ||
      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION
    ) {
      finalDatesToCancel = Array.from(new Set([startDateToCancel]));
    } else {
      for (let i = 0; i < selectedDatesToCancel.length; i++) {
        finalDatesToCancel = Array.from(new Set([...finalDatesToCancel, selectedDatesToCancel[i].value]));
      }
    }
    if (
      leaveIndividualDetail.leaveApplicationBasicInfo.status === LeaveStatus.FOR_HRDM_APPROVAL ||
      leaveIndividualDetail.leaveApplicationBasicInfo.status === LeaveStatus.FOR_HRMO_APPROVAL ||
      leaveIndividualDetail.leaveApplicationBasicInfo.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
      leaveIndividualDetail.leaveApplicationBasicInfo.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION
    ) {
      //FOR PENDING LEAVE CANCELLATION
      let data = {
        id: leaveIndividualDetail.leaveApplicationBasicInfo.id,
        cancelReason: remarks,
      };

      patchLeave();
      const { error, result } = await patchPortal('/v1/leave/employee', data);
      if (error) {
        patchLeaveFail(result);
      } else {
        patchLeaveSuccess(result);
        closeModalAction();
        setTimeout(() => {
          setPendingLeaveModalIsOpen(false); //then close LEAVE modal
          setCompletedLeaveModalIsOpen(false); //then close LEAVE modal
        }, 200);
        setTimeout(() => {
          emptyResponseAndError();
        }, 3000);
      }
    } else {
      //FOR APPROVED LEAVE BUT WITH LEAVE DATES CANCELLATION
      setLeaveCancellationData({
        leaveApplicationId: leaveIndividualDetail.leaveApplicationBasicInfo.id,
        status: LeaveCancellationStatus.FOR_CANCELLATION,
        leaveDates: finalDatesToCancel,
        remarks: remarks,
      });
      setLeaveCancellationUrl('/v1/leave/employee/leave-date-cancellation');
      setConfirmCancelLeaveModalIsOpen(true);
    }
  };

  // cancel action for Leave Completed Modal
  const closeConfirmCancelLeaveModal = async () => {
    setConfirmCancelLeaveModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-700">
            <div className="flex justify-between px-2">
              <span>Cancel Leave Application</span>
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
          {/* Cancel Leave Confirmation Modal */}
          <ConfirmationLeaveCancellationModal
            modalState={confirmCancelLeaveModalIsOpen}
            setModalState={setConfirmCancelLeaveModalIsOpen}
            closeModalAction={closeConfirmCancelLeaveModal}
            url={leaveCancellationUrl}
            data={leaveCancellationData}
            title={'Confirm Cancellation'}
          />

          {startDateToCancel &&
          (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.REHABILITATION ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
              LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION) &&
          (DateFormatter(startDateToCancel, 'MM-DD-YYYY') <
            DateFormatter(leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[0], 'MM-DD-YYYY') ||
            DateFormatter(startDateToCancel, 'MM-DD-YYYY') >
              DateFormatter(
                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length - 1
                ],
                'MM-DD-YYYY'
              )) ? (
            <AlertNotification alertType="error" notifMessage={'Invalid Date Selected'} dismissible={false} />
          ) : null}

          {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRDM_APPROVAL ||
          leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRMO_APPROVAL ||
          leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
          leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ? (
            <div className="w-full h-full flex flex-col gap-2 text-lg text-center px-4">
              {`Are you sure you want to cancel this application?`}
            </div>
          ) : (
            <div className="flex flex-col w-full h-full px-4 gap-1 text-md ">
              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.REHABILITATION ||
              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION ? (
                <>
                  <label>Select start date and onwards to cancel:</label>
                  <input
                    required
                    type="date"
                    value={startDateToCancel}
                    className="text-slate-500 text-md border-slate-300 rounded-md"
                    onChange={(e) => setStartDateToCancel(e.target.value as unknown as string)}
                  />
                </>
              ) : (
                <>
                  {leaveDates.length > 0 ? (
                    <>
                      <label>Select dates possible for cancellation:</label>
                      <MySelectList
                        id="employees"
                        label=""
                        multiple
                        options={leaveDates}
                        onChange={(o) => setSelectedDatesToCancel(o)}
                        value={selectedDatesToCancel}
                      />
                    </>
                  ) : (
                    <AlertNotification
                      alertType="error"
                      notifMessage={'There were no leave dates where you have rendered work found.'}
                      dismissible={false}
                    />
                  )}
                </>
              )}
              {leaveDates.length > 0 ? (
                <>
                  <label className="pt-3">Indicate reason for cancelling application:</label>

                  <textarea
                    required
                    placeholder="Reason for decline"
                    className={`w-full h-32 p-2 border resize-none rounded-lg border-gray-300/90 `}
                    onChange={(e) => setRemarks(e.target.value as unknown as string)}
                    value={remarks}
                  ></textarea>
                </>
              ) : null}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end px-4">
            <div className="max-w-auto flex">
              {leaveIndividualDetail?.leaveApplicationBasicInfo?.status != LeaveStatus.FOR_HRDM_APPROVAL &&
              leaveIndividualDetail?.leaveApplicationBasicInfo?.status != LeaveStatus.FOR_HRMO_APPROVAL &&
              leaveIndividualDetail?.leaveApplicationBasicInfo?.status != LeaveStatus.FOR_SUPERVISOR_APPROVAL &&
              leaveIndividualDetail?.leaveApplicationBasicInfo?.status != LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ? (
                leaveDates.length > 0 ? (
                  <Button
                    variant={'primary'}
                    disabled={
                      (!isEmpty(remarks) &&
                        (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.REHABILITATION ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                            LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION) &&
                        DateFormatter(startDateToCancel, 'MM-DD-YYYY') >=
                          DateFormatter(
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[0],
                            'MM-DD-YYYY'
                          ) &&
                        DateFormatter(startDateToCancel, 'MM-DD-YYYY') <=
                          DateFormatter(
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length - 1
                            ],
                            'MM-DD-YYYY'
                          )) ||
                      (!isEmpty(remarks) &&
                        (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.PATERNITY ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SOLO_PARENT ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                            LeaveName.SPECIAL_EMERGENCY_CALAMITY ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VAWC) &&
                        selectedDatesToCancel.length > 0)
                        ? false
                        : true
                    }
                    onClick={(e) => handleCancel()}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button variant={'default'} size={'md'} loading={false} onClick={closeModalAction}>
                    Close
                  </Button>
                )
              ) : (
                <div className="max-w-auto flex gap-4">
                  <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => handleCancel()}>
                    Yes
                  </Button>
                  <Button variant={'danger'} size={'md'} loading={false} onClick={closeModalAction}>
                    No
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelLeaveModal;
