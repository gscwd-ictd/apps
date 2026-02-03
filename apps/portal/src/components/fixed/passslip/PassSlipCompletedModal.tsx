/* eslint-disable react/jsx-no-undef */
/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { NatureOfBusiness, PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { DisputeApplicationModal } from './DisputeModal';
import dayjs from 'dayjs';
import { GetDateDifference } from 'libs/utils/src/lib/functions/GetDateDifference';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { UserRole } from 'libs/utils/src/lib/enums/user-roles.enum';
import useSWR from 'swr';
import { format } from 'date-fns';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { useEffect } from 'react';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { LeaveName } from 'libs/utils/src/lib/enums/leave.enum';
import { isEmpty } from 'lodash';

type PassSlipCompletedModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const PassSlipCompletedModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipCompletedModalProps) => {
  const { passSlip, disputePassSlipModalIsOpen, setDisputePassSlipModalIsOpen } = usePassSlipStore((state) => ({
    passSlip: state.passSlip,
    disputePassSlipModalIsOpen: state.disputePassSlipModalIsOpen,
    setDisputePassSlipModalIsOpen: state.setDisputePassSlipModalIsOpen,
  }));

  const { employeeDetails } = useEmployeeStore((state) => ({
    employeeDetails: state.employeeDetails,
  }));

  const { windowWidth } = UseWindowDimensions();

  const { serverDate, setServerDate, getUnavailableDates, getUnavailableSuccess, getUnavailableFail } = useLeaveStore(
    (state) => ({
      serverDate: state.serverDate,
      setServerDate: state.setServerDate,
      getUnavailableDates: state.getUnavailableDates,
      getUnavailableSuccess: state.getUnavailableSuccess,
      getUnavailableFail: state.getUnavailableFail,
    })
  );

  // for cancel pass slip button
  const modalAction = async (e) => {
    e.preventDefault();
    setDisputePassSlipModalIsOpen(true);
  };

  // cancel action for Confirmation Application Modal
  const closeConfirmationModal = async () => {
    setDisputePassSlipModalIsOpen(false);
  };

  //for getting current server time
  const unavailableDatesUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/unavailable-dates/${employeeDetails.employmentDetails.userId}`;
  const {
    data: swrUnavailableDates,
    isLoading: swrUnavailableIsLoading,
    error: swrUnavailableError,
  } = useSWR(employeeDetails.employmentDetails.userId ? unavailableDatesUrl : null, fetchWithToken, {
    shouldRetryOnError: true,
    revalidateOnFocus: true,
    refreshInterval: 3000,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrUnavailableIsLoading) {
      getUnavailableDates(swrUnavailableIsLoading);
    }
  }, [swrUnavailableIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrUnavailableDates)) {
      getUnavailableSuccess(swrUnavailableIsLoading, swrUnavailableDates);
      setServerDate(swrUnavailableDates?.dateTimeNow); //server date saved on store
    }

    if (!isEmpty(swrUnavailableError)) {
      getUnavailableFail(swrUnavailableIsLoading, swrUnavailableError.message);
    }
  }, [swrUnavailableDates, swrUnavailableError]);

  return (
    <>
      {!isEmpty(swrUnavailableError) ? (
        <ToastNotification toastType="error" notifMessage="Failed to get Server Date!" />
      ) : null}

      <Modal size={windowWidth > 1024 ? 'sm' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Completed Pass Slip</span>
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
          <div className="w-full h-full flex flex-col gap-2 ">
            <div className="w-full flex flex-col gap-2 px-4 rounded">
              <div className="w-full flex flex-col gap-0">
                {passSlip.status === PassSlipStatus.APPROVED ? (
                  //results are usually in days, so we add 1 to include the current day
                  <AlertNotification
                    alertType="success"
                    notifMessage={`Approved ${
                      GetDateDifference(
                        `${passSlip.dateOfApplication}`,
                        `${dayjs(serverDate).format('YYYY-MM-DD HH:mm:ss')} `
                      ).days + 1
                    } days ago`}
                    dismissible={false}
                  />
                ) : passSlip.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE ||
                  passSlip.status === PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE ||
                  passSlip.status === PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE ? (
                  <AlertNotification
                    alertType="warning"
                    notifMessage={` ${
                      passSlip.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE
                        ? 'Approved and Awaiting Medical Certificate'
                        : passSlip.status === PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE
                        ? 'Approved without Medical Certificate'
                        : passSlip.status === PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE
                        ? 'Approved with Medical Certificate'
                        : 'Approved'
                    }
                      ${
                        GetDateDifference(
                          `${passSlip.dateOfApplication}`,
                          `${dayjs(serverDate).format('YYYY-MM-DD HH:mm:ss')} `
                        ).days + 1
                      } days ago`}
                    dismissible={false}
                  />
                ) : (
                  <AlertNotification
                    alertType={
                      passSlip.status === PassSlipStatus.UNUSED || passSlip.status === PassSlipStatus.USED
                        ? 'info'
                        : passSlip.status === PassSlipStatus.DISAPPROVED ||
                          passSlip.status === PassSlipStatus.DISAPPROVED_BY_HRMO ||
                          passSlip.status === PassSlipStatus.CANCELLED
                        ? 'error'
                        : passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL ||
                          passSlip.status === PassSlipStatus.FOR_HRMO_APPROVAL ||
                          passSlip.status === PassSlipStatus.FOR_DISPUTE
                        ? 'warning'
                        : 'info'
                    }
                    notifMessage={`${
                      passSlip.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL
                        ? `For Supervisor Review`
                        : passSlip.status === PassSlipStatus.FOR_DISPUTE
                        ? 'For Dispute Review'
                        : passSlip.status === PassSlipStatus.FOR_HRMO_APPROVAL
                        ? 'For HRMO Review'
                        : passSlip.status === PassSlipStatus.DISAPPROVED
                        ? 'Disapproved'
                        : passSlip.status === PassSlipStatus.DISAPPROVED_BY_HRMO
                        ? 'Disapproved by HRMO'
                        : passSlip.status === PassSlipStatus.UNUSED
                        ? 'Unused'
                        : passSlip.status === PassSlipStatus.USED
                        ? 'Used'
                        : passSlip.status === PassSlipStatus.CANCELLED
                        ? 'Cancelled'
                        : passSlip.status
                    }`}
                    dismissible={false}
                  />
                )}

                {passSlip.disputeRemarks && passSlip.isDisputeApproved != null ? (
                  <AlertNotification
                    alertType={`${passSlip.isDisputeApproved ? 'success' : 'error'}`}
                    notifMessage={`${
                      passSlip.isDisputeApproved ? 'Dispute filed is Approved' : 'Dispute filed is Disapproved'
                    }`}
                    dismissible={false}
                  />
                ) : null}

                {employeeDetails.employmentDetails.userRole != UserRole.JOB_ORDER &&
                employeeDetails.employmentDetails.userRole != UserRole.COS &&
                employeeDetails.employmentDetails.userRole != UserRole.COS_JO &&
                passSlip.isDeductibleToPay ? (
                  // <AlertNotification alertType={`warning`} notifMessage={`Deductible to Pay`} dismissible={false} />
                  <AlertNotification
                    alertType="warning"
                    notifMessage="You have incurred a negative Vacation Leave Balance. Please minimize the use of Half-Day, Undertime, and Personal Business Pass Slips to improve your Vacation Leave Credits."
                    dismissible={false}
                  />
                ) : null}

                {employeeDetails.employmentDetails.userRole != UserRole.JOB_ORDER &&
                employeeDetails.employmentDetails.userRole != UserRole.COS &&
                employeeDetails.employmentDetails.userRole != UserRole.COS_JO &&
                passSlip.isMedical &&
                passSlip.natureOfBusiness === NatureOfBusiness.PERSONAL_BUSINESS ? (
                  <AlertNotification
                    alertType="info"
                    notifMessage="For Personal Business with Medical Purposes, a medical certificate is required for it to be deducted to your Sick Leave balance. If no valid medical certificate is presented to HRD, it will be deducted to your Vacation Leave balance instead."
                    dismissible={false}
                  />
                ) : null}
              </div>

              {/* dispute pass slip time in */}
              <DisputeApplicationModal
                modalState={disputePassSlipModalIsOpen}
                setModalState={setDisputePassSlipModalIsOpen}
                closeModalAction={closeConfirmationModal}
                action={PassSlipStatus.FOR_DISPUTE}
                tokenId={passSlip.id}
                title={'Dispute Pass Slip'}
                currentStatus={passSlip.status}
              />

              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Nature of Business:</label>

                  <div className="w-auto ml-5">
                    <label className="text-md font-medium">{passSlip.natureOfBusiness}</label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Date of Application:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{DateTimeFormatter(passSlip.dateOfApplication)}</label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">
                    {passSlip.natureOfBusiness == NatureOfBusiness.PERSONAL_BUSINESS
                      ? 'For Medical Business:'
                      : 'Mode of Transportation:'}
                  </label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {passSlip.natureOfBusiness == NatureOfBusiness.PERSONAL_BUSINESS
                        ? passSlip.isMedical
                          ? 'Yes'
                          : 'No'
                        : passSlip.obTransportation ?? 'N/A'}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Estimated Hours:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{passSlip.estimateHours}</label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Time Out:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {passSlip.timeOut ? UseTwelveHourFormat(passSlip.timeOut) : 'None'}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Time In:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {passSlip.timeIn ? UseTwelveHourFormat(passSlip.timeIn) : 'None'}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Purpose/Desination:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{passSlip.purposeDestination}</label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Supervisor:</label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">{passSlip.supervisorName}</label>
                  </div>
                </div>

                {passSlip.natureOfBusiness == NatureOfBusiness.OFFICIAL_BUSINESS ? (
                  <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                    <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                      {passSlip?.status === PassSlipStatus.DISAPPROVED_BY_HRMO
                        ? `Date Disapproved by HRMO:`
                        : 'Date Approved by HRMO:'}
                    </label>

                    <div className="w-auto ml-5">
                      <label className=" text-md font-medium">{DateTimeFormatter(passSlip?.hrmoApprovalDate)}</label>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                    {passSlip?.status === PassSlipStatus.DISAPPROVED
                      ? `Date Disapproved by Supervisor:`
                      : 'Date Approved by Supervisor:'}
                  </label>

                  <div className="w-auto ml-5">
                    <label className=" text-md font-medium">
                      {DateTimeFormatter(passSlip?.supervisorApprovalDate)}
                    </label>
                  </div>
                </div>

                {passSlip.status === PassSlipStatus.FOR_DISPUTE || passSlip.disputeRemarks ? (
                  <div className={`flex flex-col`}>
                    <div className="flex flex-col sm:flex-col justify-start items-start w-full px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">
                        Employee Dispute Remarks:
                      </label>

                      <div className="w-auto ml-5 flex flex-col">
                        <label className="text-md font-medium">
                          {`Disputed Time Out is ${
                            passSlip.encodedTimeOut ? UseTwelveHourFormat(passSlip.encodedTimeOut) : 'None'
                          }.`}
                        </label>
                        <label className="text-md font-medium">
                          {`Disputed Time In is ${
                            passSlip.encodedTimeIn ? UseTwelveHourFormat(passSlip.encodedTimeIn) : 'None'
                          }.`}
                        </label>
                        <label className="text-md font-medium">{` ${passSlip.disputeRemarks}`}</label>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="w-full justify-end flex gap-2">
              {(serverDate &&
                passSlip.dateOfApplication &&
                (passSlip.status === PassSlipStatus.APPROVED ||
                  passSlip.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE ||
                  passSlip.status === PassSlipStatus.APPROVED_WITHOUT_MEDICAL_CERTIFICATE ||
                  passSlip.status === PassSlipStatus.APPROVED_WITH_MEDICAL_CERTIFICATE) &&
                passSlip.natureOfBusiness != NatureOfBusiness.HALF_DAY &&
                passSlip.natureOfBusiness != NatureOfBusiness.UNDERTIME &&
                !passSlip.disputeRemarks &&
                passSlip.timeIn &&
                GetDateDifference(
                  `${dayjs(passSlip.dateOfApplication).format('YYYY-MM-DD HH:mm:ss')}`,
                  `${dayjs(serverDate).format('YYYY-MM-DD HH:mm:ss')} `
                ).days +
                  1 <=
                  3) ||
              (passSlip.status === PassSlipStatus.UNUSED &&
                passSlip.natureOfBusiness != NatureOfBusiness.HALF_DAY &&
                passSlip.natureOfBusiness != NatureOfBusiness.UNDERTIME) ? (
                <Button variant={'warning'} size={'md'} loading={false} onClick={(e) => modalAction(e)} type="submit">
                  {passSlip.status === PassSlipStatus.UNUSED ? 'UPDATE' : 'DISPUTE'}
                </Button>
              ) : null}

              <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PassSlipCompletedModal;
