/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, CaptchaModal, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LabelInput } from 'libs/oneui/src/components/Inputs/LabelInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { OvertimeAccomplishmentApprovalPatch } from 'libs/utils/src/lib/types/overtime.type';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { Checkbox } from '../../modular/forms/Checkbox';
import { GetDateDifference } from 'libs/utils/src/lib/functions/GetDateDifference';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { GenerateCaptcha } from '../captcha/CaptchaGenerator';
import { ApprovalCaptcha } from './ApprovalOtp/ApprovalCaptcha';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

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
    captchaModalIsOpen,
    setCaptchaModalIsOpen,
    getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail,
    patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentSuccess,
    patchOvertimeAccomplishmentFail,
    setOvertimeAccomplishmentModalIsOpen,
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
    captchaModalIsOpen: state.captchaModalIsOpen,
    setCaptchaModalIsOpen: state.setCaptchaModalIsOpen,
    getAccomplishmentDetails: state.getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess: state.getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail: state.getAccomplishmentDetailsFail,
    patchOvertimeAccomplishment: state.patchOvertimeAccomplishment,
    patchOvertimeAccomplishmentSuccess: state.patchOvertimeAccomplishmentSuccess,
    patchOvertimeAccomplishmentFail: state.patchOvertimeAccomplishmentFail,
    setOvertimeAccomplishmentModalIsOpen: state.setOvertimeAccomplishmentModalIsOpen,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const { windowWidth } = UseWindowDimensions();
  const [pwdArray, setPwdArray] = useState<string[]>();
  const [wiggleEffect, setWiggleEffect] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [captchaPassword, setCaptchaPassword] = useState<string>('');
  const [isCaptchaError, setIsCaptchaError] = useState<boolean>(false);
  const [errorCaptcha, setErrorCaptcha] = useState<string>('');

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
    },
  });

  useEffect(() => {
    setValue('employeeId', overtimeAccomplishmentEmployeeId);
    setValue('overtimeApplicationId', overtimeAccomplishmentApplicationId);
  }, [watch('status')]);

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

  const [encodedHours, setEncodedHours] = useState<number>(0);
  const [finalEncodedHours, setFinalEncodedHours] = useState<number>(0);
  const [dataToSubmit, setDataToSubmit] = useState<OvertimeAccomplishmentApprovalPatch>();

  const onSubmit: SubmitHandler<OvertimeAccomplishmentApprovalPatch> = async (
    data: OvertimeAccomplishmentApprovalPatch
  ) => {
    setDataToSubmit(data);
    setCaptchaModalIsOpen(true);
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
                <div className="w-full flex flex-col gap-3 md:gap-2 px-4 rounded">
                  <AlertNotification
                    logo={loadingAccomplishmentResponse ? <LoadingSpinner size="xs" /> : null}
                    alertType={
                      accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING &&
                      !loadingAccomplishmentResponse
                        ? 'warning'
                        : accomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED &&
                          !loadingAccomplishmentResponse
                        ? 'info'
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
                        <label className="text-md font-medium">{'--'}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">IVMS Time In & Out:</label>

                      <div className="w-auto ml-5">
                        <div className="w-full flex flex-row gap-2 items-center justify-between">
                          <label className="w-full">
                            <LabelInput
                              id={'ivmsTimeIn'}
                              type="text"
                              label={''}
                              className="w-full font-medium"
                              textSize="sm"
                              disabled
                              value={UseTwelveHourFormat(accomplishmentDetails.ivmsTimeIn)}
                            />
                          </label>
                          <label className="w-auto text-sm">-</label>
                          <label className="w-full ">
                            <LabelInput
                              id={'ivmsTimeOut'}
                              type="text"
                              label={''}
                              className="w-full font-medium"
                              textSize="sm"
                              disabled
                              value={UseTwelveHourFormat(accomplishmentDetails.ivmsTimeOut)}
                            />
                          </label>
                          <label className="w-full">
                            <LabelInput
                              id={'estimate'}
                              type="text"
                              label={''}
                              className="w-full font-medium"
                              textSize="sm"
                              disabled
                              value={`${accomplishmentDetails.computedIvmsHours ?? 0} Hour(s)`}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Encoded Time In & Out:</label>

                      <div className="w-auto ml-5">
                        <div className="w-full flex flex-row gap-2 items-center justify-between">
                          <label className="w-full text-md ">
                            <LabelInput
                              id={'encodeTimeIn'}
                              type="text"
                              label={''}
                              className="w-full font-medium"
                              textSize="sm"
                              disabled
                              value={UseTwelveHourFormat(accomplishmentDetails.encodedTimeIn)}
                            />
                          </label>
                          <label className="w-auto text-sm">-</label>
                          <label className="w-full text-md ">
                            <LabelInput
                              id={'encodeTimeOut'}
                              type="text"
                              label={''}
                              className="w-full font-medium"
                              textSize="sm"
                              disabled
                              value={UseTwelveHourFormat(accomplishmentDetails.encodedTimeOut)}
                            />
                          </label>
                          <label className="w-full text-md ">
                            <LabelInput
                              id={'estimate'}
                              type="text"
                              label={''}
                              className="w-full font-medium"
                              textSize="sm"
                              disabled
                              value={`${accomplishmentDetails?.computedEncodedHours} Hours(s)`}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Accomplishment:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">
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
                  {/* <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Name:</label>

                      <div className="md:w-1/2">
                        <label className="text-slate-500 w-full text-md ">{overtimeAccomplishmentEmployeeName}</label>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Overtime Date:</label>

                      <div className="md:w-1/2">
                        <label className="text-slate-500 w-full text-md ">
                          {DateFormatter(overtimeDetails.plannedDate, 'MM-DD-YYYY')}
                        </label>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Estimated Hours:</label>

                      <div className="md:w-1/2">
                        <label className="text-slate-500 w-full text-md ">{overtimeDetails.estimatedHours}</label>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">IVMS In & Out:</label>

                      <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'ivmsTimeIn'}
                            type="text"
                            label={''}
                            className="w-full  text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            value={UseTwelveHourFormat(accomplishmentDetails.ivmsTimeIn)}
                          />
                        </label>
                        <label className="text-slate-500 w-auto text-lg">-</label>
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'ivmsTimeOut'}
                            type="text"
                            label={''}
                            className="w-full text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            value={UseTwelveHourFormat(accomplishmentDetails.ivmsTimeOut)}
                          />
                        </label>
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'estimate'}
                            type="text"
                            label={''}
                            className="w-full text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            value={`${accomplishmentDetails.computedIvmsHours ?? 0} Hour(s)`}
                          />
                        </label>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                        Encoded Time In & Out:
                      </label>

                      <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'encodeTimeIn'}
                            type="text"
                            label={''}
                            className="w-full  text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            value={UseTwelveHourFormat(accomplishmentDetails.encodedTimeIn)}
                          />
                        </label>
                        <label className="text-slate-500 w-auto text-lg">-</label>
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'encodeTimeOut'}
                            type="text"
                            label={''}
                            className="w-full text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            value={UseTwelveHourFormat(accomplishmentDetails.encodedTimeOut)}
                          />
                        </label>
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'estimate'}
                            type="text"
                            label={''}
                            className="w-full text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            value={`${accomplishmentDetails?.computedEncodedHours} Hours(s)`}
                          />
                        </label>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Accomplishment:</label>
                    </div>
                    <textarea
                      disabled
                      rows={3}
                      className="resize-none w-full p-2 mt-1 rounded-lg text-slate-500 text-md border-slate-300"
                      value={accomplishmentDetails.accomplishments ?? 'Not yet filled out'}
                    ></textarea>
                  </div> */}

                  {/* {accomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                    <div className="flex flex-col justify-between items-center w-full">
                      <div className="flex flex-row justify-between items-center w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">Remarks:</label>
                      </div>
                      <textarea
                        disabled
                        rows={3}
                        className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                        value={accomplishmentDetails.remarks ?? 'Not yet filled out'}
                      ></textarea>
                    </div>
                  ) : null} */}

                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
                    <form id="OvertimeAccomplishmentAction" onSubmit={handleSubmit(onSubmit)}>
                      <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-end items-start md:items-center pb-3">
                        <span className="text-slate-500 text-md">Approved Hours:</span>

                        <input
                          type="number"
                          className="border-slate-300 text-slate-500 h-12 text-md w-full md:w-44 rounded-lg"
                          placeholder="Enter number of hours"
                          required
                          defaultValue={0}
                          max="24"
                          min={watch('status') === OvertimeAccomplishmentStatus.DISAPPROVED ? '0' : '1'}
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
          <CaptchaModal
            modalState={captchaModalIsOpen}
            setModalState={setCaptchaModalIsOpen}
            title={'OVERTIME ACCOMPLISHMENT CAPTCHA'}
          >
            {/* contents */}
            <ApprovalCaptcha
              employeeId={employeeDetails.user._id}
              dataToSubmitOvertimeAccomplishment={dataToSubmit}
              tokenId={overtimeDetails.id}
              captchaName={'Accomplishment Captcha'}
            />
          </CaptchaModal>
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
