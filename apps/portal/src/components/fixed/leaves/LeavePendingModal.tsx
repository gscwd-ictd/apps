import {
  AlertNotification,
  Button,
  Modal,
  ToastNotification,
} from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../store/leave.store';
import { HiX } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { useEffect } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import axios from 'axios';

type LeavePendingModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const LeavePendingModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: LeavePendingModalProps) => {
  const {
    leaveIndividualDetail,
    leaveId,
    loadingLeaveDetails,
    errorLeaveDetails,
    pendingLeaveModalIsOpen,

    setLeaveId,
    getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,

    setLeaveId: state.setLeaveId,
    getLeaveIndividualDetail: state.getLeaveIndividualDetail,
    getLeaveIndividualDetailSuccess: state.getLeaveIndividualDetailSuccess,
    getLeaveIndividualDetailFail: state.getLeaveIndividualDetailFail,
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

  // console.log(leaveIndividualDetail);

  // for cancel pass slip button
  const modalAction = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      {/* Notifications */}
      {!isEmpty(errorLeaveDetails) && pendingLeaveModalIsOpen ? (
        <>
          <ToastNotification
            toastType="error"
            notifMessage={`${errorLeaveDetails}: Failed to load Leave Details`}
          />
        </>
      ) : null}

      <Modal size={'lg'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-2xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Ongoing Leave Application</span>
              <button
                className="hover:bg-slate-100 px-1 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
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
                  <AlertNotification
                    alertType="info"
                    notifMessage={
                      leaveIndividualDetail.leaveApplicationBasicInfo?.status
                        .charAt(0)
                        .toUpperCase() +
                      leaveIndividualDetail.leaveApplicationBasicInfo?.status.slice(
                        1
                      )
                    }
                    dismissible={false}
                  />
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                      <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                        Leave Type:
                      </label>

                      <div className="w-96 ">
                        <label className="text-slate-500 w-full text-lg ">
                          {
                            leaveIndividualDetail.leaveApplicationBasicInfo
                              ?.leaveName
                          }
                        </label>
                      </div>
                    </div>
                  </div>

                  {leaveIndividualDetail.leaveApplicationBasicInfo
                    ?.leaveName ? (
                    <>
                      <div className="flex flex-row justify-between items-center w-full">
                        <label className="text-slate-500 text-lg font-medium">
                          {leaveIndividualDetail.leaveApplicationBasicInfo
                            .leaveName === 'Vacation Leave' ||
                          leaveIndividualDetail.leaveApplicationBasicInfo
                            .leaveName === 'Special Privilege Leave'
                            ? 'Location:'
                            : leaveIndividualDetail.leaveApplicationBasicInfo
                                .leaveName === 'Sick Leave'
                            ? 'Hospitalization:'
                            : leaveIndividualDetail.leaveApplicationBasicInfo
                                .leaveName === 'Study Leave'
                            ? 'Study:'
                            : leaveIndividualDetail.leaveApplicationBasicInfo
                                .leaveName === 'Others'
                            ? 'Other Purpose: '
                            : null}
                        </label>

                        <div className="flex w-96 ">
                          {leaveIndividualDetail.leaveApplicationBasicInfo
                            .leaveName === 'Vacation Leave' ||
                          leaveIndividualDetail.leaveApplicationBasicInfo
                            .leaveName === 'Special Privilege Leave' ? (
                            <div className="text-slate-500 w-full text-lg">
                              {
                                leaveIndividualDetail.leaveApplicationDetails
                                  .inPhilippinesOrAbroad
                              }
                            </div>
                          ) : null}

                          {leaveIndividualDetail.leaveApplicationBasicInfo
                            .leaveName === 'Sick Leave' ? (
                            <>
                              <div className="text-slate-500 w-full text-lg">
                                {
                                  leaveIndividualDetail.leaveApplicationDetails
                                    .hospital
                                }
                              </div>
                            </>
                          ) : null}

                          {leaveIndividualDetail.leaveApplicationBasicInfo
                            .leaveName === 'Study Leave' ? (
                            <>
                              <div className="text-slate-500 w-full text-lg">
                                {leaveIndividualDetail.leaveApplicationDetails
                                  .forBarBoardReview === '1'
                                  ? 'For BAR/Board Examination Review '
                                  : leaveIndividualDetail
                                      .leaveApplicationDetails
                                      .forMastersCompletion === '1'
                                  ? `Completion of Master's Degree `
                                  : 'Other'}
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                          <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                            Leave Dates:
                          </label>

                          <div className="w-96 ">
                            <label className="text-slate-500 w-full text-lg ">
                              {
                                leaveIndividualDetail.leaveApplicationBasicInfo
                                  ?.leaveDates
                              }
                            </label>
                          </div>
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

                      {leaveIndividualDetail.leaveApplicationBasicInfo
                        .leaveName === 'Vacation Leave' ||
                      leaveIndividualDetail.leaveApplicationBasicInfo
                        .leaveName === 'Special Privilege Leave' ||
                      leaveIndividualDetail.leaveApplicationBasicInfo
                        .leaveName === 'Sick Leave' ||
                      leaveIndividualDetail.leaveApplicationBasicInfo
                        .leaveName === 'Special Leave Benefits for Women' ||
                      (leaveIndividualDetail.leaveApplicationBasicInfo
                        .leaveName === 'Study Leave' &&
                        leaveIndividualDetail.leaveApplicationDetails
                          .studyLeaveOther) ? (
                        <div className="flex flex-col justify-between items-center w-full">
                          <div className="flex flex-row justify-between items-center w-full">
                            <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                              Specific Details:
                            </label>
                          </div>
                          <textarea
                            disabled
                            rows={2}
                            className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-lg border-slate-300"
                            value={
                              leaveIndividualDetail.leaveApplicationBasicInfo
                                .leaveName === 'Vacation Leave' ||
                              leaveIndividualDetail.leaveApplicationBasicInfo
                                .leaveName === 'Special Privilege Leave'
                                ? leaveIndividualDetail.leaveApplicationDetails
                                    .location
                                : leaveIndividualDetail
                                    .leaveApplicationBasicInfo.leaveName ===
                                  'Sick Leave'
                                ? leaveIndividualDetail.leaveApplicationDetails
                                    .illness
                                : leaveIndividualDetail
                                    .leaveApplicationBasicInfo.leaveName ===
                                  'Special Leave Benefits for Women'
                                ? leaveIndividualDetail.leaveApplicationDetails
                                    .splWomen
                                : leaveIndividualDetail
                                    .leaveApplicationBasicInfo.leaveName ===
                                    'Study Leave' &&
                                  leaveIndividualDetail.leaveApplicationDetails
                                    .studyLeaveOther
                                ? leaveIndividualDetail.leaveApplicationDetails
                                    .studyLeaveOther
                                : ''
                            }
                          ></textarea>
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  <div className="w-full pb-4">
                    <span className="text-slate-500 text-xl font-medium">
                      Your current Leave Credits:
                    </span>
                    <table className="bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                      <tbody>
                        <tr className="border border-slate-400">
                          <td className="border border-slate-400"></td>
                          <td className="border border-slate-400 text-center text-sm p-1">
                            Vacation Leave
                          </td>
                          <td className="border border-slate-400 text-center text-sm p-1">
                            Forced Leave
                          </td>
                          <td className="border border-slate-400 text-center text-sm p-1">
                            Sick Leave
                          </td>
                        </tr>
                        <tr className="border border-slate-400">
                          <td className="border border-slate-400 text-sm p-1">
                            Total Earned
                          </td>
                          <td className="border border-slate-400 p-1 text-center text-sm">
                            10
                          </td>
                          <td className="border border-slate-400 p-1 text-center text-sm">
                            5
                          </td>
                          <td className="border border-slate-400 p-1 text-center text-sm">
                            10
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-400 text-sm p-1">
                            Less this application
                          </td>
                          <td className="border border-slate-400 p-1 text-center text-sm">
                            0
                          </td>
                          <td className="border border-slate-400 p-1 text-center text-sm">
                            0
                          </td>
                          <td className="border border-slate-400 p-1 text-center text-sm">
                            0
                          </td>
                        </tr>
                        <tr className="border border-slate-400 bg-green-100">
                          <td className="border border-slate-400 text-sm p-1">
                            Balance
                          </td>
                          <td
                            className={` border border-slate-400 p-1 text-center text-sm`}
                          >
                            0
                          </td>
                          <td
                            className={` border border-slate-400 p-1 text-center text-sm`}
                          >
                            0
                          </td>
                          <td
                            className={` border border-slate-400 p-1 text-center text-sm`}
                          >
                            0
                          </td>
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
            <div className="min-w-[6rem] max-w-auto">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={(e) => modalAction(e)}
                type="submit"
              >
                Cancel Leave
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeavePendingModal;
