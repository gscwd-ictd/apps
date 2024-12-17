/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import OvertimeAccomplishmentReportModal from './OvertimeAccomplishmentReportModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeSupervisorAccomplishmentModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeDetails,
    overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName,
    accomplishmentDetails,
    getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail,
    setPdfAccomplishmentReportModalIsOpen,
    pdfAccomplishmentReportModalIsOpen,
    accomplishmentOvertimeModalIsOpen,
  } = useOvertimeStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName: state.overtimeAccomplishmentEmployeeName,
    accomplishmentDetails: state.accomplishmentDetails,
    getAccomplishmentDetails: state.getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess: state.getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail: state.getAccomplishmentDetailsFail,
    setPdfAccomplishmentReportModalIsOpen: state.setPdfAccomplishmentReportModalIsOpen,
    pdfAccomplishmentReportModalIsOpen: state.pdfAccomplishmentReportModalIsOpen,
    accomplishmentOvertimeModalIsOpen: state.accomplishmentOvertimeModalIsOpen,
  }));

  const { windowWidth } = UseWindowDimensions();

  const overtimeAccomplishmentUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${overtimeAccomplishmentEmployeeId}/${overtimeAccomplishmentApplicationId}/details`;

  const {
    data: swrOvertimeAccomplishment,
    isLoading: swrOvertimeAccomplishmentIsLoading,
    error: swrOvertimeAccomplishmentError,
    mutate: mutateOvertimeAccomplishments,
  } = useSWR(accomplishmentOvertimeModalIsOpen ? overtimeAccomplishmentUrl : null, fetchWithToken, {
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

  const closeOvertimeAccomplishmentModal = async () => {
    setPdfAccomplishmentReportModalIsOpen(false);
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
          {isEmpty(swrOvertimeAccomplishment) ? (
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
                <div className="w-full flex flex-col gap-2 px-4 rounded">
                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
                    <AlertNotification alertType="warning" notifMessage={'For Supervisor Review'} dismissible={false} />
                  ) : null}
                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED ? (
                    <AlertNotification alertType="success" notifMessage={'Approved'} dismissible={false} />
                  ) : null}
                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                    <AlertNotification alertType="error" notifMessage={'Disapproved'} dismissible={false} />
                  ) : null}

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
                        <label className="text-md font-medium">{accomplishmentDetails.actualHrs ?? '---'}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
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
                </div>
              </div>
            </div>
          )}
          <OvertimeAccomplishmentReportModal
            modalState={pdfAccomplishmentReportModalIsOpen}
            setModalState={setPdfAccomplishmentReportModalIsOpen}
            closeModalAction={closeOvertimeAccomplishmentModal}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            {accomplishmentDetails.status == OvertimeAccomplishmentStatus.APPROVED ? (
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={(e) => setPdfAccomplishmentReportModalIsOpen(true)}
                type="submit"
              >
                Accomplishment
              </Button>
            ) : null}

            <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeSupervisorAccomplishmentModal;
