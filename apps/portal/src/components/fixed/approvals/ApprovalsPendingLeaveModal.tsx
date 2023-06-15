import axios from 'axios';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiMail, HiX } from 'react-icons/hi';
import { withSession } from '../../../utils/helpers/session';
import { useApprovalStore } from '../../../store/approvals.store';
import { Modal } from 'libs/oneui/src/components/Modal';
import { Button } from 'libs/oneui/src/components/Button';
import { isEmpty } from 'lodash';
import { SpinnerDotted } from 'spinners-react';
import { AlertNotification } from '@gscwd-apps/oneui';
import { useLeaveStore } from 'apps/portal/src/store/leave.store';

type ApprovalsPendingLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ApprovalsPendingLeaveModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ApprovalsPendingLeaveModalProps) => {
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
  } = useApprovalStore((state) => ({
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

  const [reason, setReason] = useState<string>('');
  const [action, setAction] = useState<string>('');

  const onChangeType = (action: string) => {
    setAction(action);
    console.log(action);
  };

  const handleReason = (e: string) => {
    setReason(e);
  };

  const getLeaveDetail = async (leaveId: string) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/details/${leaveId}`
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

  //submit
  const modalAction = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Modal size={'lg'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">
                Ongoing Leave Application
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
                  {leaveIndividualDetail.leaveApplicationBasicInfo ? (
                    <AlertNotification
                      alertType="warning"
                      // notifMessage={
                      //   leaveIndividualDetail.leaveApplicationBasicInfo?.status
                      //     .charAt(0)
                      //     .toUpperCase() +
                      //   leaveIndividualDetail.leaveApplicationBasicInfo?.status.slice(
                      //     1
                      //   )
                      // }
                      notifMessage={'Awaiting approval'}
                      dismissible={false}
                    />
                  ) : null}

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
                              {leaveIndividualDetail.leaveApplicationBasicInfo
                                .leaveName === 'Maternity Leave' ||
                              leaveIndividualDetail.leaveApplicationBasicInfo
                                .leaveName === 'Study Leave'
                                ? // show first and last date (array) only if maternity or study leave
                                  `From ${
                                    leaveIndividualDetail
                                      .leaveApplicationBasicInfo?.leaveDates[0]
                                  } To ${
                                    leaveIndividualDetail
                                      .leaveApplicationBasicInfo?.leaveDates[
                                      leaveIndividualDetail
                                        .leaveApplicationBasicInfo?.leaveDates
                                        .length - 1
                                    ]
                                  }`
                                : // show all dates if not maternity or study leave
                                  leaveIndividualDetail.leaveApplicationBasicInfo?.leaveDates.join(
                                    ', '
                                  )}
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
              <div className="w-full flex gap-2 justify-start items-center pt-12">
                <span className="text-slate-500 text-xl font-medium">
                  Action:
                </span>
                <select
                  className={`text-slate-500 w-100 h-10 rounded text-md border border-slate-200'
                  
              `}
                  onChange={(e) =>
                    onChangeType(e.target.value as unknown as string)
                  }
                >
                  <option>Approve</option>
                  <option>Disapprove</option>
                </select>
              </div>
              <form id="DisapproveForm">
                {action === 'Disapprove' ? (
                  <textarea
                    required={true}
                    className={
                      'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
                    }
                    placeholder="Enter Reason"
                    rows={3}
                    onChange={(e) =>
                      handleReason(e.target.value as unknown as string)
                    }
                  ></textarea>
                ) : null}
              </form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                form={'DisapproveForm'}
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={(e) => modalAction(e)}
                type="submit"
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalsPendingLeaveModal;
