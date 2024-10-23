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
import { LeaveDateStatus, LeaveName, LeaveStatus, MonetizationType } from 'libs/utils/src/lib/enums/leave.enum';
import CancelLeaveModal from './CancelLeaveModal';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { LeavePdfModal } from './LeavePdfModal';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';

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
    leaveDetailsPdfModalIsOpen,

    getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail,
    setCancelLeaveModalIsOpen,
    setLeaveDetailsPdfModalIsOpen,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    completedLeaveModalIsOpen: state.completedLeaveModalIsOpen,
    cancelLeaveModalIsOpen: state.cancelLeaveModalIsOpen,
    leaveDetailsPdfModalIsOpen: state.leaveDetailsPdfModalIsOpen,

    getLeaveIndividualDetail: state.getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess: state.getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail: state.getLeaveIndividualDetailFail,
    setCancelLeaveModalIsOpen: state.setCancelLeaveModalIsOpen,
    setLeaveDetailsPdfModalIsOpen: state.setLeaveDetailsPdfModalIsOpen,
  }));

  const { leaveLedger, selectedLeaveLedger, setSelectedLeaveLedger } = useLeaveLedgerStore((state) => ({
    leaveLedger: state.leaveLedger,
    selectedLeaveLedger: state.selectedLeaveLedger,
    setSelectedLeaveLedger: state.setSelectedLeaveLedger,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [moreLeaveDates, setMoreLeaveDates] = useState<boolean>(false); //expand leave dates list
  const [moreCancelledLeaveDates, setMoreCancelledLeaveDates] = useState<boolean>(false); //expand cancelled leave dates list

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

  // close action for Leave Details PDF Modal
  const closeLeaveDetailsPdfModal = async () => {
    setLeaveDetailsPdfModalIsOpen(false);
  };
  return (
    <>
      <Modal
        size={`${windowWidth > 1280 ? 'sm' : windowWidth > 1024 ? 'md' : 'full'}`}
        open={modalState}
        setOpen={setModalState}
      >
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

          {/* Leave Details PDF Modal */}
          <LeavePdfModal
            title="Leave Details"
            modalState={leaveDetailsPdfModalIsOpen}
            setModalState={setLeaveDetailsPdfModalIsOpen}
            closeModalAction={closeLeaveDetailsPdfModal}
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
                <div className="w-full flex flex-col gap-0 px-4 rounded">
                  {leaveIndividualDetail?.leaveApplicationBasicInfo ? (
                    <AlertNotification
                      alertType={
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRDM_APPROVAL
                          ? 'warning'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'error'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.FOR_SUPERVISOR_APPROVAL
                          ? 'warning'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'error'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? 'error'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                          ? 'success'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                          ? 'error'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION
                          ? 'warning'
                          : 'info'
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

                  {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDateStatus ===
                  LeaveDateStatus.FOR_CANCELLATION ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage={'For Leave Cancellation Review'}
                      dismissible={false}
                    />
                  ) : null}

                  {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDateStatus === LeaveDateStatus.CANCELLED ? (
                    <AlertNotification
                      alertType="success"
                      notifMessage={'Leave Cancellation Request Approved'}
                      dismissible={false}
                    />
                  ) : null}

                  {leaveIndividualDetail?.leaveApplicationBasicInfo?.isLateFiling ? (
                    <AlertNotification alertType="error" notifMessage={'Late Filing'} dismissible={false} />
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
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Reference No.:</label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.referenceNo}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Date of Application:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">
                          {DateTimeFormatter(leaveIndividualDetail?.leaveApplicationBasicInfo?.dateOfFiling)}
                        </label>
                      </div>
                    </div>

                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName !== LeaveName.MONETIZATION &&
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName !== LeaveName.TERMINAL ? (
                      //IF NOT MONETIZATION AND TERMINAL
                      <>
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
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                LeaveName.REHABILITATION ||
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
                                          if (index <= 2)
                                            return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
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
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelledLeaveDates.length > 0 ? (
                          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              Cancelled Leave Dates:
                            </label>

                            <div className="w-auto ml-5">
                              <label className="text-md font-medium ">
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.REHABILITATION ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION ? (
                                  // show first and last date (array) only if SBL (maternity, study, rehab...)
                                  `${DateFormatter(
                                    leaveIndividualDetail.leaveApplicationBasicInfo?.cancelledLeaveDates[0],
                                    'MM-DD-YYYY'
                                  )} - ${DateFormatter(
                                    leaveIndividualDetail.leaveApplicationBasicInfo?.cancelledLeaveDates[
                                      leaveIndividualDetail.leaveApplicationBasicInfo?.cancelledLeaveDates?.length - 1
                                    ],
                                    'MM-DD-YYYY'
                                  )}`
                                ) : (
                                  // show all dates if not SBL (maternity, study, rehab...)
                                  <>
                                    <ul>
                                      {leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelledLeaveDates?.map(
                                        (dates: string, index: number) => {
                                          if (moreLeaveDates) {
                                            return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                          } else {
                                            if (index <= 2)
                                              return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                          }
                                        }
                                      )}
                                    </ul>
                                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelledLeaveDates?.length >
                                    3 ? (
                                      <label
                                        className="cursor-pointer text-sm text-indigo-500 hover:text-indigo-600"
                                        onClick={(e) => setMoreCancelledLeaveDates(!moreCancelledLeaveDates)}
                                      >
                                        {moreCancelledLeaveDates ? 'Less...' : 'More...'}
                                      </label>
                                    ) : null}
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        ) : null}
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.forCancellationLeaveDates.length > 0 ? (
                          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              Cancellation Dates:
                            </label>

                            <div className="w-auto ml-5">
                              <label className="text-md font-medium ">
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.REHABILITATION ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                  LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION ? (
                                  // show first and last date (array) only if SBL (maternity, study, rehab...)
                                  `${DateFormatter(
                                    leaveIndividualDetail.leaveApplicationBasicInfo?.forCancellationLeaveDates[0],
                                    'MM-DD-YYYY'
                                  )} - ${DateFormatter(
                                    leaveIndividualDetail.leaveApplicationBasicInfo?.forCancellationLeaveDates[
                                      leaveIndividualDetail.leaveApplicationBasicInfo?.forCancellationLeaveDates
                                        ?.length - 1
                                    ],
                                    'MM-DD-YYYY'
                                  )}`
                                ) : (
                                  // show all dates if not SBL (maternity, study, rehab...)
                                  <>
                                    <ul>
                                      {leaveIndividualDetail?.leaveApplicationBasicInfo?.forCancellationLeaveDates?.map(
                                        (dates: string, index: number) => {
                                          if (moreLeaveDates) {
                                            return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                          } else {
                                            if (index <= 2)
                                              return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                          }
                                        }
                                      )}
                                    </ul>
                                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.forCancellationLeaveDates
                                      ?.length > 3 ? (
                                      <label
                                        className="cursor-pointer text-sm text-indigo-500 hover:text-indigo-600"
                                        onClick={(e) => setMoreCancelledLeaveDates(!moreCancelledLeaveDates)}
                                      >
                                        {moreCancelledLeaveDates ? 'Less...' : 'More...'}
                                      </label>
                                    ) : null}
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        ) : null}
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                          LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                        (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY &&
                          leaveIndividualDetail?.leaveApplicationDetails?.studyLeaveOther) ? (
                          <div
                            className={`flex flex-col sm:flex-col justify-start items-start w-full ${
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                                ? ''
                                : ''
                            } px-0.5 pb-3`}
                          >
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              Specific Details:
                            </label>
                            <div className="w-auto ml-5 mr-5">
                              <label className=" text-md font-medium">
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
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
                                  : ''}
                              </label>
                            </div>
                          </div>
                        ) : null}
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.OTHERS ? (
                          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3">
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                LeaveName.SPECIAL_PRIVILEGE
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
                              leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
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
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDateCancellationRemarks &&
                        leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED ? (
                          <div className={`flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3`}>
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              Leave Date Cancellation Remarks:
                            </label>
                            <div className="w-auto ml-5 mr-5">
                              <label className=" text-md font-medium">
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDateCancellationRemarks ??
                                  'None'}
                              </label>
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      //IF MONETIZATION
                      <>
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MONETIZATION ? (
                          <>
                            <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                              <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Type:</label>

                              <div className="w-auto ml-5">
                                <label className=" text-md font-medium">
                                  {leaveIndividualDetail?.leaveApplicationDetails?.monetizationType ==
                                  MonetizationType.MAX20
                                    ? 'Max 20 Credits'
                                    : 'Max 50% of Credits'}
                                </label>
                              </div>
                            </div>

                            <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                              <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                                Converted Credits:
                              </label>

                              <div className="w-auto ml-5">
                                <label className=" text-md font-medium">
                                  VL: {leaveIndividualDetail?.leaveApplicationDetails?.convertedVl} / SL:{' '}
                                  {leaveIndividualDetail?.leaveApplicationDetails?.convertedSl}
                                </label>
                              </div>
                            </div>
                          </>
                        ) : null}

                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.TERMINAL ? (
                          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                              Converted Credits:
                            </label>

                            <div className="w-auto ml-5">
                              <label className=" text-md font-medium">
                                VL: {leaveIndividualDetail?.leaveApplicationDetails?.vlBalance.afterTerminalLeave} / SL:{' '}
                                {leaveIndividualDetail?.leaveApplicationDetails?.slBalance.afterTerminalLeave}
                              </label>
                            </div>
                          </div>
                        ) : null}

                        <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                          <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Amount:</label>

                          <div className="w-auto ml-5">
                            <label className=" text-md font-medium">
                              {leaveIndividualDetail?.leaveApplicationDetails?.monetizedAmount}
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* COMMON DETAILS */}
                    <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Supervisor:</label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.supervisorName}
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
                          : 'Date Approved:'}
                      </label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium ">
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                            ? DateTimeFormatter(leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate)
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? DateTimeFormatter(
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.supervisorApprovalDate
                              )
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                              LeaveStatus.DISAPPROVED_BY_HRMO
                            ? DateTimeFormatter(leaveIndividualDetail?.leaveApplicationBasicInfo?.hrmoApprovalDate)
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                            ? DateTimeFormatter(leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate)
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                            ? DateTimeFormatter(leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelDate)
                            : '-- -- ----'}
                        </label>
                      </div>
                    </div>
                    {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                      LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED ? (
                      <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
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
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED &&
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDateCancellationRemarks
                              ? leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDateCancellationRemarks
                              : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED &&
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelReason
                              ? leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelReason == ''
                                ? 'N/A'
                                : leaveIndividualDetail?.leaveApplicationBasicInfo?.cancelReason
                              : 'N/A'}
                          </label>
                        </div>
                      </div>
                    ) : null}
                  </div>

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
                          Your{' '}
                          {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                          leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                            ? 'VL'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                            ? 'SL'
                            : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                              LeaveName.SPECIAL_PRIVILEGE
                            ? 'SPL'
                            : 'Leave'}{' '}
                          Credits at the time of this application:
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
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                                  ? (
                                      parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) +
                                      parseFloat(`${selectedLeaveLedger[0]?.vacationLeave}`) * -1
                                    )
                                      // +
                                      // (parseFloat(`${selectedLeaveLedger[0]?.forcedLeaveBalance}`) +
                                      //   parseFloat(`${selectedLeaveLedger[0]?.forcedLeave}`) * -1)

                                      .toFixed(3)
                                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.SICK
                                  ? (
                                      parseFloat(`${selectedLeaveLedger[0]?.sickLeaveBalance}`) +
                                      parseFloat(`${selectedLeaveLedger[0]?.sickLeave}`) * -1
                                    ).toFixed(3)
                                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                                    LeaveName.SPECIAL_PRIVILEGE
                                  ? (
                                      parseFloat(`${selectedLeaveLedger[0]?.specialPrivilegeLeaveBalance}`) +
                                      parseFloat(`${selectedLeaveLedger[0]?.specialPrivilegeLeave}`) * -1
                                    ).toFixed(3)
                                  : 'N/A'}
                              </td>
                              <td className="border border-slate-400 text-center">
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length.toFixed(3)}
                              </td>
                              <td className="border border-slate-400 text-center bg-green-100">
                                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION
                                  ? parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`).toFixed(3)
                                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED
                                  ? (
                                      parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) -
                                      leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.length
                                    )
                                      // +
                                      // parseFloat(`${selectedLeaveLedger[0]?.forcedLeaveBalance}`)
                                      .toFixed(3)
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
            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDateStatus === LeaveDateStatus.CANCELLED ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDateStatus === LeaveDateStatus.FOR_CANCELLATION ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
            leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR ? (
              <>
                {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED ? (
                  <Button
                    variant={'primary'}
                    size={'md'}
                    loading={false}
                    onClick={(e) => setLeaveDetailsPdfModalIsOpen(true)}
                  >
                    View PDF
                  </Button>
                ) : null}
                <Button
                  variant={'default'}
                  size={'md'}
                  loading={false}
                  onClick={(e) => closeModalAction()}
                  type="submit"
                >
                  Close
                </Button>
              </>
            ) : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ? (
              <>
                {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED ? (
                  <Button
                    variant={'primary'}
                    size={'md'}
                    loading={false}
                    onClick={(e) => setLeaveDetailsPdfModalIsOpen(true)}
                  >
                    View PDF
                  </Button>
                ) : null}

                {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName != LeaveName.MONETIZATION ? (
                  <Button
                    variant={'warning'}
                    size={'md'}
                    loading={false}
                    onClick={(e) => setCancelLeaveModalIsOpen(true)}
                    type="submit"
                  >
                    Cancel Leave
                  </Button>
                ) : (
                  <Button
                    variant={'default'}
                    size={'md'}
                    loading={false}
                    onClick={(e) => closeModalAction()}
                    type="submit"
                  >
                    Close
                  </Button>
                )}
              </>
            ) : null}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveCompletedModal;
