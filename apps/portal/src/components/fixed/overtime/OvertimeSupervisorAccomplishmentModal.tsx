/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import { LabelInput } from 'libs/oneui/src/components/Inputs/LabelInput';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';

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
  } = useOvertimeStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    overtimeAccomplishmentEmployeeName: state.overtimeAccomplishmentEmployeeName,
    accomplishmentDetails: state.accomplishmentDetails,
    getAccomplishmentDetails: state.getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess: state.getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail: state.getAccomplishmentDetailsFail,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { windowWidth } = UseWindowDimensions();

  const overtimeAccomplishmentUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${overtimeAccomplishmentEmployeeId}/${overtimeAccomplishmentApplicationId}/details`;

  const {
    data: swrOvertimeAccomplishment,
    isLoading: swrOvertimeAccomplishmentIsLoading,
    error: swrOvertimeAccomplishmentError,
    mutate: mutateOvertimeAccomplishments,
  } = useSWR(overtimeAccomplishmentUrl, fetchWithToken, {
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
          {!overtimeDetails ? (
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
                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
                    <AlertNotification
                      alertType="warning"
                      notifMessage={'For Supervisor Approval'}
                      dismissible={false}
                    />
                  ) : null}
                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.APPROVED ? (
                    <AlertNotification alertType="info" notifMessage={'Approved'} dismissible={false} />
                  ) : null}
                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                    <AlertNotification alertType="error" notifMessage={'Disapproved'} dismissible={false} />
                  ) : null}
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Name:</label>

                      <div className="md:w-1/2">
                        <label className="text-slate-500 w-full text-md ">{overtimeAccomplishmentEmployeeName}</label>
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
                            className="w-full  text-slate-400 font-medium"
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

                  {!accomplishmentDetails.ivmsTimeIn || !accomplishmentDetails.ivmsTimeOut ? (
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                        <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                          Encode Time In & Out:
                        </label>

                        <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                          <label className="text-slate-500 w-full text-md ">
                            <LabelInput
                              id={'ivmsTimeOut'}
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
                              id={'ivmsTimeOut'}
                              type="text"
                              label={''}
                              className="w-full  text-slate-400 font-medium"
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
                              value={`${accomplishmentDetails.computedIvmsHours ?? 0} Hour(s)`}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Accomplishment:</label>
                    </div>
                    <textarea
                      disabled
                      rows={3}
                      className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                      placeholder="N/A"
                      value={accomplishmentDetails.accomplishments ?? 'None'}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeSupervisorAccomplishmentModal;
