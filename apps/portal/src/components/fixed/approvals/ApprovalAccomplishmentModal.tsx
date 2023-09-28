/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
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
    getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail,
  } = useApprovalStore((state) => ({
    overtimeAccomplishmentModalIsOpen: state.overtimeAccomplishmentModalIsOpen,
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    accomplishmentDetails: state.accomplishmentDetails,
    overtimeAccomplishmentEmployeeName: state.overtimeAccomplishmentEmployeeName,
    overtimeDetails: state.overtimeDetails,
    getAccomplishmentDetails: state.getAccomplishmentDetails,
    getAccomplishmentDetailsSuccess: state.getAccomplishmentDetailsSuccess,
    getAccomplishmentDetailsFail: state.getAccomplishmentDetailsFail,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const { windowWidth } = UseWindowDimensions();

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<OvertimeAccomplishmentApprovalPatch>({
    mode: 'onChange',
    defaultValues: {
      status: null,
      remarks: '',
    },
  });

  useEffect(() => {
    setValue('employeeId', overtimeAccomplishmentEmployeeId);
    setValue('overtimeApplicationId', overtimeAccomplishmentApplicationId);
  }, [watch('status')]);

  useEffect(() => {
    reset();
  }, [overtimeAccomplishmentModalIsOpen]);

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

  const onSubmit: SubmitHandler<OvertimeAccomplishmentApprovalPatch> = (data: OvertimeAccomplishmentApprovalPatch) => {
    if (data.status === OvertimeAccomplishmentStatus.APPROVED) {
      // setOtpOvertimeModalIsOpen(true);
    } else {
      // setDeclineApplicationModalIsOpen(true);
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
          {!accomplishmentDetails ? (
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
                            value={`${accomplishmentDetails.computedIvmsHours} Hour(s)`}
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
                            value={`${accomplishmentDetails.computedIvmsHours} Hour(s)`}
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
                      placeholder="None"
                      value={accomplishmentDetails.accomplishments}
                    ></textarea>
                  </div>
                  {accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
                    <form id="OvertimeAccomplishmentAction" onSubmit={handleSubmit(onSubmit)}>
                      <div className="w-full flex gap-2 justify-start items-center pt-4">
                        <span className="text-slate-500 text-md font-medium">Follow Estimated Hours:</span>
                        <Checkbox
                          checkboxId="with-exam"
                          label=""
                          // checked={withExam}
                          // onChange={() => setWithExam(!withExam)}
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
          <div className="flex justify-end gap-2">
            {accomplishmentDetails.status === OvertimeAccomplishmentStatus.PENDING ? (
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                form={`OvertimeAccomplishmentAction`}
                type="submit"
              >
                Submit
              </Button>
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
