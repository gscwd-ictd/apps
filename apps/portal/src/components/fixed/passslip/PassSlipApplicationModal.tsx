/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PassSlipApplicationForm } from '../../../../../../libs/utils/src/lib/types/pass-slip.type';
import { postPortal } from '../../../../src/utils/helpers/portal-axios-helper';
import { HiX } from 'react-icons/hi';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { format } from 'date-fns';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { NatureOfBusiness } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { useTimeLogStore } from 'apps/portal/src/store/timelogs.store';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { useLeaveLedgerStore } from 'apps/portal/src/store/leave-ledger.store';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import { UserRole } from 'libs/utils/src/lib/enums/user-roles.enum';

type PassSlipApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type Item = {
  label: string;
  value: any;
};

const natureOfBusiness: Array<SelectOption> = [
  { label: NatureOfBusiness.PERSONAL_BUSINESS, value: NatureOfBusiness.PERSONAL_BUSINESS },
  { label: NatureOfBusiness.HALF_DAY, value: NatureOfBusiness.HALF_DAY },
  { label: NatureOfBusiness.UNDERTIME, value: NatureOfBusiness.UNDERTIME },
  { label: NatureOfBusiness.OFFICIAL_BUSINESS, value: NatureOfBusiness.OFFICIAL_BUSINESS },
];

const obTransportation: Array<SelectOption> = [
  { label: 'Office Vehicle', value: 'Office Vehicle' },
  { label: 'Private/Personal Vehicle', value: 'Private/Personal Vehicle' },
  { label: 'Public Vehicle', value: 'Public Vehicle' },
];

export const PassSlipApplicationModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipApplicationModalProps) => {
  //get current date for dateOfApplication
  const today = new Date();
  const dateToday = format(today, 'yyyy-MM-dd');
  const yearNow = format(new Date(), 'yyyy');
  //zustand initialization to access employee store
  const { employeeDetails } = useEmployeeStore((state) => ({
    employeeDetails: state.employeeDetails,
  }));

  //FACE SCAN STORE
  // const { dtr, schedule } = useTimeLogStore((state) => ({
  //   dtr: state.dtr,
  //   schedule: state.schedule,
  // }));

  //zustand initialization to access pass slip store
  const {
    loadingResponse,
    passSlipsForApproval,
    allowedToApplyForNew,
    postPassSlipList,
    postPassSlipListSuccess,
    postPassSlipListFail,
    applyPassSlipModalIsOpen,
    getSupervisors,
    getSupervisorsSuccess,
    getSupervisorsFail,
    supervisors,

    errorPassSlipsList,
    errorSupervisorList,
  } = usePassSlipStore((state) => ({
    loadingResponse: state.loading.loadingResponse,
    passSlipsForApproval: state.passSlips.forApproval,
    allowedToApplyForNew: state.passSlips.allowedToApplyForNew,
    postPassSlipList: state.postPassSlipList,
    postPassSlipListSuccess: state.postPassSlipListSuccess,
    postPassSlipListFail: state.postPassSlipListFail,
    applyPassSlipModalIsOpen: state.applyPassSlipModalIsOpen,
    getSupervisors: state.getSupervisors,
    getSupervisorsSuccess: state.getSupervisorsSuccess,
    getSupervisorsFail: state.getSupervisorsFail,
    supervisors: state.supervisors,

    errorPassSlipsList: state.error.errorPassSlips,
    errorSupervisorList: state.error.errorSupervisors,
  }));

  const { errorLeaveLedger, getLeaveLedger, getLeaveLedgerSuccess, getLeaveLedgerFail } = useLeaveLedgerStore(
    (state) => ({
      errorLeaveLedger: state.error.errorLeaveLedger,
      getLeaveLedger: state.getLeaveLedger,
      getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
      getLeaveLedgerFail: state.getLeaveLedgerFail,
    })
  );

  const [forcedLeaveBalance, setForcedLeaveBalance] = useState<number>(0);
  const [vacationLeaveBalance, setVacationLeaveBalance] = useState<number>(0);
  const [sickLeaveBalance, setSickLeaveBalance] = useState<number>(0);
  const [specialPrivilegeLeaveBalance, setSpecialPrivilegeLeaveBalance] = useState<number>(0);
  const [isApplying, setIsApplying] = useState<boolean>(false); //disable apply button during submission

  // get the latest balance by last index value
  const getLatestBalance = (leaveLedger: Array<LeaveLedgerEntry>) => {
    const lastIndexValue = leaveLedger[leaveLedger.length - 1];
    setForcedLeaveBalance(lastIndexValue.forcedLeaveBalance);
    setVacationLeaveBalance(lastIndexValue.vacationLeaveBalance ?? 0);
    setSickLeaveBalance(lastIndexValue.sickLeaveBalance ?? 0);
    setSpecialPrivilegeLeaveBalance(lastIndexValue.specialPrivilegeLeaveBalance ?? 0);
  };

  //fetch employee leave ledger to check leave balances
  const leaveLedgerUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/ledger/${employeeDetails.user._id}/${employeeDetails.profile.companyId}/${yearNow}`;

  const {
    data: swrLeaveLedger,
    isLoading: swrLeaveLedgerLoading,
    error: swrLeaveLedgerError,
  } = useSWR(employeeDetails.user._id && employeeDetails.profile.companyId ? leaveLedgerUrl : null, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: true,
    errorRetryInterval: 3000,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrLeaveLedgerLoading) {
      getLeaveLedger(swrLeaveLedgerLoading);
    }
  }, [swrLeaveLedgerLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrLeaveLedger)) {
      getLeaveLedgerSuccess(swrLeaveLedgerLoading, swrLeaveLedger);
      getLatestBalance(swrLeaveLedger);
    }

    if (!isEmpty(swrLeaveLedgerError)) {
      getLeaveLedgerFail(swrLeaveLedgerLoading, swrLeaveLedgerError.message);
    }
  }, [swrLeaveLedger, swrLeaveLedgerError]);

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<PassSlipApplicationForm>({
    mode: 'onChange',
    defaultValues: {
      employeeId: '',
      natureOfBusiness: null,
      estimateHours: 0,
      purposeDestination: '',
      isCancelled: false,
      obTransportation: null,
      isMedical: null,
      supervisorId: null,
    },
  });

  useEffect(() => {
    setValue('isMedical', null);
    if (
      watch('natureOfBusiness') === NatureOfBusiness.HALF_DAY ||
      watch('natureOfBusiness') === NatureOfBusiness.UNDERTIME
    ) {
      setValue('estimateHours', 0);
    }

    if (watch('natureOfBusiness') !== NatureOfBusiness.OFFICIAL_BUSINESS) {
      setValue('obTransportation', null);
    }
    setValue('employeeId', employeeDetails.employmentDetails.userId);
  }, [watch('natureOfBusiness')]);

  //fetch employee leave ledger
  const supervisorDropDownUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/pass-slips/dropdown`;

  const {
    data: swrSupervisor,
    isLoading: swrSupervisorLoading,
    error: swrSupervisorError,
  } = useSWR(applyPassSlipModalIsOpen ? supervisorDropDownUrl : null, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: true,
    errorRetryInterval: 3000,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrSupervisorLoading) {
      getSupervisors(swrSupervisorLoading);
    }
  }, [swrSupervisorLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrSupervisor)) {
      getSupervisorsSuccess(swrSupervisorLoading, swrSupervisor);
    }

    if (!isEmpty(swrSupervisorError)) {
      getSupervisorsFail(swrSupervisorLoading, swrSupervisorError.message);
    }
  }, [swrSupervisor, swrSupervisorError]);

  const onSubmit: SubmitHandler<PassSlipApplicationForm> = (data: PassSlipApplicationForm) => {
    handlePostResult(data);
    postPassSlipList();
  };

  const handlePostResult = async (data: PassSlipApplicationForm) => {
    setIsApplying(true);
    const { error, result } = await postPortal('/v1/pass-slip', data);
    if (error) {
      postPassSlipListFail(result);
      setIsApplying(false);
    } else {
      postPassSlipListSuccess(result);
      reset();
      closeModalAction();
      setIsApplying(false);
    }
  };

  useEffect(() => {
    reset();
  }, [applyPassSlipModalIsOpen]);

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal
        size={windowWidth > 768 ? 'sm' : windowWidth > 1024 ? 'md' : 'full'}
        open={modalState}
        setOpen={setModalState}
      >
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Pass Slip Authorization</span>
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
          <form id="ApplyPassSlipForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full h-full flex flex-col">
              <div className="w-full flex flex-col px-4 rounded">
                {/* Notifications */}
                {loadingResponse ? (
                  <AlertNotification
                    logo={<LoadingSpinner size="xs" />}
                    alertType="info"
                    notifMessage="Submitting Request"
                    dismissible={true}
                  />
                ) : null}

                <AlertNotification
                  alertType="info"
                  notifMessage={`Current Vacation Leave Credits: ${vacationLeaveBalance}`}
                  dismissible={false}
                />

                {!allowedToApplyForNew || passSlipsForApproval.length >= 1 ? (
                  <AlertNotification
                    alertType="warning"
                    notifMessage="You already have an active Pass Slip request."
                    dismissible={false}
                  />
                ) : null}

                {/* FACE SCAN CHECK */}
                {/* {dtr?.timeIn == null && dtr?.lunchOut == null && dtr?.lunchIn == null ? (
                  <AlertNotification
                    alertType="warning"
                    notifMessage="No Face Scan Time-In Found."
                    dismissible={false}
                  />
                ) : null} */}

                {employeeDetails.employmentDetails.userRole != UserRole.JOB_ORDER &&
                employeeDetails.employmentDetails.userRole != UserRole.COS &&
                employeeDetails.employmentDetails.userRole != UserRole.COS_JO &&
                watch('isMedical') === '1' &&
                watch('natureOfBusiness') === NatureOfBusiness.PERSONAL_BUSINESS ? (
                  <AlertNotification
                    alertType="info"
                    notifMessage="For Personal Business with Medical Purposes, a medical certificate is required for it to be deducted to your Sick Leave balance. If no valid medical certificate is presented to HRD, it will be deducted to your Vacation Leave balance instead or directly to your pay if your Vacation Leave balance is 0 or less."
                    dismissible={false}
                  />
                ) : null}

                {employeeDetails.employmentDetails.userRole != UserRole.JOB_ORDER &&
                employeeDetails.employmentDetails.userRole != UserRole.COS &&
                employeeDetails.employmentDetails.userRole != UserRole.COS_JO &&
                vacationLeaveBalance <= 0 &&
                (watch('natureOfBusiness') === NatureOfBusiness.PERSONAL_BUSINESS ||
                  watch('natureOfBusiness') === NatureOfBusiness.HALF_DAY ||
                  watch('natureOfBusiness') === NatureOfBusiness.UNDERTIME) &&
                (watch('isMedical') === '0' || watch('isMedical') === null) ? (
                  <AlertNotification
                    alertType="error"
                    notifMessage="You have incurred a negative Vacation Leave Balance. Please minimize the use of Half-Day, Undertime, and Personal Business Pass Slips to improve your Vacation Leave Credits."
                    dismissible={false}
                  />
                ) : null}

                {employeeDetails.employmentDetails.userRole != UserRole.JOB_ORDER &&
                employeeDetails.employmentDetails.userRole != UserRole.COS &&
                employeeDetails.employmentDetails.userRole != UserRole.COS_JO &&
                sickLeaveBalance <= 0 &&
                watch('natureOfBusiness') === NatureOfBusiness.PERSONAL_BUSINESS &&
                watch('isMedical') === '1' ? (
                  <AlertNotification
                    alertType="warning"
                    notifMessage="This Pass Slip will be deducted directly to your pay as you currently have 0 or less Sick Leave balance."
                    dismissible={false}
                  />
                ) : null}

                <div className="w-full flex gap-2 justify-start items-center pb-2">
                  <span className="text-slate-500 text-md font-medium">Date:</span>
                  <div className="text-slate-500 text-md">{DateFormatter(dateToday, 'MM-DD-YYYY')}</div>
                </div>

                <div
                  className={`xl:flex-row xl:items-center flex-col items-start flex gap-2 md:gap-2 justify-between pb-2 `}
                >
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap w-1/2">
                    Nature of Business:
                    <span className="text-red-600">*</span>
                  </label>

                  <div className="w-full xl:w-64">
                    <select
                      id="natureOfBusiness"
                      className="text-slate-500 h-12 w-full rounded-md text-md border-slate-300"
                      required
                      {...register('natureOfBusiness')}
                    >
                      <option value="" disabled>
                        Select Nature of Business
                      </option>
                      {natureOfBusiness.map((item: Item, idx: number) => (
                        <option value={item.value} key={idx}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {watch('natureOfBusiness') !== NatureOfBusiness.HALF_DAY &&
                watch('natureOfBusiness') !== NatureOfBusiness.UNDERTIME &&
                watch('natureOfBusiness') ? (
                  <div className="flex flex-col gap-2 pb-2">
                    <div
                      className={`xl:flex-row xl:items-center flex-col items-start flex gap-2 md:gap-2 justify-between`}
                    >
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap w-1/2">
                        Estimated Hours:
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="w-full xl:w-64">
                        <input
                          type="number"
                          name="passSlip_estimatedHours"
                          id="estimateHours"
                          className="border-slate-300 text-slate-500 h-12 text-md w-full rounded-md"
                          placeholder="Enter number of hours "
                          required
                          defaultValue={0}
                          max={8}
                          min={
                            watch('natureOfBusiness') != NatureOfBusiness.HALF_DAY &&
                            watch('natureOfBusiness') != NatureOfBusiness.UNDERTIME
                              ? 1
                              : 0
                          }
                          {...register('estimateHours')}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {watch('natureOfBusiness') === NatureOfBusiness.OFFICIAL_BUSINESS ? (
                  <div
                    className={`xl:flex-row xl:items-center flex-col items-start flex gap-2 md:gap-2 justify-between pb-2`}
                  >
                    <label className="text-slate-500 text-md whitespace-nowrap font-medium w-1/2">
                      Mode of Transportation:
                      <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full xl:w-64">
                      <select
                        id="obTransportation"
                        required
                        className="text-slate-500 h-12 w-full rounded-md text-md border-slate-300"
                        {...register('obTransportation')}
                      >
                        <option value="" disabled>
                          Select Mode of Transportation
                        </option>
                        {obTransportation.map((item: Item, idx: number) => (
                          <option value={item.value} key={idx}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : null}

                {watch('natureOfBusiness') == NatureOfBusiness.PERSONAL_BUSINESS ? (
                  <div
                    className={`xl:flex-row xl:items-center flex-col items-start flex gap-2 md:gap-2 justify-between pb-2`}
                  >
                    <label className="text-slate-500 text-md font-medium whitespace-nowrap w-1/2">
                      For Medical Purpose:
                      <span className="text-red-600">*</span>
                    </label>

                    <div className="w-full xl:w-64">
                      <select
                        id="isMedical"
                        className="text-slate-500 h-12 w-full rounded-md text-md border-slate-300"
                        required
                        {...register('isMedical')}
                      >
                        <option value="" disabled>
                          Select Purpose
                        </option>
                        <option value={'1'}>Yes</option>
                        <option value={'0'}>No</option>
                      </select>
                    </div>
                  </div>
                ) : null}

                {watch('natureOfBusiness') ? (
                  <>
                    <div
                      className={`xl:flex-row xl:items-center flex-col items-start flex gap-2 md:gap-2 justify-between pb-4 `}
                    >
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap w-1/2">
                        Supervisor to Approve:
                        <span className="text-red-600">*</span>
                      </label>

                      <div className="w-full xl:w-64">
                        <select
                          className="text-slate-500 w-full h-14 rounded-md text-md border-slate-300"
                          required
                          defaultValue={''}
                          {...register('supervisorId')}
                        >
                          <option value="" disabled>
                            Select Supervisor:
                          </option>
                          {
                            // typeOfLeave
                            supervisors.length > 0 ? (
                              supervisors.map((item: SelectOption, idx: number) => (
                                <option value={item.value} key={idx}>
                                  {item.label}
                                </option>
                              ))
                            ) : (
                              <option value={null} key={0} disabled>
                                {null}
                              </option>
                            )
                          }
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:gap-2">
                      <label className="text-slate-500 text-md font-medium">
                        Purpose/Destination:
                        <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        minLength={watch('natureOfBusiness') === NatureOfBusiness.OFFICIAL_BUSINESS ? 20 : 10}
                        rows={2}
                        placeholder={`Enter Purpose of Pass Slip`}
                        name="passSlip_purpose"
                        id="purposeDestination"
                        className="resize-none w-full p-2 rounded-md text-slate-500 text-md border-slate-300"
                        required
                        {...register('purposeDestination')}
                      ></textarea>
                      <span className="text-slate-400 text-xs">{`Minimum of ${
                        watch('natureOfBusiness') === NatureOfBusiness.OFFICIAL_BUSINESS ? '20' : '10'
                      } characters required`}</span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                form="ApplyPassSlipForm"
                type="submit"
                disabled={
                  !isEmpty(errorPassSlipsList) || !isEmpty(errorSupervisorList) || !isEmpty(errorLeaveLedger)
                    ? true
                    : !allowedToApplyForNew || passSlipsForApproval.length >= 1
                    ? true
                    : isApplying
                    ? true
                    : false
                }
              >
                Apply Pass Slip
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PassSlipApplicationModal;
