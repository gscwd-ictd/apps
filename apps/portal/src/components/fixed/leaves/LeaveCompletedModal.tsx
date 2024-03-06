/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import axios from 'axios';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import CancelLeaveModal from './CancelLeaveModal';
import dayjs from 'dayjs';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type LeaveCompletedModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const LeaveCompletedModal = ({ modalState, setModalState, closeModalAction }: LeaveCompletedModalProps) => {
  const {
    leaveIndividualDetail,
    leaveId,
    loadingLeaveDetails,
    errorLeaveDetails,
    completedLeaveModalIsOpen,
    cancelLeaveModalIsOpen,

    getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail,
    setCancelLeaveModalIsOpen,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    completedLeaveModalIsOpen: state.completedLeaveModalIsOpen,
    cancelLeaveModalIsOpen: state.cancelLeaveModalIsOpen,

    getLeaveIndividualDetail: state.getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess: state.getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail: state.getLeaveIndividualDetailFail,
    setCancelLeaveModalIsOpen: state.setCancelLeaveModalIsOpen,
  }));

  const { leaveLedger, selectedLeaveLedger, setSelectedLeaveLedger } = useLeaveLedgerStore((state) => ({
    leaveLedger: state.leaveLedger,
    selectedLeaveLedger: state.selectedLeaveLedger,
    setSelectedLeaveLedger: state.setSelectedLeaveLedger,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [moreLeaveDates, setMoreLeaveDates] = useState<boolean>(false);

  const getLeaveDetail = async (leaveId: string) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/details/${employeeDetails.user._id}/${leaveId}`
      );

      if (!isEmpty(data)) {
        setSelectedLeaveLedger(leaveLedger, data.leaveApplicationBasicInfo.id);
        getLeaveIndividualDetailSuccess(false, data);
      }
    } catch (error) {
      getLeaveIndividualDetailFail(false, error.message);
    }
  };

  useEffect(() => {
    if (completedLeaveModalIsOpen) {
      getLeaveDetail(leaveId);
      getLeaveIndividualDetail(true);
    }
    setMoreLeaveDates(false);
  }, [completedLeaveModalIsOpen, leaveId]);

  const { windowWidth } = UseWindowDimensions();

  // cancel action for Leave Completed Modal
  const closeCancelLeaveModal = async () => {
    setCancelLeaveModalIsOpen(false);
  };

  const getDateNow = dayjs().toDate();
  const dateNow = dayjs(getDateNow).format('YYYY-MM-DD');

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'md' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Completed Leave Application</span>
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
                <div className="w-full flex flex-col gap-2 px-4 rounded">
                  {leaveIndividualDetail?.leaveApplicationBasicInfo ? (
                    <AlertNotification
                      alertType={
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRDM_APPROVAL ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRMO_APPROVAL ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                          LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                          ? 'info'
                          : 'error'
                      }
                      notifMessage={
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRDM_APPROVAL
                          ? 'Reviewed by Supervisor: For HRDM Final Review'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'Disapproved by HRDM'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.FOR_SUPERVISOR_APPROVAL
                          ? 'Reviewed by HRMO: For Supervisor Review'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'Disapproved by Supervisor'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? 'Disapproved by HRMO'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                          ? 'Approved'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                          ? 'Cancelled'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status.charAt(0).toUpperCase() +
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.status.slice(1)
                      }
                      dismissible={false}
                    />
                  ) : null}

                  <div className="flex flex-wrap justify-between">
                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Leave Type:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Number of Days:</label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Leave Dates:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium ">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.REHABILITATION ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                            LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION ? (
                            // show first and last date (array) only if SBL (maternity, study, rehab...)
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
                            // show all dates if not SBL (maternity, study, rehab...)
                            <>
                              <ul>
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.map(
                                  (dates: string, index: number) => {
                                    if (moreLeaveDates) {
                                      return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                    } else {
                                      if (index <= 2) return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                    }
                                  }
                                )}
                              </ul>
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length > 3 ? (
                                <label
                                  className="cursor-pointer text-sm text-indigo-500 hover:text-indigo-600"
                                  onClick={(e) => setMoreLeaveDates(!moreLeaveDates)}
                                >
                                  {moreLeaveDates ? 'Less...' : 'More...'}
                                </label>
                              ) : null}
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'Date Disapproved:'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'Date Disapproved:'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? 'Date Disapproved:'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                          ? 'Date Approved:'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                          ? 'Date Cancelled:'
                          : null}
                      </label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium ">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                            ? DateFormatter(
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate,
                                'MM-DD-YYYY'
                              )
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? DateFormatter(
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.supervisorApprovalDate,
                                'MM-DD-YYYY'
                              )
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_HRMO
                            ? DateFormatter(
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.hrmoApprovalDate,
                                'MM-DD-YYYY'
                              )
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                            ? DateFormatter(
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate,
                                'MM-DD-YYYY'
                              )
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                            ? DateFormatter(leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelDate, 'MM-DD-YYYY')
                            : null}
                        </label>
                      </div>
                    </div>

                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.OTHERS ? (
                      <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
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

                        <div className="w-auto ml-5">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                            LeaveName.SPECIAL_PRIVILEGE ? (
                            <div className="text-md font-medium">
                              {leaveIndividualDetail?.leaveApplicationDetails?.inPhilippinesOrAbroad}
                            </div>
                          ) : null}

                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ? (
                            <>
                              <div className="text-md font-medium">
                                {leaveIndividualDetail?.leaveApplicationDetails?.hospital}
                              </div>
                            </>
                          ) : null}

                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ? (
                            <>
                              <div className="text-md font-medium">
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

                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                      LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY &&
                      leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther) ? (
                      <div
                        className={`flex flex-col sm:flex-col justify-start items-start w-full ${
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                            ? 'sm:w-1/2'
                            : ''
                        } px-0.5 pb-3`}
                      >
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Specific Details:</label>
                        <div className="w-auto ml-5 mr-5">
                          <label className=" text-md font-medium">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE
                              ? leaveIndividualDetail?.leaveApplicationDetails?.location
                              : leaveIndividualDetail.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                              ? leaveIndividualDetail?.leaveApplicationDetails?.illness
                              : leaveIndividualDetail.leaveApplicationBasicInfo?.leaveName ===
                                LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                              ? leaveIndividualDetail?.leaveApplicationDetails?.splWomen
                              : leaveIndividualDetail.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY &&
                                leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther
                              ? leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther
                              : ''}
                          </label>
                        </div>
                      </div>
                    ) : null}

                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                      LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED ? (
                      <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                            ? 'HRDM Remarks:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? 'Supervisor Remarks:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_HRMO
                            ? 'HRMO Remarks:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                            ? 'Cancel Reason:'
                            : 'Remarks:'}
                        </label>
                        <div className="w-auto ml-5">
                          <label className=" text-md font-medium">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.DISAPPROVED_BY_HRDM
                              ? leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmDisapprovalRemarks
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                                LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                              ? leaveIndividualDetail?.leaveApplicationBasicInfo?.supervisorDisapprovalRemarks
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                              ? leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelReason == ''
                                ? 'N/A'
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelReason
                              : 'N/A'}
                          </label>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">Leave Type:</label>

                    <div className="w-96">
                      <label className="w-full text-md text-slate-500 ">
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName}
                      </label>
                    </div>
                  </div> */}

                  {/* {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ? (
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
                      ) : null} */}

                  {/* <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                        <label className="text-md font-medium text-slate-500 whitespace-nowrap">Number of Days:</label>

                        <div className="w-96">
                          <label className="text-slate-500 h-12 w-96  text-md ">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length}
                          </label>
                        </div>
                      </div> */}

                  {/* <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center w-full">
                        <label className="text-md font-medium text-slate-500 whitespace-nowrap">Leave Dates:</label>

                        <div className="w-auto sm:w-96">
                          <label className="text-slate-500 w-full text-md ">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.REHABILITATION ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                              LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION ? (
                              // show first and last date (array) only if SBL (maternity, study, rehab...)
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
                              // show all dates if not SBL (maternity, study, rehab...)
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
                      </div> */}

                  {/* {watch('typeOfLeaveDetails.leaveName') === 'Others' &&
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
                                  className="text-slate-500 w-full h-16 rounded text-md border-slate-300"
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

                  {/* {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                        LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                      (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY &&
                        leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther) ? (
                        <div className="flex flex-col justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full mb-1">
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
                                : leaveIndividualDetail.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                                ? leaveIndividualDetail?.leaveApplicationDetails?.illness
                                : leaveIndividualDetail.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                                ? leaveIndividualDetail?.leaveApplicationDetails?.splWomen
                                : leaveIndividualDetail.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY &&
                                  leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther
                                ? leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther
                                : ''
                            }
                          ></textarea>
                        </div>
                      ) : null}
                    </>
                  ) : null} */}

                  {/* <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                      {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                        ? 'Date Disapproved:'
                        : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                          LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                        ? 'Date Disapproved:'
                        : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                        ? 'Date Disapproved:'
                        : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                        ? 'Date Approved:'
                        : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                        ? 'Date Cancelled:'
                        : null}
                    </label>

                    <div className="w-96">
                      <label className="text-slate-500 h-12 w-96  text-md ">
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                          ? DateFormatter(
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate,
                              'MM-DD-YYYY'
                            )
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? DateFormatter(
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.supervisorApprovalDate,
                              'MM-DD-YYYY'
                            )
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? DateFormatter(
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.hrmoApprovalDate,
                              'MM-DD-YYYY'
                            )
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                          ? DateFormatter(
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate,
                              'MM-DD-YYYY'
                            )
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                          ? DateFormatter(leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelDate, 'MM-DD-YYYY')
                          : null}
                      </label>
                    </div>
                  </div> */}

                  {/* {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED ? (
                    <>
                      <div className="flex flex-row items-center justify-between w-full">
                        <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                            ? 'HRDM Remarks:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? 'Supervisor Remarks:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_HRMO
                            ? 'HRMO Remarks:'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                            ? 'Cancel Reason:'
                            : 'Remarks:'}
                        </label>
                      </div>
                      <textarea
                        disabled
                        rows={2}
                        className="w-full p-2 text-md rounded resize-none text-slate-500 border-slate-300"
                        value={
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                            ? leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmDisapprovalRemarks
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? leaveIndividualDetail?.leaveApplicationBasicInfo?.supervisorDisapprovalRemarks
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                            ? leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelReason
                            : 'N/A'
                        }
                      ></textarea>
                    </>
                  ) : null} */}

                  {leaveIndividualDetail?.leaveApplicationBasicInfo?.status !== LeaveStatus.DISAPPROVED_BY_SUPERVISOR &&
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.status !== LeaveStatus.CANCELLED &&
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.status !== LeaveStatus.DISAPPROVED_BY_HRDM &&
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.status !== LeaveStatus.DISAPPROVED_BY_HRMO ? (
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                    (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE &&
                      completedLeaveModalIsOpen) ? (
                      <div className="w-full pb-4">
                        <span className="text-slate-500 text-md">
                          Your {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName} Credits at the time of this
                          application:
                        </span>
                        <table className="mt-2 bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                          <tbody>
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Total Earned</td>
                              <td className="border border-slate-400 text-center">Less this application</td>
                              <td className="border border-slate-400 text-center bg-green-100">Balance</td>
                            </tr>
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION
                                  ? (
                                      Number(parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`).toFixed(3)) +
                                      Number(parseFloat(`${selectedLeaveLedger[0]?.vacationLeave}`).toFixed(3)) * -1
                                    ).toFixed(3)
                                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                                  ? (
                                      Number(parseFloat(`${selectedLeaveLedger[0]?.forcedLeaveBalance}`).toFixed(3)) +
                                      Number(parseFloat(`${selectedLeaveLedger[0]?.forcedLeave}`).toFixed(3)) * -1
                                    ).toFixed(3)
                                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                                  ? (
                                      Number(parseFloat(`${selectedLeaveLedger[0]?.sickLeaveBalance}`).toFixed(3)) +
                                      Number(parseFloat(`${selectedLeaveLedger[0]?.sickLeave}`).toFixed(3)) * -1
                                    ).toFixed(3)
                                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                    LeaveName.SPECIAL_PRIVILEGE
                                  ? (
                                      Number(
                                        parseFloat(`${selectedLeaveLedger[0]?.specialPrivilegeLeaveBalance}`).toFixed(3)
                                      ) +
                                      Number(
                                        parseFloat(`${selectedLeaveLedger[0]?.specialPrivilegeLeave}`).toFixed(3)
                                      ) *
                                        -1
                                    ).toFixed(3)
                                  : 'N/A'}
                              </td>
                              <td className="border border-slate-400 text-center">
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)}
                              </td>
                              <td className="border border-slate-400 text-center bg-green-100">
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION
                                  ? selectedLeaveLedger[0]?.vacationLeaveBalance
                                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                                  ? selectedLeaveLedger[0]?.forcedLeaveBalance
                                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                                  ? selectedLeaveLedger[0]?.sickLeaveBalance
                                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                    LeaveName.SPECIAL_PRIVILEGE
                                  ? selectedLeaveLedger[0]?.specialPrivilegeLeaveBalance
                                  : 'N/A'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR ? (
              <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
                Close
              </Button>
            ) : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ? (
              <Button
                variant={'warning'}
                size={'md'}
                loading={false}
                onClick={(e) => setCancelLeaveModalIsOpen(true)}
                type="submit"
              >
                Cancel Leave
              </Button>
            ) : null}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveCompletedModal;
