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
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { leaveAction } from 'apps/portal/src/types/approvals.type';

type ApprovalsPendingLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: 'approved' },
  { label: 'Disapprove', value: 'disapproved' },
];

export const ApprovalsPendingLeaveModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ApprovalsPendingLeaveModalProps) => {
  const {
    leaveIndividualDetail,
    loadingLeaveDetails,
    errorLeaveDetails,
    pendingLeaveModalIsOpen,
    setPendingLeaveModalIsOpen,
    otpLeaveModalIsOpen,
    setOtpLeaveModalIsOpen,
    declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen,
  } = useApprovalStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    otpLeaveModalIsOpen: state.otpLeaveModalIsOpen,
    setOtpLeaveModalIsOpen: state.setOtpLeaveModalIsOpen,
    declineApplicationModalIsOpen: state.declineApplicationModalIsOpen,
    setDeclineApplicationModalIsOpen: state.setDeclineApplicationModalIsOpen,
  }));

  const [reason, setReason] = useState<string>('');
  const [action, setAction] = useState<string>('');

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } =
    useForm<leaveAction>({
      mode: 'onChange',
      defaultValues: {
        id: leaveIndividualDetail.id,
        status: null,
      },
    });

  useEffect(() => {
    setValue('id', leaveIndividualDetail.id);
  }, [leaveIndividualDetail.id]);

  useEffect(() => {
    if (!modalState) {
      setValue('status', null);
    }
  }, [modalState]);

  const onSubmit: SubmitHandler<leaveAction> = (data: leaveAction) => {
    setValue('id', leaveIndividualDetail.id);
    if (data.status === 'approved') {
      setOtpLeaveModalIsOpen(true);
    } else {
      setDeclineApplicationModalIsOpen(true);
    }
  };

  const handleReason = (e: string) => {
    setReason(e);
  };

  const customClose = () => {
    setReason('');
    setAction('approve');
    setPendingLeaveModalIsOpen(false);
  };

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
            <div className="flex justify-between px-5">
              <span className="text-xl md:text-2xl">
                Leave Application For Approval
              </span>
              <button
                className="px-2 rounded-full hover:bg-slate-100 outline-slate-100 outline-8"
                onClick={customClose}
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
                  className="flex w-full h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col w-full h-full ">
              <div className="flex flex-col w-full h-full gap-2 ">
                <div className="flex flex-col w-full gap-2 p-4 rounded">
                  {leaveIndividualDetail ? (
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

                  <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                      Leave Type:
                    </label>

                    <div className="w-96 ">
                      <label className="w-full text-md text-slate-500 ">
                        {leaveIndividualDetail?.leaveBenefitsId?.leaveName}
                      </label>
                    </div>
                  </div>

                  {leaveIndividualDetail?.leaveBenefitsId?.leaveName ? (
                    <>
                      <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                        <label className="text-md font-medium text-slate-500">
                          {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                            'Vacation Leave' ||
                          leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                            'Special Privilege Leave'
                            ? 'Location:'
                            : leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Sick Leave'
                            ? 'Hospitalization:'
                            : leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Study Leave'
                            ? 'Study:'
                            : leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Others'
                            ? 'Other Purpose: '
                            : null}
                        </label>

                        <div className="flex w-96 ">
                          {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                            'Vacation Leave' ||
                          leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                            'Special Privilege Leave' ? (
                            <div className="w-full text-md text-slate-500">
                              {leaveIndividualDetail?.inPhilippines
                                ? leaveIndividualDetail.inPhilippines
                                : leaveIndividualDetail.abroad}
                            </div>
                          ) : null}

                          {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                          'Sick Leave' ? (
                            <>
                              <div className="w-full text-md text-slate-500">
                                {leaveIndividualDetail?.inHospital
                                  ? 'In Hospital'
                                  : 'Out Patient'}
                              </div>
                            </>
                          ) : null}

                          {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                          'Study Leave' ? (
                            <>
                              <div className="w-full text-md text-slate-500">
                                {leaveIndividualDetail?.forBarBoardReview ===
                                '1'
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
                            {leaveIndividualDetail?.leaveBenefitsId
                              ?.leaveName === 'Maternity Leave' ||
                            leaveIndividualDetail?.leaveBenefitsId
                              ?.leaveName === 'Study Leave'
                              ? // show first and last date (array) only if maternity or study leave
                                `From ${
                                  leaveIndividualDetail?.leaveDates[0]
                                } To ${
                                  leaveIndividualDetail?.leaveDates[
                                    leaveIndividualDetail?.leaveDates.length - 1
                                  ]
                                }`
                              : // show all dates if not maternity or study leave
                                leaveIndividualDetail?.leaveDates.join(', ')}
                          </label>
                        </div>
                      </div>

                      {/* {watch('typeOfLeaveDetails.leaveName') === 'Others' &&
                      watch('other') === 'Monetization of Leave Credits' ? (
                        <div className="flex flex-row items-center justify-between w-full">
                          <div className="flex flex-row items-center justify-between w-full">
                            <label className="pt-2 text-xl font-medium text-slate-500">
                              Commutation
                            </label>
                          </div>

                          <div className="flex items-center w-full gap-2">
                            {watch('other') ===
                            'Monetization of Leave Credits' ? (
                              <div className="w-full">
                                <select
                                  id="commutation"
                                  className="w-full h-16 text-md rounded text-slate-500 border-slate-300"
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

                      {leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Vacation Leave' ||
                      leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Special Privilege Leave' ||
                      leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Sick Leave' ||
                      leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Special Leave Benefits for Women' ||
                      (leaveIndividualDetail?.leaveBenefitsId?.leaveName ===
                        'Study Leave' &&
                        leaveIndividualDetail?.leaveBenefitsId?.leaveName) ? (
                        <div className="flex flex-col items-center justify-between w-full">
                          <div className="flex flex-row items-center justify-between w-full">
                            <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                              Specific Details:
                            </label>
                          </div>
                          <textarea
                            disabled
                            rows={3}
                            className="w-full p-2 mt-2 text-md rounded resize-none text-slate-500 border-slate-300"
                            value={
                              //VACATION OR SPL //
                              leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Vacation Leave' ||
                              leaveIndividualDetail?.leaveBenefitsId
                                ?.leaveName === 'Special Privilege Leave'
                                ? leaveIndividualDetail.inPhilippines
                                  ? leaveIndividualDetail.inPhilippines
                                  : leaveIndividualDetail.abroad
                                : //SICK LEAVE
                                leaveIndividualDetail?.leaveBenefitsId
                                    ?.leaveName === 'Sick Leave'
                                ? leaveIndividualDetail.inHospital
                                  ? leaveIndividualDetail.inHospital
                                  : leaveIndividualDetail.outPatient
                                : //SLB FOR WOMEN
                                leaveIndividualDetail?.leaveBenefitsId
                                    ?.leaveName ===
                                  'Special Leave Benefits for Women'
                                ? leaveIndividualDetail.splWomen
                                : //NON OF THE ABOVE
                                  ''
                            }
                          ></textarea>
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {/* <div className="w-full pb-4">
                    <span className="text-xl font-medium text-slate-500">
                      Your current Leave Credits:
                    </span>
                    <table className="w-full border border-collapse rounded-md bg-slate-50 text-slate-600 border-spacing-0 border-slate-400">
                      <tbody>
                        <tr className="border border-slate-400">
                          <td className="border border-slate-400"></td>
                          <td className="p-1 text-sm text-center border border-slate-400">
                            Vacation Leave
                          </td>
                          <td className="p-1 text-sm text-center border border-slate-400">
                            Forced Leave
                          </td>
                          <td className="p-1 text-sm text-center border border-slate-400">
                            Sick Leave
                          </td>
                        </tr>
                        <tr className="border border-slate-400">
                          <td className="p-1 text-sm border border-slate-400">
                            Total Earned
                          </td>
                          <td className="p-1 text-sm text-center border border-slate-400">
                            10
                          </td>
                          <td className="p-1 text-sm text-center border border-slate-400">
                            5
                          </td>
                          <td className="p-1 text-sm text-center border border-slate-400">
                            10
                          </td>
                        </tr>
                        <tr>
                          <td className="p-1 text-sm border border-slate-400">
                            Less this application
                          </td>
                          <td className="p-1 text-sm text-center border border-slate-400">
                            0
                          </td>
                          <td className="p-1 text-sm text-center border border-slate-400">
                            0
                          </td>
                          <td className="p-1 text-sm text-center border border-slate-400">
                            0
                          </td>
                        </tr>
                        <tr className="bg-green-100 border border-slate-400">
                          <td className="p-1 text-sm border border-slate-400">
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
                  </div> */}
                  <div className="w-full flex gap-2 justify-start items-center pt-4">
                    <span className="text-slate-500 text-md font-medium">
                      Action:
                    </span>
                    <form id="PassSlipAction" onSubmit={handleSubmit(onSubmit)}>
                      <select
                        id="action"
                        className="text-slate-500 h-12 w-42 rounded text-md border-slate-300"
                        required
                        {...register('status')}
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        {approvalAction.map(
                          (item: SelectOption, idx: number) => (
                            <option value={item.value} key={idx}>
                              {item.label}
                            </option>
                          )
                        )}
                      </select>
                    </form>
                  </div>
                  <form id="DisapproveForm">
                    {action === 'Disapprove' ? (
                      <textarea
                        required={true}
                        className={
                          'resize-none mt-2 w-full p-2 rounded text-slate-500 text-md border-slate-300'
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
              </div>
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
                // onClick={(e) => modalAction(e)}
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
