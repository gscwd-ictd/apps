/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import axios from 'axios';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import CancelLeaveModal from './CancelLeaveModal';
import dayjs from 'dayjs';

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

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const getLeaveDetail = async (leaveId: string) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/details/${employeeDetails.user._id}/${leaveId}`
      );

      if (!isEmpty(data)) {
        console.log(data);
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
  }, [completedLeaveModalIsOpen, leaveId]);

  const { windowWidth } = UseWindowDimensions();

  // cancel action for Leave Completed Modal
  const closeCancelLeaveModal = async () => {
    setCancelLeaveModalIsOpen(false);
  };

  const getDateNow = dayjs().toDate();
  const dateNow = dayjs(getDateNow).format('YYYY-MM-DD');

  // console.log(leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[0]);
  // console.log(dayjs(getDateNow).format('YYYY-MM-DD'));

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
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
          {/* Pass Slip Application Modal */}
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
                          ? 'For HRDM Approval'
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'Disapproved by HRDM '
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.FOR_SUPERVISOR_APPROVAL
                          ? 'For Supervisor Approval '
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'Disapproved by Supervisor '
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? 'Disapproved by HRMO '
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                          ? 'Approved '
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                          ? 'Cancelled '
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status.charAt(0).toUpperCase() +
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.status.slice(1)
                      }
                      dismissible={false}
                    />
                  ) : null}

                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">Leave Type:</label>

                    <div className="w-96">
                      <label className="w-full text-md text-slate-500 ">
                        {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName}
                      </label>
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

                      <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center w-full">
                        <label className="text-md font-medium text-slate-500 whitespace-nowrap">Leave Dates:</label>

                        <div className="w-auto sm:w-96">
                          <label className="text-slate-500 w-full text-md ">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.MATERNITY ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.STUDY ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.REHABILITATION ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName ===
                              LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                            leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName === LeaveName.ADOPTION
                              ? // show first and last date (array) only if maternity or study leave
                                `${leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates[0]} - ${
                                  leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates[
                                    leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates?.length - 1
                                  ]
                                }`
                              : // show all dates if not maternity or study leave
                                leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates?.join(', ')}
                          </label>
                        </div>
                      </div>

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
                  ) : null}

                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
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
                          ? leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status ===
                            LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? leaveIndividualDetail?.leaveApplicationBasicInfo?.supervisorApprovalDate
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO
                          ? leaveIndividualDetail?.leaveApplicationBasicInfo?.hrmoApprovalDate
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.APPROVED
                          ? leaveIndividualDetail?.leaveApplicationBasicInfo?.hrdmApprovalDate
                          : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.CANCELLED
                          ? 'N/A'
                          : null}
                      </label>
                    </div>
                  </div>

                  {leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                  leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ? (
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
                            : 'N/A'
                        }
                      ></textarea>
                    </>
                  ) : null}

                  <div className="w-full pb-4">
                    <span className="text-slate-500 text-md font-medium">Your current Leave Credits:</span>
                    <table className="bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                      <tbody>
                        <tr className="border border-slate-400">
                          <td className="border border-slate-400"></td>
                          <td className="border border-slate-400 text-center text-sm p-1">
                            {leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveName}
                          </td>
                        </tr>
                        <tr className="border border-slate-400">
                          <td className="border border-slate-400 text-sm p-1">Total Earned</td>
                          <td className="border border-slate-400 p-1 text-center text-sm">10</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-400 text-sm p-1">Less this application</td>
                          <td className="border border-slate-400 p-1 text-center text-sm">0</td>
                        </tr>
                        <tr className="border border-slate-400 bg-green-100">
                          <td className="border border-slate-400 text-sm p-1">Balance</td>
                          <td className={` border border-slate-400 p-1 text-center text-sm`}>0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button
              disabled={
                dateNow > leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[0]
                  ? true
                  : leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRDM ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_HRMO ||
                    leaveIndividualDetail?.leaveApplicationBasicInfo?.status === LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                  ? true
                  : false
              }
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

export default LeaveCompletedModal;
