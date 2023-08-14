import { HiX } from 'react-icons/hi';
import { useApprovalStore } from '../../../store/approvals.store';
import { Modal } from 'libs/oneui/src/components/Modal';
import { Button } from 'libs/oneui/src/components/Button';
import { SpinnerDotted } from 'spinners-react';
import { AlertNotification } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { ConfirmationLeaveModal } from './FinalApprovalOtp/ConfirmationLeaveModal';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';

type ApprovalsCompletedLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ApprovalsCompletedLeaveModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ApprovalsCompletedLeaveModalProps) => {
  const { leaveIndividualDetail } = useFinalLeaveApprovalStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
  }));

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal
        size={windowWidth > 1024 ? 'lg' : 'full'}
        open={modalState}
        setOpen={setModalState}
      >
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">
                Completed Leave Application
              </span>
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
          {!leaveIndividualDetail ? (
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
                  {leaveIndividualDetail.status ? (
                    <AlertNotification
                      alertType="info"
                      notifMessage={
                        leaveIndividualDetail?.status ===
                        LeaveStatus.FOR_HRDM_APPROVAL
                          ? 'For HRDM Approval'
                          : leaveIndividualDetail?.status ===
                            LeaveStatus.DISAPPROVED_BY_HRDM
                          ? 'Disapproved by HRDM '
                          : leaveIndividualDetail?.status ===
                            LeaveStatus.FOR_SUPERVISOR_APPROVAL
                          ? 'For Supervisor Approval '
                          : leaveIndividualDetail?.status ===
                            LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                          ? 'Disapproved by Supervisor '
                          : leaveIndividualDetail?.status
                              .charAt(0)
                              .toUpperCase() +
                            leaveIndividualDetail?.status.slice(1)
                      }
                      dismissible={false}
                    />
                  ) : null}

                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                      Employee Name:
                    </label>

                    <div className="w-96">
                      <label className="w-full text-md text-slate-500 ">
                        {leaveIndividualDetail?.employee?.employeeName}
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                      Leave Type:
                    </label>

                    <div className="w-96 ">
                      <label className="w-full text-md text-slate-500 ">
                        {leaveIndividualDetail?.leaveName}
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-md font-medium text-slate-500">
                      {leaveIndividualDetail?.leaveName ===
                        LeaveName.VACATION ||
                      leaveIndividualDetail?.leaveName ===
                        LeaveName.SPECIAL_PRIVILEGE
                        ? 'Location:'
                        : leaveIndividualDetail?.leaveName === LeaveName.SICK
                        ? 'Hospitalization:'
                        : leaveIndividualDetail?.leaveName === LeaveName.STUDY
                        ? 'Study:'
                        : leaveIndividualDetail?.leaveName === LeaveName.OTHERS
                        ? 'Other Purpose: '
                        : null}
                    </label>

                    <div className="flex w-96 ">
                      {leaveIndividualDetail?.leaveName ===
                        LeaveName.VACATION ||
                      leaveIndividualDetail?.leaveName ===
                        LeaveName.SPECIAL_PRIVILEGE ? (
                        <div className="w-full text-md text-slate-500">
                          {leaveIndividualDetail?.inPhilippines
                            ? 'Within the Philippines'
                            : 'Abroad'}
                        </div>
                      ) : null}

                      {leaveIndividualDetail?.leaveName === LeaveName.SICK ? (
                        <>
                          <div className="w-full text-md text-slate-500">
                            {leaveIndividualDetail?.inHospital
                              ? 'In Hospital'
                              : 'Out Patient'}
                          </div>
                        </>
                      ) : null}

                      {leaveIndividualDetail?.leaveName === LeaveName.STUDY ? (
                        <>
                          <div className="w-full text-md text-slate-500">
                            {leaveIndividualDetail?.forBarBoardReview === '1'
                              ? 'For BAR/Board Examination Review '
                              : leaveIndividualDetail?.forMastersCompletion ===
                                '1'
                              ? `Completion of Master's Degree `
                              : 'Other'}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center w-full">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                      Leave Dates:
                    </label>

                    <div className="w-auto sm:w-96">
                      <label className="text-slate-500 h-12 w-96  text-md ">
                        {leaveIndividualDetail?.leaveName ===
                          LeaveName.MATERNITY ||
                        leaveIndividualDetail?.leaveName === LeaveName.STUDY ||
                        leaveIndividualDetail?.leaveName ===
                          LeaveName.REHABILITATION ||
                        leaveIndividualDetail?.leaveName ===
                          LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                          ? // show first and last date (array) only if maternity or study leave
                            `${leaveIndividualDetail?.leaveDates[0]} - ${
                              leaveIndividualDetail?.leaveDates[
                                leaveIndividualDetail?.leaveDates.length - 1
                              ]
                            }`
                          : // show all dates if not maternity or study leave
                            leaveIndividualDetail?.leaveDates?.join(', ')}
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

                  {leaveIndividualDetail?.leaveName === LeaveName.VACATION ||
                  leaveIndividualDetail?.leaveName ===
                    LeaveName.SPECIAL_PRIVILEGE ||
                  leaveIndividualDetail?.leaveName === LeaveName.SICK ||
                  leaveIndividualDetail?.leaveName ===
                    LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                  (leaveIndividualDetail?.leaveName === LeaveName.STUDY &&
                    leaveIndividualDetail?.leaveName) ? (
                    <div className="flex flex-col items-center justify-between w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                          Specific Details:
                        </label>
                      </div>
                      <textarea
                        disabled
                        rows={2}
                        className="w-full p-2 mt-2 text-md rounded resize-none text-slate-500 border-slate-300"
                        value={
                          //VACATION OR SPL //
                          leaveIndividualDetail?.leaveName ===
                            LeaveName.VACATION ||
                          leaveIndividualDetail?.leaveName ===
                            LeaveName.SPECIAL_PRIVILEGE
                            ? leaveIndividualDetail.inPhilippines
                              ? leaveIndividualDetail.inPhilippines
                              : leaveIndividualDetail.abroad
                            : //SICK LEAVE
                            leaveIndividualDetail?.leaveName === LeaveName.SICK
                            ? leaveIndividualDetail.inHospital
                              ? leaveIndividualDetail.inHospital
                              : leaveIndividualDetail.outPatient
                            : //SLB FOR WOMEN
                            leaveIndividualDetail?.leaveName ===
                              LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN
                            ? leaveIndividualDetail.splWomen
                            : //NON OF THE ABOVE
                              'N/A'
                        }
                      ></textarea>
                    </div>
                  ) : null}
                  {leaveIndividualDetail.status ===
                    LeaveStatus.DISAPPROVED_BY_HRDM ||
                  leaveIndividualDetail.status ===
                    LeaveStatus.DISAPPROVED_BY_SUPERVISOR ||
                  leaveIndividualDetail.status ===
                    LeaveStatus.DISAPPROVED_BY_HRMO ? (
                    <>
                      <div className="flex flex-row items-center justify-between w-full">
                        <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                          {leaveIndividualDetail.status ===
                          LeaveStatus.DISAPPROVED_BY_HRDM
                            ? 'HRDM Remarks:'
                            : leaveIndividualDetail.status ===
                              LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? 'Supervisor Remarks:'
                            : leaveIndividualDetail.status ===
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
                          leaveIndividualDetail.status ===
                          LeaveStatus.DISAPPROVED_BY_HRDM
                            ? leaveIndividualDetail?.hrdmDisapprovalRemarks
                            : leaveIndividualDetail.status ===
                              LeaveStatus.DISAPPROVED_BY_SUPERVISOR
                            ? leaveIndividualDetail?.supervisorDisapprovalRemarks
                            : 'N/A'
                        }
                      ></textarea>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="w-full justify-end flex gap-2">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={(e) => closeModalAction()}
                type="submit"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalsCompletedLeaveModal;
