/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
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
  const [followEstimatedHrs, setFollowEstimatedHrs] = useState<boolean>(false);
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
      followEstimatedHrs: false,
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

  useEffect(() => {
    setValue('followEstimatedHrs', followEstimatedHrs);
  }, [followEstimatedHrs]);

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

  useEffect(() => {
    setEncodedHours(
      GetDateDifference(
        `2023-01-01 ${accomplishmentDetails.encodedTimeIn}:00`,
        `2023-01-01 ${accomplishmentDetails.encodedTimeOut}:00`
      ).hours
    );
  }, [accomplishmentDetails]);

  //compute encoded overtime duration based on encoded time IN and OUT
  useEffect(() => {
    if (encodedHours % 5 == 0 || encodedHours >= 5) {
      if (encodedHours % 5 == 0) {
        setFinalEncodedHours(encodedHours - Math.floor(encodedHours / 5));
        // console.log(Math.floor(encodedHours / 5));
      } else if (encodedHours / 5 > 0) {
        setFinalEncodedHours(encodedHours - Math.floor(encodedHours / 5));
        // console.log(Math.floor(encodedHours / 5), 'else');
      } else {
        setFinalEncodedHours(encodedHours);
        // console.log(encodedHours, 'else 2');
      }
    } else {
      setFinalEncodedHours(encodedHours);
    }
  }, [encodedHours]);

  const onSubmit: SubmitHandler<OvertimeAccomplishmentApprovalPatch> = async (
    data: OvertimeAccomplishmentApprovalPatch
  ) => {
    if (password != captchaPassword || password == '' || captchaPassword == '') {
      setIsCaptchaError(true);
      setWiggleEffect(true);
      setErrorCaptcha('Incorrect Captcha!');
    } else {
      patchOvertimeAccomplishment();
      const { error, result } = await patchPortal('/v1/overtime/accomplishments/approval', data);
      if (error) {
        patchOvertimeAccomplishmentFail(result);
      } else {
        patchOvertimeAccomplishmentSuccess(result);
        closeModalAction(); // close confirmation of decline modal
        setTimeout(() => {
          setOvertimeAccomplishmentModalIsOpen(false); // close accomplishment modal
        }, 200);
      }
    }
  };

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
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
                <div className="w-full flex flex-col gap-2 p-4 rounded">
                  {/* {loadingAccomplishmentResponse ? (
                    <AlertNotification alertType={'info'} notifMessage={'Processing'} dismissible={false} />
                  ) : null} */}
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
                        ? 'For Supervisor Approval'
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

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Name:</label>

                      <div className="md:w-1/2">
                        <label className="text-slate-500 w-full text-md ">{overtimeAccomplishmentEmployeeName}</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Estimated Hours:</label>

                      <div className="md:w-1/2">
                        <label className="text-slate-500 w-full text-md ">{overtimeDetails.estimatedHours}</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
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
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
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
                            value={`${!finalEncodedHours || isNaN(finalEncodedHours) ? 0 : finalEncodedHours} Hours(s)`}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Accomplishment:</label>
                    </div>
                    <textarea
                      disabled
                      rows={3}
                      className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                      value={accomplishmentDetails.accomplishments ?? 'None'}
                    ></textarea>
                  </div>
                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
                    <form id="OvertimeAccomplishmentAction" onSubmit={handleSubmit(onSubmit)}>
                      <div className="w-full flex gap-2 justify-start items-center pt-4">
                        <span className="text-slate-500 text-md font-medium">Follow Estimated Hours:</span>
                        <Checkbox
                          checkboxId="followEstimatedHrs"
                          label=""
                          // checked={watch('followEstimatedHrs')}
                          onChange={() => setFollowEstimatedHrs(!followEstimatedHrs)}
                          // {...register('followEstimatedHrs')}
                        />
                      </div>
                      <div className="w-full flex gap-2 justify-start items-center pt-4">
                        <span className="text-slate-500 text-md font-medium">Action:</span>

                        <select
                          id="action"
                          className="text-slate-500 h-12 w-42 rounded text-md border-slate-300"
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
                          className={'resize-none mt-3 w-full p-2 rounded text-slate-500 text-md border-slate-300'}
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
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 w-full">
            {accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
              <>
                <div className="flex flex-col items-end justify-start gap-2 w-full md:w-auto md:flex-row">
                  <div className="flex flex-row flex-wrap justify-end gap-2 w-full">
                    <Button
                      variant="danger"
                      onClick={getCaptcha}
                      className="w-36 md:w-auto"
                      size={`${windowWidth > 768 ? 'md' : 'sm'}`}
                    >
                      {windowWidth > 768 ? 'Generate Captcha' : 'Generate Captcha'}
                    </Button>
                    {/* captcha */}
                    <div
                      className={`${
                        pwdArray ? '' : 'animate-pulse'
                      } w-36 select-none h-10 px-4 py-1 transition-all duration-150 bg-slate-200 text-xl flex lex-rowf justify-center items-center gap-1`}
                    >
                      <div className="w-4 font-medium text-indigo-800 scale-105 -rotate-12">
                        {pwdArray && pwdArray[0]}
                      </div>
                      <div className="w-4 font-bold scale-90 rotate-6 text-sky-800">{pwdArray && pwdArray[1]}</div>
                      <div className="w-4 font-light text-red-800 scale-105 rotate-45">{pwdArray && pwdArray[2]}</div>
                      <div className="w-4 pr-2 font-semibold text-green-800 scale-100 rotate-12">
                        {pwdArray && pwdArray[3]}
                      </div>
                      <div className="w-4 font-bold text-blue-600 scale-90 -rotate-45">{pwdArray && pwdArray[4]}</div>
                      <div className="w-4 font-medium scale-105 -rotate-6 text-stone-800">
                        {pwdArray && pwdArray[5]}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={password}
                      placeholder="Enter Captcha"
                      className={`${wiggleEffect && 'animate-shake border-red-600'} ${
                        isCaptchaError ? 'border-red-600' : 'border-stone-200'
                      }  w-36 border text-md`}
                      onAnimationEnd={() => setWiggleEffect(false)}
                      onChange={(e) => setPassword(e.target.value as unknown as string)}
                    />

                    <Button
                      className="w-36"
                      variant={'primary'}
                      size={'md'}
                      loading={false}
                      form={`OvertimeAccomplishmentAction`}
                      type="submit"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
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