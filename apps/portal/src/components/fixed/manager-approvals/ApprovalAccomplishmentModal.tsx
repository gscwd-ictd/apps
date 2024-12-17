/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, CaptchaModal, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { OvertimeAccomplishmentApprovalPatch } from 'libs/utils/src/lib/types/overtime.type';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { GenerateCaptcha } from '../captcha/CaptchaGenerator';
import { ApprovalCaptcha } from './ApprovalOtp/ApprovalCaptcha';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { ManagerConfirmationApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: `${OvertimeAccomplishmentStatus.APPROVED}` },
  { label: 'Disapprove', value: `${OvertimeAccomplishmentStatus.DISAPPROVED}` },
];

export const ApprovalAccomplishmentModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeAccomplishmentModalIsOpen,
    overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId,
    accomplishmentDetails,
    overtimeAccomplishmentEmployeeName,
    overtimeDetails,
    loadingAccomplishmentResponse,
    patchResponseAccomplishment,
    confirmApplicationModalIsOpen,
    setConfirmApplicationModalIsOpen,
    getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail,
    emptyResponseAndError,
  } = useApprovalStore((state) => ({
    overtimeAccomplishmentModalIsOpen: state.overtimeAccomplishmentModalIsOpen,
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    accomplishmentDetails: state.accomplishmentDetails,
    overtimeAccomplishmentEmployeeName: state.overtimeAccomplishmentEmployeeName,
    overtimeDetails: state.overtimeDetails,
    loadingAccomplishmentResponse: state.loading.loadingAccomplishmentResponse,
    patchResponseAccomplishment: state.response.patchResponseAccomplishment,
    confirmApplicationModalIsOpen: state.confirmApplicationModalIsOpen,
    setConfirmApplicationModalIsOpen: state.setConfirmApplicationModalIsOpen,
    getAccomplishmentDetails: state.getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess: state.getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail: state.getAccomplishmentDetailsFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const { windowWidth } = UseWindowDimensions();
  const [pwdArray, setPwdArray] = useState<string[]>();
  const [password, setPassword] = useState<string>('');
  const [captchaPassword, setCaptchaPassword] = useState<string>('');
  const [isCaptchaError, setIsCaptchaError] = useState<boolean>(false);

  // generate captcha
  const getCaptcha = () => {
    setPassword('');
    const data = GenerateCaptcha();
    if (data) {
      setCaptchaPassword(data.pwd);
      setPwdArray([
        `${data.captcha[0]}`,
        `${data.captcha[1]}`,
        `${data.captcha[2]}`,
        `${data.captcha[3]}`,
        `${data.captcha[4]}`,
        `${data.captcha[5]}`,
      ]);
    }
  };

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<OvertimeAccomplishmentApprovalPatch>({
    mode: 'onChange',
    defaultValues: {
      status: null,
      remarks: '',
      actualHrs: null,
      approvedBy: employeeDetails.employmentDetails.userId,
    },
  });

  useEffect(() => {
    setValue('employeeId', overtimeAccomplishmentEmployeeId);
    setValue('overtimeApplicationId', overtimeAccomplishmentApplicationId);
    setValue('approvedBy', employeeDetails.employmentDetails.userId);
  }, [watch('status'), confirmApplicationModalIsOpen]);

  useEffect(() => {
    reset();
    setIsCaptchaError(false);
    setPassword('');
    setPwdArray([]);
  }, [overtimeAccomplishmentModalIsOpen]);

  const overtimeAccomplishmentUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${overtimeAccomplishmentEmployeeId}/${overtimeAccomplishmentApplicationId}/details`;

  const {
    data: swrOvertimeAccomplishment,
    isLoading: swrOvertimeAccomplishmentIsLoading,
    error: swrOvertimeAccomplishmentError,
    mutate: mutateOvertimeAccomplishments,
  } = useSWR(overtimeAccomplishmentModalIsOpen ? overtimeAccomplishmentUrl : null, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeAccomplishmentIsLoading) {
      getAccomplishmentDetails(swrOvertimeAccomplishmentIsLoading);
    }
  }, [swrOvertimeAccomplishmentIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeAccomplishment)) {
      getAccomplishmentDetailsSuccess(swrOvertimeAccomplishmentIsLoading, swrOvertimeAccomplishment);
    }

    if (!isEmpty(swrOvertimeAccomplishmentError)) {
      getAccomplishmentDetailsFail(swrOvertimeAccomplishmentIsLoading, swrOvertimeAccomplishmentError.message);
    }
  }, [swrOvertimeAccomplishment, swrOvertimeAccomplishmentError]);

  useEffect(() => {
    if (!isEmpty(patchResponseAccomplishment)) {
      mutateOvertimeAccomplishments();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [patchResponseAccomplishment]);

  // close Confirm Application Modal
  const closeConfirmModal = async () => {
    setConfirmApplicationModalIsOpen(false);
  };

  const [dataToSubmit, setDataToSubmit] = useState<OvertimeAccomplishmentApprovalPatch>();

  const onSubmit: SubmitHandler<OvertimeAccomplishmentApprovalPatch> = async (
    data: OvertimeAccomplishmentApprovalPatch
  ) => {
    setDataToSubmit(data);
    setConfirmApplicationModalIsOpen(true);
  };

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'md' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Accomplishment Report</span>
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
          {!accomplishmentDetails || swrOvertimeAccomplishmentIsLoading ? (
            <div className="w-full h-[90%]  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
              {/* <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                /> */}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col  ">
              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-0 px-4 rounded">
                  <AlertNotification
                    logo={loadingAccomplishmentResponse ? <LoadingSpinner size="xs" /> : null}
                    alertType={
                      accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                      !loadingAccomplishmentResponse
                        ? 'warning'
                        : accomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED &&
                          !loadingAccomplishmentResponse
                        ? 'success'
                        : accomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED &&
                          !loadingAccomplishmentResponse
                        ? 'error'
                        : 'info'
                    }
                    notifMessage={
                      accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                      !loadingAccomplishmentResponse
                        ? accomplishmentDetails.accomplishments
                          ? 'For Supervisor Review'
                          : 'Awaitng Completion from Employee'
                        : accomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED &&
                          !loadingAccomplishmentResponse
                        ? 'Approved'
                        : accomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED &&
                          !loadingAccomplishmentResponse
                        ? 'Disapproved'
                        : 'Processing'
                    }
                    dismissible={false}
                  />

                  <div className="flex flex-wrap justify-between">
                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Name:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">{overtimeAccomplishmentEmployeeName}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Overtime Date:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">
                          {DateFormatter(overtimeDetails.plannedDate, 'MM-DD-YYYY')}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Estimated Hours:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">{overtimeDetails.estimatedHours}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Approved Hours:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">
                          {accomplishmentDetails.actualHrs ? Number(accomplishmentDetails.actualHrs).toFixed(2) : '---'}
                        </label>
                      </div>
                    </div>

                    {/* Day 1 IVMS Entries */}
                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">IVMS Entries:</label>
                      <div className="w-auto ml-5">
                        {accomplishmentDetails.entriesForTheDay &&
                        accomplishmentDetails.entriesForTheDay.length > 0 &&
                        accomplishmentDetails.entriesForTheDay.filter(
                          (e) =>
                            DateFormatter(e, 'MM-DD-YYYY') ===
                            DateFormatter(accomplishmentDetails.plannedDate, 'MM-DD-YYYY')
                        ).length > 0 ? (
                          accomplishmentDetails.entriesForTheDay
                            .filter(
                              (e) =>
                                DateFormatter(e, 'MM-DD-YYYY') ===
                                DateFormatter(accomplishmentDetails.plannedDate, 'MM-DD-YYYY')
                            )
                            .map((logs: string, idx: number) => {
                              return (
                                <div key={idx}>
                                  <label className="text-md font-medium ">{DateTimeFormatter(logs)}</label>
                                </div>
                              );
                            })
                        ) : (
                          <label className="text-md font-medium ">None Found</label>
                        )}
                      </div>
                    </div>

                    {/* Day 2 IVMS Entries */}
                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">IVMS Entries Next Day:</label>
                      <div className="w-auto ml-5">
                        {accomplishmentDetails.entriesForTheDay &&
                        accomplishmentDetails.entriesForTheDay.length > 0 &&
                        accomplishmentDetails.entriesForTheDay.filter(
                          (e) =>
                            DateFormatter(e, 'MM-DD-YYYY') !==
                            DateFormatter(accomplishmentDetails.plannedDate, 'MM-DD-YYYY')
                        ).length > 0 ? (
                          accomplishmentDetails.entriesForTheDay
                            .filter(
                              (e) =>
                                DateFormatter(e, 'MM-DD-YYYY') !==
                                DateFormatter(accomplishmentDetails.plannedDate, 'MM-DD-YYYY')
                            )
                            .map((logs: string, idx: number) => {
                              return (
                                <div key={idx}>
                                  <label className="text-md font-medium ">{DateTimeFormatter(logs)}</label>
                                </div>
                              );
                            })
                        ) : (
                          <label className="text-md font-medium ">None Found</label>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Encoded Time In & Out:</label>

                      <div className="w-auto ml-5 flex flex-col">
                        <label className="text-md font-medium">
                          Start: {DateTimeFormatter(accomplishmentDetails?.encodedTimeIn)}
                        </label>
                        <label className="text-md font-medium">
                          End: {DateTimeFormatter(accomplishmentDetails?.encodedTimeOut)}
                        </label>
                        <label className="text-md font-medium">
                          Total Hours:
                          {` ${accomplishmentDetails?.computedEncodedHours} Hour(s)`}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">
                        {accomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED
                          ? 'Disapproved By:'
                          : 'Approved By:'}
                      </label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">{accomplishmentDetails.approvedBy ?? '---'}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Accomplishment:</label>

                      <div className="w-auto ml-5 ">
                        <label className="text-md font-medium whitespace-pre-line">
                          {accomplishmentDetails.accomplishments ?? 'Not yet filled out'}
                        </label>
                      </div>
                    </div>

                    {accomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                      <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Remarks:</label>

                        <div className="w-auto ml-5">
                          <label className="text-md font-medium">
                            {accomplishmentDetails.remarks ?? 'Not yet filled out'}
                          </label>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
                    <form id="OvertimeAccomplishmentAction" onSubmit={handleSubmit(onSubmit)}>
                      <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-end items-start md:items-center pb-3">
                        <span className="text-slate-500 text-md">Approved Hours:</span>

                        <input
                          type="number"
                          className="border-slate-300 text-slate-500 h-12 text-md w-full md:w-44 rounded-lg"
                          placeholder="Number of hours"
                          required
                          defaultValue={0}
                          max={watch('status') === OvertimeAccomplishmentStatus.DISAPPROVED ? '0' : '24'}
                          step={0.1}
                          min={watch('status') === OvertimeAccomplishmentStatus.DISAPPROVED ? '0' : '0.1'}
                          {...register('actualHrs')}
                        />
                      </div>

                      <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-end items-start md:items-center">
                        <span className="text-slate-500 text-md">Action:</span>

                        <select
                          id="action"
                          className="text-slate-500 h-12 w-full md:w-44 rounded-lg text-md border-slate-300"
                          required
                          {...register('status')}
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

                      {watch('status') === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                        <textarea
                          required={true}
                          className={'resize-none mt-3 w-full p-2 rounded-md text-slate-500 text-md border-slate-300'}
                          placeholder="Enter Reason"
                          rows={3}
                          {...register('remarks')}
                        ></textarea>
                      ) : null}
                    </form>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          <ConfirmationApprovalModal
            modalState={confirmApplicationModalIsOpen}
            setModalState={setConfirmApplicationModalIsOpen}
            closeModalAction={closeConfirmModal}
            dataToSubmitOvertimeAccomplishment={dataToSubmit}
            tokenId={overtimeDetails.id}
            confirmName={ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT}
            employeeId={employeeDetails.user._id}
          />

          {/* <CaptchaModal
            modalState={confirmApplicationModalIsOpen}
            setModalState={setConfirmApplicationModalIsOpen}
            title={'OVERTIME ACCOMPLISHMENT CAPTCHA'}
          >
            <ApprovalCaptcha
              employeeId={employeeDetails.employmentDetails.userId}
              dataToSubmitOvertimeAccomplishment={dataToSubmit}
              tokenId={overtimeDetails.id}
              captchaName={ManagerConfirmationApproval.OVERTIME_ACCOMPLISHMENT}
            />
          </CaptchaModal> */}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 w-full px-4">
            {accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
              <>
                {/*  */}
                <Button
                  disabled={accomplishmentDetails.accomplishments ? false : true}
                  variant={'primary'}
                  size={'md'}
                  loading={false}
                  form={`OvertimeAccomplishmentAction`}
                  type="submit"
                >
                  Submit
                </Button>
              </>
            ) : (
              <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
                Close
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalAccomplishmentModal;
