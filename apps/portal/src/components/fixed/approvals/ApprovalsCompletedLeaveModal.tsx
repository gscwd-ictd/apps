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
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';

type ApprovalsCompletedLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: 'approved' },
  { label: 'Disapprove', value: 'disapproved' },
];

export const ApprovalsCompletedLeaveModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ApprovalsCompletedLeaveModalProps) => {
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

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal
        size={`${windowWidth > 768 ? 'lg' : 'full'}`}
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
                  {leaveIndividualDetail.status ? (
                    <AlertNotification
                      alertType="info"
                      notifMessage={
                        leaveIndividualDetail?.status.charAt(0).toUpperCase() +
                        leaveIndividualDetail?.status.slice(1)
                      }
                      dismissible={false}
                    />
                  ) : null}

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                        Leave Type:
                      </label>

                      <div className="w-96 ">
                        <label className="text-slate-500 w-full text-md ">
                          {leaveIndividualDetail?.leaveBenefitsId?.leaveName}
                        </label>
                      </div>
                    </div>
                  </div>

                  {leaveIndividualDetail?.leaveBenefitsId?.leaveName ? (
                    <>
                      <div className="flex flex-col md:flex-row justify-between items-start w-full">
                        <label className="text-slate-500 text-md font-medium">
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
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              {leaveIndividualDetail.status === LeaveStatus.APPROVED ? (
                <Button
                  variant={'warning'}
                  size={'md'}
                  loading={false}
                  onClick={(e) => setDeclineApplicationModalIsOpen(true)}
                  type="submit"
                >
                  Cancel Leave Application
                </Button>
              ) : null}
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
