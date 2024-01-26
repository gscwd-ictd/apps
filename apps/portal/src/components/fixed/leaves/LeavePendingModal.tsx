/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../store/leave.store';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import axios from 'axios';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import CancelLeaveModal from './CancelLeaveModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type LeavePendingModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const LeavePendingModal = ({ modalState, setModalState, closeModalAction }: LeavePendingModalProps) => {
  const {
    leaveIndividualDetail,
    leaveId,
    loadingLeaveDetails,
    errorLeaveDetails,
    pendingLeaveModalIsOpen,
    cancelLeaveModalIsOpen,
    setCancelLeaveModalIsOpen,
    getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    cancelLeaveModalIsOpen: state.cancelLeaveModalIsOpen,
    setCancelLeaveModalIsOpen: state.setCancelLeaveModalIsOpen,
    getLeaveIndividualDetail: state.getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess: state.getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail: state.getLeaveIndividualDetailFail,
  }));

  const { vacationLeaveBalance, forcedLeaveBalance, sickLeaveBalance, specialPrivilegeLeaveBalance } =
    useLeaveLedgerStore((state) => ({
      vacationLeaveBalance: state.vacationLeaveBalance,
      forcedLeaveBalance: state.forcedLeaveBalance,
      sickLeaveBalance: state.sickLeaveBalance,
      specialPrivilegeLeaveBalance: state.specialPrivilegeLeaveBalance,
    }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const getLeaveDetail = async (leaveId: string) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/details/${employeeDetails.user._id}/${leaveId}`
      );

      if (!isEmpty(data)) {
        getLeaveIndividualDetailSuccess(false, data);
      }
    } catch (error) {
      getLeaveIndividualDetailFail(false, error.message);
    }
  };

  useEffect(() => {
    if (pendingLeaveModalIsOpen) {
      getLeaveDetail(leaveId);
      getLeaveIndividualDetail(true);
    }
  }, [pendingLeaveModalIsOpen, leaveId]);

  const { windowWidth } = UseWindowDimensions();

  // cancel action for Leave Pending Modal
  const closeCancelLeaveModal = async () => {
    setCancelLeaveModalIsOpen(false);
  };

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
<<<<<<< HEAD
              <span className="text-xl md:text-2xl">
                For Approval Leave Application
              </span>
=======
              <span className="text-xl md:text-2xl">Ongoing Leave Application</span>
>>>>>>> 13761ca59b7709d133207e83699e2adb884de29e
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
          {/* Cancel Leave Application Modal */}
          <CancelLeaveModal
            modalState={cancelLeaveModalIsOpen}
            setModalState={setCancelLeaveModalIsOpen}
            closeModalAction={closeCancelLeaveModal}
          />
          {loadingLeaveDetails || errorLeaveDetails ? (
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
            <div className="w-full h-full flex flex-col  ">
              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-2 p-4 rounded">
                  {leaveIndividualDetail?.leaveApplicationBasicInfo ? (
                    <AlertNotification
                      alertType="info"
                      notifMessage={
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRDM_APPROVAL
                          ? 'Reviewed by Supervisor: For HRDM Final Review'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRMO_APPROVAL
                          ? 'For HRMO Review'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.FOR_SUPERVISOR_APPROVAL
                          ? 'Reviewed by HRMO: For Supervisor Review'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status.charAt(0).toUpperCase() +
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.status.slice(1)
                      }
                      dismissible={false}
                    />
                  ) : null}

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Leave Type:</label>

                      <div className="w-96 ">
                        <label className="text-slate-500 w-full text-md ">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName}
                        </label>
                      </div>
                    </div>
                  </div>

                  {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ? (
                    <>
                      {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.OTHERS ? (
                        <div className="flex flex-col sm:flex-row justify-between items-start w-full">
                          <label className="text-slate-500 text-md font-medium">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                              ? 'Location:'
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                              ? 'Hospitalization:'
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY
                              ? 'Study:'
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.OTHERS
                              ? 'Other Purpose: '
                              : null}
                          </label>

                          <div className="flex w-96 ">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                              LeaveName.SPECIAL_PRIVILEGE ? (
                              <div className="text-slate-500 w-full text-md">
                                {leaveIndividualDetail?.leaveApplicationDetails?.inPhilippinesOrAbroad}
                              </div>
                            ) : null}

                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ? (
                              <>
                                <div className="text-slate-500 w-full text-md">
                                  {leaveIndividualDetail?.leaveApplicationDetails?.hospital}
                                </div>
                              </>
                            ) : null}

                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ? (
                              <>
                                <div className="text-slate-500 w-full text-md">
                                  {leaveIndividualDetail?.leaveApplicationDetails?.forBarBoardReview === '1'
                                    ? 'For BAR/Board Examination Review '
                                    : leaveIndividualDetail.leaveApplicationDetails?.forMastersCompletion === '1'
                                    ? `Completion of Master's Degree `
                                    : 'Other'}
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                      ) : null}

                      <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                        <label className="text-md font-medium text-slate-500 whitespace-nowrap">Number of Days:</label>

                        <div className="w-96">
                          <label className="text-slate-500 h-12 w-96  text-md ">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length}
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                          <label className="text-slate-500 text-md font-medium whitespace-nowrap">Leave Dates:</label>

                          <div className="w-full md:w-96 ">
                            <label className="text-slate-500 w-full text-md ">
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                LeaveName.REHABILITATION ||
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION ? (
                                // show first and last date (array) only if maternity or study leave
                                `${DateFormatter(
                                  leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates[0],
                                  'MM-DD-YYYY'
                                )} - ${DateFormatter(
                                  leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates[
                                    leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates?.length - 1
                                  ],
                                  'MM-DD-YYYY'
                                )}`
                              ) : (
                                // show all dates if not maternity or study leave
                                <div className="flex flex-wrap flex-row">
                                  {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.map(
                                    (dates: string, index: number) => {
                                      return (
                                        <label key={index} className="pr-1">
                                          {DateFormatter(dates, 'MM-DD-YYYY')}
                                          {index ==
                                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length - 1
                                            ? ''
                                            : ','}
                                        </label>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* {watch('typeOfLeaveDetails.leaveName') === LeaveName.OTHERS &&
                      watch('other') === 'Monetization of Leave Credits' ? (
                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full">
                            <label className="pt-2 text-slate-500 text-xl font-medium">
                              Commutation
                            </label>
                          </div>

                          <div className="flex gap-2 w-full items-center">
                            {watch('other') ===
                            'Monetization of Leave Credits' ? (
                              <div className="w-full">
                                <select
                                  id="commutation"
                                  className="text-slate-500 w-full h-16 rounded text-lg border-slate-300"
                                  required
                                  defaultValue={''}
                                  {...register('commutation')}
                                >
                                  <option value="" disabled>
                                    Select Other:
                                  </option>
                                  {leaveCommutation.map(
                                    (item: Item, idx: number) => (
                                      <option value={item.value} key={idx}>
                                        {item.label}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : null} */}

                      {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                        LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                      (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY &&
                        leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther) ? (
                        <div className="flex flex-col justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full">
                            <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                              Specific Details:
                            </label>
                          </div>
                          <textarea
                            disabled
                            rows={2}
                            className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                            value={
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                LeaveName.SPECIAL_PRIVILEGE
                                ? leaveIndividualDetail?.leaveApplicationDetails?.location
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                                ? leaveIndividualDetail?.leaveApplicationDetails?.illness
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                                ? leaveIndividualDetail?.leaveApplicationDetails?.splWomen
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY &&
                                  leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther
                                ? leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther
                                : ' '
                            }
                          ></textarea>
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {(leaveIndividualDetail?.leaveApplicationBasicInfo?.status !==
                    LeaveStatus.DISAPPROVED_BY_SUPERVISOR &&
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status !== LeaveStatus.DISAPPROVED_BY_HRDM &&
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status !== LeaveStatus.DISAPPROVED_BY_HRMO &&
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION) ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ? (
                    <div className="w-full pb-4">
                      <span className="text-slate-500 text-md font-medium">
                        Your current {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName} Leave Credits:
                      </span>
                      <table className="bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                        <tbody>
                          <tr className="border border-slate-400">
                            <td className="border border-slate-400 text-center">Total Earned</td>
                            <td className="border border-slate-400 text-center">Less this application</td>
                            <td className="border border-slate-400 text-center bg-green-100">Balance</td>
                          </tr>
                          <tr className="border border-slate-400">
                            <td className="border border-slate-400 text-center">
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION
                                ? vacationLeaveBalance
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                                ? forcedLeaveBalance
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                                ? sickLeaveBalance
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.SPECIAL_PRIVILEGE
                                ? specialPrivilegeLeaveBalance
                                : 'N/A'}
                            </td>
                            <td className="border border-slate-400 text-center">
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)}
                            </td>
                            <td className="border border-slate-400 text-center bg-green-100">
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION
                                ? (
                                    Number(parseFloat(`${vacationLeaveBalance}`).toFixed(3)) -
                                    Number(
                                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                                    )
                                  ).toFixed(3)
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                                ? (
                                    Number(parseFloat(`${forcedLeaveBalance}`).toFixed(3)) -
                                    Number(
                                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                                    )
                                  ).toFixed(3)
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                                ? (
                                    Number(parseFloat(`${sickLeaveBalance}`).toFixed(3)) -
                                    Number(
                                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                                    )
                                  ).toFixed(3)
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.SPECIAL_PRIVILEGE
                                ? (
                                    Number(parseFloat(`${specialPrivilegeLeaveBalance}`).toFixed(3)) -
                                    Number(
                                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)
                                    )
                                  ).toFixed(3)
                                : 'N/A'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button
              variant={'warning'}
              size={'md'}
              loading={false}
              onClick={(e) => setCancelLeaveModalIsOpen(true)}
              type="submit"
            >
              Cancel Leave
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeavePendingModal;
