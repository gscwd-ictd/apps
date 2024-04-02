/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal, OtpModal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PdcApprovalAction, TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';
import { usePdcApprovalsStore } from 'apps/portal/src/store/pdc-approvals.store';
import { useEffect, useState } from 'react';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { isEqual } from 'lodash';
import { ApprovalOtpContentsPdc } from './PdcApprovalOtp/ApprovalOtpContentsPdc';
import { ConfirmationPdcModal } from './PdcApprovalOtp/ConfirmationPdcModal';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { UserRole } from 'libs/utils/src/lib/enums/user-roles.enum';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type PdcAction = {
  action: PdcApprovalAction;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: `${PdcApprovalAction.APPROVE}` },
  { label: 'Disapprove', value: `${PdcApprovalAction.DISAPPROVE}` },
];

export const TrainingDetailsModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    loadingResponse,
    individualTrainingDetails,
    otpPdcModalIsOpen,
    confirmTrainingModalIsOpen,
    setConfirmTrainingModalIsOpen,
    setOtpPdcModalIsOpen,
  } = usePdcApprovalsStore((state) => ({
    individualTrainingDetails: state.individualTrainingDetails,
    loadingResponse: state.loading.loadingResponse,
    otpPdcModalIsOpen: state.otpPdcModalIsOpen,
    confirmTrainingModalIsOpen: state.confirmTrainingModalIsOpen,
    setConfirmTrainingModalIsOpen: state.setConfirmTrainingModalIsOpen,
    setOtpPdcModalIsOpen: state.setOtpPdcModalIsOpen,
  }));

  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  const [reason, setReason] = useState<string>('');

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<PdcAction>({
    mode: 'onChange',
    defaultValues: {
      action: PdcApprovalAction.APPROVE,
    },
  });

  useEffect(() => {
    if (!modalState) {
      setValue('action', null);
    }
  }, [modalState]);

  const onSubmit: SubmitHandler<PdcAction> = (data: PdcAction) => {
    if (data.action === PdcApprovalAction.APPROVE) {
      console.log(individualTrainingDetails);
      setOtpPdcModalIsOpen(true);
    } else {
      setConfirmTrainingModalIsOpen(true);
    }
  };

  //close confirmation modal
  const closeConfirmationModal = async () => {
    setConfirmTrainingModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={windowWidth > 1024 ? 'md' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Training Details</span>
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
          <div className="w-full h-full flex flex-col gap-2">
            <div className="w-full flex flex-col gap-2 px-4 rounded">
              {/* loading post reponse */}
              {loadingResponse ? (
                <AlertNotification
                  logo={<LoadingSpinner size="xs" />}
                  alertType="info"
                  notifMessage="Submitting Request"
                  dismissible={false}
                />
              ) : null}

              <AlertNotification
                alertType={
                  individualTrainingDetails.status === TrainingStatus.ON_GOING_NOMINATION
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.NOMINATION_DONE
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_APPROVAL
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                    ? 'error'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED
                    ? 'error'
                    : individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.GM_DECLINED
                    ? 'error'
                    : individualTrainingDetails.status === TrainingStatus.FOR_BATCHING
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.DONE_BATCHING
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.UPCOMING
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.ON_GOING_TRAINING
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.REQUIREMENTS_SUBMISSION
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.PENDING
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.COMPLETED
                    ? 'success'
                    : 'info'
                }
                notifMessage={
                  individualTrainingDetails.status === TrainingStatus.ON_GOING_NOMINATION
                    ? 'On Going Nomination'
                    : individualTrainingDetails.status === TrainingStatus.NOMINATION_DONE
                    ? 'Nomination Done'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_APPROVAL
                    ? 'For PDC Secretary Review'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
                    ? 'For PDC Chairman Review'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                    ? 'Disapproved by PDC Chairman'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED
                    ? 'Disapproved by PDC Secretary'
                    : individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
                    ? 'For General Manager Review'
                    : individualTrainingDetails.status === TrainingStatus.GM_DECLINED
                    ? 'Disapproved by General Manager'
                    : individualTrainingDetails.status === TrainingStatus.FOR_BATCHING
                    ? 'On Going Batching'
                    : individualTrainingDetails.status === TrainingStatus.DONE_BATCHING
                    ? 'Done Batching'
                    : individualTrainingDetails.status === TrainingStatus.UPCOMING
                    ? 'Upcoming'
                    : individualTrainingDetails.status === TrainingStatus.ON_GOING_TRAINING
                    ? 'On Going Training'
                    : individualTrainingDetails.status === TrainingStatus.REQUIREMENTS_SUBMISSION
                    ? 'For Requirements Submission'
                    : individualTrainingDetails.status === TrainingStatus.PENDING
                    ? 'Pending'
                    : individualTrainingDetails.status === TrainingStatus.COMPLETED
                    ? 'Completed'
                    : individualTrainingDetails.status
                }
                dismissible={false}
              />

              <div className="flex flex-col justify-between items-start">
                <label className="text-slate-500 text-md whitespace-nowrap sm:w-80 ">Course Title:</label>

                <div className="w-auto pl-0 md:pl-4">
                  <label className="text-slate-500 h-12 w-96 text-md font-medium">
                    {individualTrainingDetails.courseTitle}
                  </label>
                </div>
              </div>
              <div className="flex flex-col justify-between items-start">
                <label className="text-slate-500 text-md whitespace-nowrap sm:w-80">Location:</label>

                <div className="w-auto pl-0 md:pl-4">
                  <label className="text-slate-500 h-12 w-96 text-md font-medium">
                    {individualTrainingDetails.location}
                  </label>
                </div>
              </div>
              <div className="flex flex-col justify-between items-start">
                <label className="text-slate-500 text-md whitespace-nowrap sm:w-80">Duration:</label>

                <div className="w-auto">
                  <label className="text-slate-500 h-12 pl-0 md:pl-4 text-md font-medium">
                    {DateFormatter(individualTrainingDetails.trainingStart, 'MM-DD-YYYY')} -{' '}
                    {DateFormatter(individualTrainingDetails.trainingEnd, 'MM-DD-YYYY')}{' '}
                  </label>
                </div>
              </div>

              <div className="flex flex-row md:gap-2 justify-between items-start w-full">
                <div className="flex flex-col justify-between items-start">
                  <label className="text-slate-500 text-md whitespace-nowrap">No. of Participants:</label>

                  <div className="pl-0 md:pl-4">
                    <label className="text-slate-500 h-12 text-md font-medium">
                      {individualTrainingDetails.numberOfParticipants}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start">
                  <label className="text-slate-500 text-md whitespace-nowrap">Source:</label>

                  <div className="pl-0 md:pl-4">
                    <label className="text-slate-500 h-12 text-md capitalize font-medium">
                      {individualTrainingDetails.source}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start">
                  <label className="text-slate-500 text-md whitespace-nowrap">Type:</label>

                  <div className="pl-0 md:pl-4">
                    <label className="text-slate-500 h-12 text-md capitalize font-medium">
                      {individualTrainingDetails?.type}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:gap-2 justify-between items-start md:items-start pt-2">
                <label className="text-slate-500 text-md whitespace-nowrap sm:w-80">Participants:</label>
              </div>

              {(employeeDetail.employmentDetails.isPdcSecretariat ||
                employeeDetail.employmentDetails.isPdcChairman ||
                isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
              individualTrainingDetails.status != TrainingStatus.ON_GOING_NOMINATION &&
              individualTrainingDetails.status != TrainingStatus.NOMINATION_DONE &&
              individualTrainingDetails.status != TrainingStatus.PENDING ? (
                <div className="flex flex-col md:gap-2 justify-between items-start md:items-start">
                  <div className="w-full overflow-x-auto">
                    <table className="w-screen md:w-full border border-separate bg-slate-50 border-spacing-0 rounded-md text-slate-500">
                      <thead className="border-0 ">
                        <tr className="border-l border-r">
                          <th
                            colSpan={3}
                            className="px-10 py-2 text-sm text-center items-center md:px-6 md:text-md font-medium border-b"
                          >
                            Nominated Employee(s)
                          </th>
                        </tr>

                        {individualTrainingDetails.nominee?.length > 0 ? (
                          <tr className="border-l border-r">
                            <td className={`px-2 w-12 text-center border-b border-r text-sm`}>No.</td>
                            <td className={`px-2 text-center border-b border-r text-sm`}>Name</td>
                            <td className={`px-2 text-center border-b text-sm`}>Supervisor</td>
                          </tr>
                        ) : null}
                      </thead>
                      <tbody className="text-sm text-center ">
                        {individualTrainingDetails.nominee?.length > 0 ? (
                          individualTrainingDetails.nominee.map((employees, index) => (
                            <tr key={index} className="border-l border-r">
                              <td
                                className={`px-2 py-1 text-start border-r ${
                                  individualTrainingDetails.nominee.length === index + 1 ? '' : 'border-b'
                                }`}
                              >{`${index + 1}.`}</td>
                              <td
                                className={`px-2 py-1 text-start border-r ${
                                  individualTrainingDetails.nominee.length === index + 1 ? '' : 'border-b'
                                }`}
                              >
                                {employees.name}
                              </td>
                              <td
                                className={`px-2 text-start ${
                                  individualTrainingDetails.nominee.length === index + 1 ? '' : 'border-b'
                                }`}
                              >
                                {employees.supervisor.name}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-0">
                            <td colSpan={3}>NO EMPLOYEE NOMINATED</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {individualTrainingDetails.status === TrainingStatus.GM_DECLINED ||
              individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED ||
              individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED ? (
                <>
                  <div className="flex flex-row items-center justify-between w-full pt-1">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                      {individualTrainingDetails.status === TrainingStatus.GM_DECLINED
                        ? 'Remarks by General Manager:'
                        : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                        ? 'Remarks by PDC Chairman:'
                        : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED
                        ? 'Remarks by PDC Secretary:'
                        : 'Remarks:'}
                    </label>
                  </div>
                  <textarea
                    disabled
                    rows={2}
                    className="w-full p-2 text-md rounded resize-none text-slate-500 border-slate-300"
                    value={individualTrainingDetails.remarks ?? 'None'}
                  ></textarea>
                </>
              ) : null}

              {(employeeDetail.employmentDetails.isPdcSecretariat &&
                individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_APPROVAL) ||
              (employeeDetail.employmentDetails.isPdcChairman &&
                individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL) ||
              ((isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
                individualTrainingDetails.status === TrainingStatus.GM_APPROVAL) ? (
                <form id="PdcAction" onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-start items-start md:items-center pt-1 md:pt-2">
                    <span className="text-slate-500 text-md font-medium">Action:</span>

                    <select
                      id="action"
                      className="text-slate-500 h-12 w-full md:w-40 rounded text-md border-slate-300"
                      required
                      {...register('action')}
                    >
                      <option value="" disabled>
                        Select Action
                      </option>
                      {approvalAction.map((item: SelectOption, idx: number) => (
                        <option value={item.value} key={idx}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {watch('action') === PdcApprovalAction.DISAPPROVE ? (
                    <textarea
                      required={true}
                      className={'resize-none mt-4 w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                      placeholder="Enter Reason for Disapproval"
                      rows={3}
                      onChange={(e) => setReason(e.target.value as unknown as string)}
                    ></textarea>
                  ) : null}
                </form>
              ) : null}
            </div>
          </div>
          <OtpModal modalState={otpPdcModalIsOpen} setModalState={setOtpPdcModalIsOpen} title={'TRAINING APPROVAL OTP'}>
            {/* contents */}
            <ApprovalOtpContentsPdc
              mobile={employeeDetail.profile.mobileNumber}
              employeeId={employeeDetail.user._id}
              action={PdcApprovalAction.APPROVE}
              tokenId={individualTrainingDetails.trainingId}
              otpName={`${
                employeeDetail.employmentDetails.isPdcSecretariat
                  ? 'pdcSecretariatApproval'
                  : employeeDetail.employmentDetails.isPdcChairman &&
                    !isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) &&
                    !isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)
                  ? 'pdcChairmanApproval'
                  : !employeeDetail.employmentDetails.isPdcChairman &&
                    (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                      isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER))
                  ? 'pdcGeneralManagerApproval'
                  : employeeDetail.employmentDetails.isPdcChairman &&
                    (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                      isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER))
                  ? 'pdcGmAndChairmanApproval'
                  : 'N/A'
              }`}
            />
          </OtpModal>
          <ConfirmationPdcModal
            modalState={confirmTrainingModalIsOpen}
            setModalState={setConfirmTrainingModalIsOpen}
            closeModalAction={closeConfirmationModal}
            action={PdcApprovalAction.DISAPPROVE}
            tokenId={individualTrainingDetails.trainingId}
            remarks={reason}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="max-w-auto">
              {(employeeDetail.employmentDetails.isPdcSecretariat &&
                individualTrainingDetails.status == TrainingStatus.PDC_SECRETARIAT_APPROVAL) ||
              (employeeDetail.employmentDetails.isPdcChairman &&
                individualTrainingDetails.status == TrainingStatus.PDC_CHAIRMAN_APPROVAL) ||
              ((isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
                individualTrainingDetails.status == TrainingStatus.GM_APPROVAL) ? (
                <Button form={`PdcAction`} variant={'primary'} size={'md'} loading={false} type="submit">
                  Submit
                </Button>
              ) : (
                <Button variant={'default'} size={'md'} loading={false} type="submit" onClick={closeModalAction}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainingDetailsModal;
